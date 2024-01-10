import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ArweaveWebIrys } from '@irys/sdk/build/esm/web/tokens/arweave';

import { createContract, createTransaction } from 'api';

import { Button } from 'components/atoms/Button';
import { Modal } from 'components/molecules/Modal';
import { ASSET_CONTRACT, CONTENT_TYPES, REDIRECTS, TAGS, UPLOAD_CONFIG } from 'helpers/config';
import { TagType } from 'helpers/types';
import { base64ToUint8Array, fileToBuffer, getBase64Data, getDataURLContentType } from 'helpers/utils';
import { hideDocumentBody, showDocumentBody } from 'helpers/window';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';

import { AssetsTable } from '../../components/organisms/AssetsTable';

import * as S from './styles';
import { UploadAssets } from './UploadAssets';
import { UploadSteps } from './UploadSteps';

export default function Upload() {
	const dispatch = useDispatch();

	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const arProvider = useArweaveProvider();
	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [uploadIndex, setUploadIndex] = React.useState<number>(0);
	const [uploadPercentage, setUploadPercentage] = React.useState<number>(0);
	const [collectionResponse, setCollectionResponse] = React.useState<string | null>(null);
	const [collectionResponseError, setCollectionResponseError] = React.useState<string | null>(null);

	React.useEffect(() => {
		const handleBeforeUnload = (e: any) => {
			e.preventDefault();
			e.returnValue = '';
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [uploadReducer]);

	React.useEffect(() => {
		if (!arProvider.wallet) dispatch(uploadActions.setUploadDisabled(true));
		if (arProvider.walletType) dispatch(uploadActions.setUploadDisabled(arProvider.walletType === 'arweave.app'));
	}, [arProvider]);

	React.useEffect(() => {
		if (uploadReducer.uploadActive) hideDocumentBody();
		else showDocumentBody();
	}, [uploadReducer.uploadActive]);

	async function handleUpload() {
		if (uploadChecksPassed(arProvider, uploadReducer)) {
			dispatch(uploadActions.setUploadActive(true));

			let index = 0;
			let uploadedAssetsList: string[] = [];
			for (const data of uploadReducer.data.contentList) {
				setUploadIndex(index + 1);

				const irys = new ArweaveWebIrys({
					url: UPLOAD_CONFIG.node2,
					wallet: { provider: arProvider.wallet },
				});
				await irys.ready();

				let uploader = irys.uploader.chunkedUploader;
				uploader.setBatchSize(UPLOAD_CONFIG.batchSize);
				uploader.setChunkSize(UPLOAD_CONFIG.chunkSize);

				uploader.on('chunkUpload', (chunkInfo) => {
					setUploadPercentage(Math.floor((chunkInfo.totalUploaded / data.file.size) * 100));
				});

				uploader.on('chunkError', (e) => {
					console.error(e);
				});

				const dateTime = new Date().getTime().toString();

				const title = data.title ? data.title : `${uploadReducer.data.title} #${index + 1}`;
				const description = data.description ? data.description : uploadReducer.data.description;
				const type = data.file.type;

				try {
					let initStateAssetJson: any = {
						balances: {
							[arProvider.walletAddress]: Number(uploadReducer.data.contentTokens),
						},
						title: title,
						description: description,
						ticker: TAGS.values.ticker,
						dateCreated: dateTime,
						claimable: [],
					};

					initStateAssetJson = JSON.stringify(initStateAssetJson);

					const assetTags: TagType[] = [
						{ name: TAGS.keys.contractSrc, value: ASSET_CONTRACT.src },
						{ name: TAGS.keys.smartweaveAppName, value: TAGS.values.smartweaveAppName },
						{ name: TAGS.keys.smartweaveAppVersion, value: TAGS.values.smartweaveAppVersion },
						{ name: TAGS.keys.contentType, value: type },
						{ name: TAGS.keys.appVersion, value: TAGS.values.appVersion },
						{ name: TAGS.keys.initState, value: initStateAssetJson },
						{ name: TAGS.keys.initialOwner, value: arProvider.walletAddress },
						{ name: TAGS.keys.ans110.title, value: title },
						{ name: TAGS.keys.ans110.description, value: description },
						{ name: TAGS.keys.ans110.type, value: type },
						{ name: TAGS.keys.ans110.implements, value: TAGS.values.ansVersion },
						{ name: TAGS.keys.dateCreated, value: dateTime },
					];

					uploadReducer.data.topics.forEach((topic: string) =>
						assetTags.push({ name: TAGS.keys.topic(topic), value: topic })
					);

					if (uploadReducer.data.hasLicense && uploadReducer.data.license)
						assetTags.push(...buildLicenseTags(uploadReducer.data.license));

					if (uploadReducer.data.collectionCode)
						assetTags.push({ name: TAGS.keys.collectionCode, value: uploadReducer.data.collectionCode });

					const buffer = await fileToBuffer(data.file);
					const txResponse = await uploader.uploadData(buffer as any, { tags: assetTags } as any);

					const contractResponse = await createContract({ assetId: txResponse.data.id });

					if (contractResponse) uploadedAssetsList.push(contractResponse);
					setUploadPercentage(0);
				} catch (e: any) {
					console.error(e);
				}
			}

			let bannerTx: any = null;
			if (uploadReducer.data.banner) {
				try {
					const bannerContentType = getDataURLContentType(uploadReducer.data.banner);
					const base64Data = getBase64Data(uploadReducer.data.banner);
					const uint8ArrayData = base64ToUint8Array(base64Data);

					bannerTx = await createTransaction({
						content: uint8ArrayData,
						contentType: bannerContentType,
						tags: [{ name: TAGS.keys.contentType, value: bannerContentType }],
					});
				} catch (e: any) {
					console.error(e);
				}
			}

			let thumbnailTx: any = null;
			if (uploadReducer.data.thumbnail) {
				try {
					const thumbnailContentType = getDataURLContentType(uploadReducer.data.thumbnail);
					const base64Data = getBase64Data(uploadReducer.data.thumbnail);
					const uint8ArrayData = base64ToUint8Array(base64Data);

					thumbnailTx = await createTransaction({
						content: uint8ArrayData,
						contentType: thumbnailContentType,
						tags: [{ name: TAGS.keys.contentType, value: thumbnailContentType }],
					});
				} catch (e: any) {
					console.error(e);
				}
			}

			try {
				const irys = new ArweaveWebIrys({
					url: UPLOAD_CONFIG.node2,
					wallet: { provider: arProvider.wallet },
				});
				await irys.ready();

				const dateTime = new Date().getTime().toString();

				let initStateCollectionJson: any = {
					balances: {
						[arProvider.walletAddress]: 1,
					},
					creator: arProvider.walletAddress,
					name: uploadReducer.data.title,
					description: uploadReducer.data.description,
					ticker: TAGS.values.ticker,
					dateCreated: dateTime,
					claimable: [],
				};

				initStateCollectionJson = JSON.stringify(initStateCollectionJson);

				const collectionTags: TagType[] = [
					{ name: TAGS.keys.contentType, value: CONTENT_TYPES.json },
					{ name: TAGS.keys.initState, value: initStateCollectionJson },
					{ name: TAGS.keys.creator, value: arProvider.walletAddress },
					{ name: TAGS.keys.dataProtocol, value: TAGS.values.collection },
					{
						name: TAGS.keys.smartweaveAppName,
						value: TAGS.values.smartweaveAppName,
					},
					{
						name: TAGS.keys.smartweaveAppVersion,
						value: TAGS.values.smartweaveAppVersion,
					},
					{ name: TAGS.keys.contractSrc, value: ASSET_CONTRACT.src },
					{
						name: TAGS.keys.contractManifest,
						value: TAGS.values.contractManifest,
					},
					{
						name: TAGS.keys.ans110.title,
						value: uploadReducer.data.title,
					},
					{
						name: TAGS.keys.ans110.description,
						value: uploadReducer.data.description,
					},
					{ name: TAGS.keys.ans110.type, value: TAGS.values.document },
					{ name: TAGS.keys.dateCreated, value: dateTime },
					{
						name: TAGS.keys.name,
						value: uploadReducer.data.title,
					},
				];

				if (bannerTx) collectionTags.push({ name: TAGS.keys.banner, value: bannerTx });
				if (thumbnailTx) collectionTags.push({ name: TAGS.keys.thumbnail, value: thumbnailTx });

				const collectionData = JSON.stringify({
					type: TAGS.values.collection,
					items: [...uploadedAssetsList, ...uploadReducer.data.idList],
				});

				const collectionResult = await irys.upload(collectionData as any, { tags: collectionTags } as any);

				setCollectionResponse(collectionResult.id);

				dispatch(uploadActions.setUploadActive(false));
				dispatch(uploadActions.clearUpload());
				setUploadPercentage(0);
			} catch (e: any) {
				console.error(e);
				setCollectionResponseError(e.message);
				dispatch(uploadActions.setUploadActive(false));
			}
		}
	}

	function handleClear() {
		if (collectionResponse) {
			setCollectionResponse(null);
			dispatch(uploadActions.clearUpload());
		}
		if (collectionResponseError) setCollectionResponseError(null);
	}

	return (
		<>
			<S.Wrapper>
				<div className={'max-view-wrapper'}>
					<h4>{language.createACollection}</h4>
				</div>
				<S.UploadWrapper className={'max-view-wrapper'}>
					<S.UWrapper>
						<UploadAssets />
						<S.TWrapper>
							<AssetsTable useIdAction={true} />
						</S.TWrapper>
					</S.UWrapper>
					<S.SWrapper>
						<UploadSteps handleUpload={handleUpload} />
					</S.SWrapper>
				</S.UploadWrapper>
			</S.Wrapper>
			{uploadReducer.uploadActive && (
				<Modal header={language.uploading} handleClose={null}>
					<S.AContainer>
						<S.AMessage>
							<span>{language.assetUploadingInfo}</span>
						</S.AMessage>
						<S.AMessage>
							<span>{language.uploadingFileCount(uploadIndex, uploadReducer.data.contentList.length)}</span>
						</S.AMessage>
						<S.AProgress percentage={uploadPercentage.toString()}>
							<div />
							<span>{`${language.uploadStatus}:`}</span>
							&nbsp;
							<S.APercentage>{`${uploadPercentage.toString()}%`}</S.APercentage>
						</S.AProgress>
					</S.AContainer>
				</Modal>
			)}
			{(collectionResponse || collectionResponseError) && (
				<Modal
					header={collectionResponse ? language.collectionCreated : language.errorOccurred}
					handleClose={() => setCollectionResponse(null)}
				>
					<S.MWrapper>
						<S.MInfo>
							<span>{collectionResponse ? language.collectionUploadedInfo : collectionResponseError}</span>
						</S.MInfo>
						<S.MActions>
							<Button type={'primary'} label={language.close} handlePress={handleClear} noMinWidth />
							{collectionResponse && (
								<Button
									type={'alt1'}
									label={language.viewCollection}
									handlePress={() => window.open(REDIRECTS.bazar.collection(collectionResponse), '_blank')}
									disabled={false}
									noMinWidth
								/>
							)}
						</S.MActions>
					</S.MWrapper>
				</Modal>
			)}
		</>
	);
}

export function uploadChecksPassed(arProvider: any, uploadReducer: any) {
	return (
		arProvider.wallet &&
		arProvider.walletAddress &&
		uploadReducer.data.title &&
		uploadReducer.data.description &&
		uploadReducer.data.topics &&
		uploadReducer.data.topics.length &&
		((uploadReducer.data.contentList && uploadReducer.data.contentList.length) ||
			(uploadReducer.data.idList && uploadReducer.data.idList.length))
	);
}

function buildLicenseTags(licenseObject: any) {
	let licenseTags: TagType[] = [{ name: TAGS.keys.license, value: TAGS.values.license }];
	if (licenseObject.accessFee && licenseObject.accessFee.value) {
		licenseTags.push({
			name: 'Access-Fee',
			value:
				licenseObject.accessFee.value !== 'None'
					? `${licenseObject.accessFee.value}-${licenseObject.accessFee.amount}`
					: licenseObject.accessFee.value,
		});
	}
	if (licenseObject.derivations && licenseObject.derivations.value) {
		licenseTags.push({
			name: 'Derivations',
			value:
				licenseObject.derivations.value !== 'Disallowed'
					? `${licenseObject.derivations.value}-${licenseObject.derivations.terms.value}-${licenseObject.derivations.terms.amount}`
					: licenseObject.derivations.value,
		});
	}
	if (licenseObject.commercialUse && licenseObject.commercialUse.value) {
		licenseTags.push({
			name: 'Commercial-Use',
			value:
				licenseObject.commercialUse.value !== 'Disallowed'
					? `${licenseObject.commercialUse.value}-${licenseObject.commercialUse.terms.value}-${licenseObject.commercialUse.terms.amount}`
					: licenseObject.commercialUse.value,
		});
	}
	if (licenseObject.dataModelTraining && licenseObject.dataModelTraining.value) {
		licenseTags.push({
			name: 'Data-Model-Training',
			value:
				licenseObject.dataModelTraining.value !== 'Disallowed'
					? `${licenseObject.dataModelTraining.value}-${licenseObject.dataModelTraining.terms.value}-${licenseObject.dataModelTraining.terms.amount}`
					: licenseObject.dataModelTraining.value,
		});
	}
	if (licenseObject.paymentMode && licenseObject.paymentMode.value) {
		licenseTags.push({
			name: 'Payment-Mode',
			value: licenseObject.paymentMode.value,
		});
	}
	if (licenseObject.paymentMode && licenseObject.paymentMode.recipient) {
		licenseTags.push({
			name: 'Payment-Address',
			value: licenseObject.paymentMode.recipient,
		});
	}
	return licenseTags;
}
