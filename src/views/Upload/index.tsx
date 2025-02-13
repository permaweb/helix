import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import parse from 'html-react-parser';

import { Button } from 'components/atoms/Button';
import { Panel } from 'components/molecules/Panel';
import { AssetsTable } from 'components/organisms/AssetsTable';
import {
	CONTENT_TYPES,
	MAX_COVER_IMAGE_SIZE,
	MAX_THUMBNAIL_IMAGE_SIZE,
	MAX_UPLOAD_SIZE,
	REDIRECTS,
	TAGS,
} from 'helpers/config';
import { TagType, UploadType } from 'helpers/types';
import { fileToBuffer, formatAddress, stripFileExtension } from 'helpers/utils';
import { hideDocumentBody, showDocumentBody } from 'helpers/window';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { usePermawebProvider } from 'providers/PermawebProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';

import * as S from './styles';
import { UploadAssets } from './UploadAssets';
import { UploadSteps } from './UploadSteps';

export default function Upload() {
	const dispatch = useDispatch();

	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const arProvider = useArweaveProvider();
	const permawebProvider = usePermawebProvider();
	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [uploadIndex, setUploadIndex] = React.useState<number>(0);
	const [_uploadPercentage, setUploadPercentage] = React.useState<number>(0);

	const [collectionResponseId, setCollectionResponseId] = React.useState<string | null>(null);
	const [response, setResponse] = React.useState<string | null>(null);
	const [uploadLog, setUploadLog] = React.useState<string | null>('');
	const [errorLog, setErrorLog] = React.useState<string | null>('');

	React.useEffect(() => {
		const handleBeforeUnload = (e: any) => {
			if (process.env.NODE_ENV === 'development') return;
			e.preventDefault();
			e.returnValue = '';
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, []);

	React.useEffect(() => {
		if (!arProvider.wallet) dispatch(uploadActions.setUploadDisabled(true));
		if (arProvider.walletType) dispatch(uploadActions.setUploadDisabled(arProvider.walletType === 'arweave.app'));
	}, [arProvider]);

	React.useEffect(() => {
		let disableSubmit = false;

		if (uploadReducer.data.contentList.length > 0) {
			for (const element of uploadReducer.data.contentList) {
				if (element.file.size > MAX_UPLOAD_SIZE) disableSubmit = true;
			}
		}

		if (uploadReducer.data.banner && (uploadReducer.data.banner.length * 3) / 4 > MAX_COVER_IMAGE_SIZE) {
			disableSubmit = true;
		}

		if (uploadReducer.data.thumbnail && (uploadReducer.data.thumbnail.length * 3) / 4 > MAX_THUMBNAIL_IMAGE_SIZE) {
			disableSubmit = true;
		}

		dispatch(uploadActions.setUploadDisabled(disableSubmit));
	}, [uploadReducer.data.contentList, uploadReducer.data.banner, uploadReducer.data.thumbnail]);

	React.useEffect(() => {
		if (uploadReducer.uploadActive) hideDocumentBody();
		else showDocumentBody();
	}, [uploadReducer.uploadActive]);

	async function handleUpload() {
		if (uploadChecksPassed(arProvider, uploadReducer)) {
			dispatch(uploadActions.setUploadActive(true));
			switch (uploadReducer.uploadType) {
				case 'collection':
					try {
						const collectionId = await permawebProvider.libs.createCollection(
							{
								title: uploadReducer.data.title,
								description: uploadReducer.data.description,
								creator: arProvider.profile.id,
								thumbnail: uploadReducer.data.thumbnail,
								banner: uploadReducer.data.banner,
								skipRegistry: true, // TODO: REMOVE
							},
							(status: string) => setResponse(status)
						);

						if (collectionId) {
							const log = `<p>Collection</p> <p><a href="${REDIRECTS.bazar.collection(collectionId)}" target="_blank">${
								uploadReducer.data.title
							}</a></p>`;
							setUploadLog((prev) => prev + log);
							console.log(`Collection ID: ${collectionId}`);
							setResponse(`${language.collectionCreated}!`);

							const assetIds = await handleUploadAssets(collectionId);
							if (uploadReducer.data.idList) assetIds.push(...uploadReducer.data.idList);

							setResponse('Updating assets in collection...');

							const updateAssetsResponse = await permawebProvider.libs.updateCollectionAssets({
								collectionId: collectionId,
								assetIds: assetIds,
								creator: arProvider.profile.id,
								updateType: 'Add',
							});

							if (updateAssetsResponse) {
								setResponse(`${language.collectionCreated}!`);
								setCollectionResponseId(collectionId);
							}

							setCollectionResponseId(collectionId);
						} else {
							setResponse('Error getting collection data');
						}
					} catch (e: any) {
						console.error(e);
						setResponse(e.message ?? 'Error occurred');
					}
					break;
				case 'assets':
					try {
						const collectionId = uploadReducer.data?.collectionId;

						if (collectionId) {
							const log = `<p>Collection</p> <p><a href="${REDIRECTS.bazar.collection(collectionId)}" target="_blank">${
								uploadReducer.data.collectionName ?? formatAddress(uploadReducer.data.collectionId, false)
							}</a></p>`;
							setUploadLog((prev) => prev + log);
							console.log(`Collection ID: ${collectionId}`);
						}

						const assetIds = await handleUploadAssets(collectionId);

						if (assetIds.length > 0) {
							setResponse(`${language.assetsCreated}!`);
						} else {
							setResponse(`${language.errorOccurred}`);
						}

						if (collectionId) {
							const updateAssetsResponse = await permawebProvider.libs.updateCollectionAssets({
								collectionId: collectionId,
								assetIds: assetIds,
								creator: arProvider.profile.id,
								updateType: 'Add',
							});

							if (updateAssetsResponse) {
								setResponse(`${language.collectionUpdated}!`);
								setCollectionResponseId(collectionId);
							}
						}
					} catch (e: any) {
						console.error(e);
						setResponse(e.message ?? 'Error occurred');
					}
					break;
			}

			dispatch(uploadActions.setUploadActive(false));
			setUploadPercentage(0);
		} else {
			setResponse('Error preparing upload data');
		}
	}

	async function handleUploadAssets(collectionId: string | null) {
		if (uploadChecksPassed(arProvider, uploadReducer)) {
			let uploadedAssetsList: string[] = [];

			setUploadLog((prev) => prev + '<br /><p>Assets\n</p>');
			for (const element of uploadReducer.data.contentList) {
				const assetName = element.title || stripFileExtension(element.file.name);
				const assetDescription =
					element.description || uploadReducer.data.description || stripFileExtension(element.file.name);
				const assetSupply = uploadReducer.data.useFractionalTokens ? Number(uploadReducer.data.contentTokens) : 1;

				try {
					const buffer: any = await fileToBuffer(element.file);

					let contentType = element.file.type;
					if (
						(!contentType || !contentType.length) &&
						uploadReducer.data.renderer &&
						uploadReducer.data.renderer.includes('3d')
					) {
						contentType = CONTENT_TYPES.model;
					}

					const asset: any = {
						name: assetName,
						description: assetDescription,
						topics: uploadReducer.data.topics,
						creator: arProvider.profile.id,
						data: buffer,
						contentType: contentType,
						assetType: contentType,
						supply: assetSupply,
					};

					if (collectionId) asset.metadata = { collectionId };

					if (uploadReducer.data.hasLicense && uploadReducer.data.license)
						asset.tags = buildLicenseTags(uploadReducer.data.license);

					const assetId = await permawebProvider.libs.createAtomicAsset(asset, (status: string) => setResponse(status));

					const log = `<p><a href="${REDIRECTS.bazar.asset(assetId)}" target="_blank">${assetName}</a></p>\n`;
					setUploadIndex((prev) => prev + 1);
					setUploadLog((prev) => prev + log);
					console.log(`Asset ID: ${assetId}`);
					uploadedAssetsList.push(assetId);
				} catch (e: any) {
					setResponse(e.message ?? 'Error uploading asset');
					setErrorLog((prev) => prev + `<p id="error-log-detail">Error creating ${assetName || '-'}</p>\n`);
				}
			}

			return uploadedAssetsList;
		}
	}

	function handleClear() {
		setResponse(null);
		dispatch(uploadActions.clearUpload());
	}

	function handleUploadType(uploadType: UploadType) {
		if (uploadReducer.uploadType !== uploadType) dispatch(uploadActions.setUploadType(uploadType));
	}

	function getHeader() {
		switch (uploadReducer.uploadType) {
			case 'collection':
				return language.createACollection;
			case 'assets':
				return language.createAtomicAssets;
		}
	}

	return (
		<>
			<S.Wrapper>
				<S.HWrapper>
					<h4>{getHeader()}</h4>
					<S.TRWrapper>
						<Button
							type={'primary'}
							label={language.collection}
							handlePress={() => handleUploadType('collection')}
							active={uploadReducer.uploadType === 'collection'}
						/>
						<Button
							type={'primary'}
							label={language.atomicAssets}
							handlePress={() => handleUploadType('assets')}
							active={uploadReducer.uploadType === 'assets'}
						/>
					</S.TRWrapper>
				</S.HWrapper>
				<S.UploadWrapper>
					<S.UWrapper>
						<UploadAssets />
						{uploadReducer.uploadType === 'collection' && (
							<S.TWrapper>
								<AssetsTable useIdAction={true} useActions={false} />
							</S.TWrapper>
						)}
					</S.UWrapper>
					<S.SWrapper>
						<UploadSteps handleUpload={handleUpload} />
					</S.SWrapper>
				</S.UploadWrapper>
			</S.Wrapper>
			{(uploadReducer.uploadActive || response) && (
				<Panel
					open={true}
					width={625}
					header={uploadReducer.uploadType === 'collection' ? language.collectionUpload : language.assetUpload}
					handleClose={null}
				>
					<S.AContainer>
						<S.AMessage>
							<span>
								{uploadReducer.uploadActive
									? language.assetUploadingInfo(uploadReducer.uploadType === 'collection')
									: language.assetUploadingInfoComplete(uploadReducer.uploadType === 'collection')}
							</span>
						</S.AMessage>
						<S.AMessageAlt>
							<span>{language.uploadingAssetCount(uploadIndex, uploadReducer.data.contentList.length)}</span>
						</S.AMessageAlt>
						<S.AMessageAlt1>
							<span>{`Current status: ${response ?? '-'}`}</span>
						</S.AMessageAlt1>
						<S.ActionWrapper loading={uploadReducer.uploadActive.toString()}>
							<span>{uploadReducer.uploadActive ? `${language.inProgress}...` : language.done}</span>
						</S.ActionWrapper>
						{!uploadReducer.uploadActive && (
							<S.MActions>
								<Button type={'primary'} label={language.close} handlePress={handleClear} noMinWidth />
								{collectionResponseId && (
									<Button
										type={'alt1'}
										label={language.viewCollection}
										handlePress={() => window.open(REDIRECTS.bazar.collection(collectionResponseId), '_blank')}
										disabled={false}
										noMinWidth
									/>
								)}
							</S.MActions>
						)}
						{uploadLog && <S.MLog>{parse(uploadLog)}</S.MLog>}
						{errorLog && <S.MLog>{parse(errorLog)}</S.MLog>}
					</S.AContainer>
				</Panel>
			)}
		</>
	);
}

export function uploadChecksPassed(arProvider: any, uploadReducer: any) {
	switch (uploadReducer.uploadType) {
		case 'collection':
			return (
				arProvider.wallet &&
				arProvider.walletAddress &&
				arProvider.profile &&
				arProvider.profile.id &&
				uploadReducer.data.title &&
				uploadReducer.data.description &&
				uploadReducer.data.topics &&
				uploadReducer.data.topics.length &&
				((uploadReducer.data.contentList && uploadReducer.data.contentList.length) ||
					(uploadReducer.data.idList && uploadReducer.data.idList.length))
			);
		case 'assets':
			return (
				arProvider.wallet &&
				arProvider.walletAddress &&
				arProvider.profile &&
				arProvider.profile.id &&
				uploadReducer.data.topics &&
				uploadReducer.data.topics.length &&
				uploadReducer.data.contentList &&
				uploadReducer.data.contentList.length
			);
	}
}

function buildLicenseTags(licenseObject: any) {
	let licenseTags: TagType[] = [
		{ name: TAGS.keys.license, value: TAGS.values.license },
		{ name: TAGS.keys.currency, value: TAGS.values.licenseCurrency },
	];
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
