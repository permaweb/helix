import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ArweaveWebIrys } from '@irys/sdk/build/esm/web/tokens/arweave';

import { createContract, createTransaction } from 'api';
import { getCurrentProfile } from 'gql';

import { Button } from 'components/atoms/Button';
import { Portal } from 'components/atoms/Portal';
import { Modal } from 'components/molecules/Modal';
import { ASSET_CONTRACT, CONTENT_TYPES, DOM, TAGS, UPLOAD_CONFIG, URLS } from 'helpers/config';
import { TagType } from 'helpers/types';
import { base64ToUint8Array, fileToBuffer, getBase64Data, getDataURLContentType } from 'helpers/utils';
import { hideDocumentBody, showDocumentBody } from 'helpers/window';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';

import * as S from './styles';
import { UploadAsset } from './UploadAsset';
import { UploadSteps } from './UploadSteps';
import { UploadThumbnail } from './UploadThumbnail';

export default function Upload() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const arProvider = useArweaveProvider();
	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [uploadPercentage, setUploadPercentage] = React.useState<number>(0);
	const [assetResponse, setAssetResponse] = React.useState<string | null>(null);
	const [assetResponseError, setAssetResponseError] = React.useState<string | null>(null);

	const [profileExists, setProfileExists] = React.useState<boolean>(true);

	// React.useEffect(() => {
	// 	const handleBeforeUnload = (e: any) => {
	// 		e.preventDefault();
	// 		e.returnValue = '';
	// 	};

	// 	window.addEventListener('beforeunload', handleBeforeUnload);

	// 	return () => {
	// 		window.removeEventListener('beforeunload', handleBeforeUnload);
	// 	};
	// }, [uploadReducer]);

	React.useEffect(() => {
		(async function () {
			if (arProvider.walletAddress) {
				try {
					setProfileExists((await getCurrentProfile({ address: arProvider.walletAddress })).txId !== null);
				} catch (e: any) {
					console.error(e);
				}
			}
		})();
	}, [arProvider.walletAddress]);

	React.useEffect(() => {
		if (!arProvider.wallet) dispatch(uploadActions.setUploadDisabled(true));
		if (arProvider.walletType) dispatch(uploadActions.setUploadDisabled(arProvider.walletType === 'arweave.app'));
	}, [arProvider]);

	React.useEffect(() => {
		if (uploadReducer.uploadActive) hideDocumentBody();
		else showDocumentBody();
	}, [uploadReducer.uploadActive]);

	// Disable upload if turbo balance is not fetched
	// React.useEffect(() => {
	// 	if (arProvider.turboBalance === null) dispatch(uploadActions.setUploadDisabled(true));
	// 	else {
	// 		if (typeof arProvider.turboBalance === 'number' && uploadReducer.uploadCost) {
	// 			dispatch(uploadActions.setUploadDisabled(arProvider.turboBalance < uploadReducer.uploadCost));
	// 		}
	// 	}
	// }, [arProvider.turboBalance, uploadReducer.uploadCost]);

	async function handleUpload() {
		if (uploadChecksPassed(arProvider, uploadReducer)) {
			dispatch(uploadActions.setUploadActive(true));
			const irys = new ArweaveWebIrys({
				url: UPLOAD_CONFIG.node2,
				wallet: { provider: arProvider.wallet },
			});
			await irys.ready();

			// let uploader = irys.uploader.chunkedUploader;
			// uploader.setBatchSize(UPLOAD_CONFIG.batchSize);
			// uploader.setChunkSize(UPLOAD_CONFIG.chunkSize);

			// uploader.on('chunkUpload', (chunkInfo) => {
			// 	setUploadPercentage(Math.floor((chunkInfo.totalUploaded / uploadReducer.data.content.size) * 100));
			// });

			// uploader.on('chunkError', (e) => {
			// 	console.error(e);
			// });

			const dateTime = new Date().getTime().toString();

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

			let initStateJson: any = {
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

			initStateJson = JSON.stringify(initStateJson);

			// TODO: add thumbnail
			// TODO: add collection code
			const collectionTags: TagType[] = [
				{ name: TAGS.keys.contentType, value: CONTENT_TYPES.json },
				{ name: TAGS.keys.initState, value: initStateJson },
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

			//   uploadReducer.data.topics.forEach((topic: string) =>
			//     tags.push({ name: TAGS.keys.topic(topic), value: topic })
			//   );
			if (thumbnailTx) collectionTags.push({ name: TAGS.keys.thumbnail, value: thumbnailTx });
			//   if (uploadReducer.data.contentLength)
			//     tags.push({
			//       name: TAGS.keys.contentLength,
			//       value: uploadReducer.data.contentLength.toString(),
			//     });
			//   if (uploadReducer.data.hasLicense && uploadReducer.data.license)
			//     tags.push(...buildLicenseTags(uploadReducer.data.license));

			try {
				// const buffer = await fileToBuffer(uploadReducer.data.content);
				// const txResponse = await uploader.uploadData(buffer as any, { tags } as any);

				// const contractResponse = await createContract({ assetId: txResponse.data.id });

				// setAssetResponse(contractResponse);

				// TODO: collection tag
				// const data = JSON.stringify({
				//   type: TAGS.values.collection,
				//   items: [],
				// });

				const collectionData = JSON.stringify({
					type: 'Test-Collection',
					items: [],
				});

				const result = await irys.upload(collectionData as any, { tags: collectionTags } as any);

				console.log(result);

				dispatch(uploadActions.setUploadActive(false));
				dispatch(uploadActions.clearUpload());
				setUploadPercentage(0);
			} catch (e: any) {
				console.error(e);
				setAssetResponseError(e.message);
				dispatch(uploadActions.setUploadActive(false));
			}
		}
	}

	return (
		<>
			<S.Wrapper className={'max-view-wrapper'}>
				<S.UWrapper>
					{/* <UploadAsset /> */}
					<UploadThumbnail />
				</S.UWrapper>
				<S.SWrapper>
					<UploadSteps handleUpload={handleUpload} />
				</S.SWrapper>
			</S.Wrapper>
			{uploadReducer.uploadActive && (
				<Portal node={DOM.overlay}>
					<S.AWrapper className={'overlay'}>
						<S.AContainer>
							<S.AProgress percentage={uploadPercentage.toString()}>
								<div />
								<span>{language.assetUploading}</span>
								&nbsp;
								<S.APercentage>{`${uploadPercentage.toString()}%`}</S.APercentage>
							</S.AProgress>
							<S.AMessage>
								<span>{language.assetUploadingInfo}</span>
							</S.AMessage>
						</S.AContainer>
					</S.AWrapper>
				</Portal>
			)}
			{(assetResponse || assetResponseError) && (
				<Modal
					header={assetResponse ? language.assetUploaded : language.errorOccurred}
					handleClose={() => setAssetResponse(null)}
				>
					<S.MWrapper>
						<S.MInfo>
							<span>{assetResponse ? language.assetUploadedInfo : assetResponseError}</span>
						</S.MInfo>
						<S.MActions>
							<Button
								type={'primary'}
								label={language.close}
								handlePress={() => (assetResponse ? setAssetResponse(null) : setAssetResponseError(null))}
							/>
							{assetResponse && (
								<Button
									type={'alt1'}
									label={language.viewAsset}
									handlePress={() => navigate(`${URLS.asset}${assetResponse}`)}
									disabled={false}
								/>
							)}
						</S.MActions>
					</S.MWrapper>
				</Modal>
			)}
			{!profileExists && (
				<Modal header={language.signUpRequired} handleClose={null}>
					<S.MWrapper>
						<S.MInfo>
							<span>{language.signUpRequiredInfo}</span>
						</S.MInfo>
						<S.MActions>
							<Button
								type={'alt1'}
								label={language.signUp}
								handlePress={() => navigate(URLS.signup)}
								disabled={false}
							/>
						</S.MActions>
					</S.MWrapper>
				</Modal>
			)}
		</>
	);
}

// uploadReducer.data.content &&
// uploadReducer.data.contentType &&
// uploadReducer.data.thumbnail

export function uploadChecksPassed(arProvider: any, uploadReducer: any) {
	return arProvider.wallet && arProvider.walletAddress && uploadReducer.data.title && uploadReducer.data.description;
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
