import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { connect, createDataItemSigner } from '@permaweb/aoconnect';

import { createTransaction, messageResults } from 'api';
import { getGQLData } from 'gql';

import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { Modal } from 'components/molecules/Modal';
import { AssetsTable } from 'components/organisms/AssetsTable';
import {
	AO,
	CONTENT_TYPES,
	DEFAULT_UCM_BANNER,
	DEFAULT_UCM_THUMBNAIL,
	GATEWAYS,
	MAX_UPLOAD_SIZE,
	REDIRECTS,
	TAGS,
} from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { TagType, UploadType } from 'helpers/types';
import {
	base64ToUint8Array,
	fileToBuffer,
	getBase64Data,
	getDataURLContentType,
	stripFileExtension,
} from 'helpers/utils';
import { hideDocumentBody, showDocumentBody } from 'helpers/window';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';

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
	const [_uploadPercentage, setUploadPercentage] = React.useState<number>(0);

	const [assetsResponse, setAssetsResponse] = React.useState<string | null>(null);
	const [assetsResponseError, setAssetsResponseError] = React.useState<string | null>(null);

	const [collectionProcessId, setCollectionProcessId] = React.useState<string | null>(null);
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
		if (uploadReducer.data.contentList.length > 0) {
			let disableSubmit = false;
			for (const element of uploadReducer.data.contentList) {
				if (element.file.size > MAX_UPLOAD_SIZE) disableSubmit = true;
			}
			dispatch(uploadActions.setUploadDisabled(disableSubmit));
		}
	}, [uploadReducer.data.contentList]);

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
						const collectionId = await handleUploadCollection();

						if (collectionId) {
							const assetIds = await handleUploadAssets(collectionId);
							if (uploadReducer.data.idList) assetIds.push(...uploadReducer.data.idList);

							const updateAssetsResponse = await messageResults({
								processId: arProvider.profile.id,
								action: 'Run-Action',
								wallet: arProvider.wallet,
								tags: null,
								data: {
									Target: collectionId,
									Action: 'Update-Assets',
									Input: JSON.stringify({
										AssetIds: assetIds,
										UpdateType: 'Add',
									}),
								},
								handler: 'Update-Assets',
							});

							if (updateAssetsResponse) {
								setCollectionResponse(`${language.collectionCreated}!`);
								setCollectionProcessId(collectionId);
							}
							setCollectionResponse('Error occurred');
						} else {
							console.error('Error creating collection');
						}
					} catch (e: any) {
						console.error(e);
						setCollectionResponse(e.message ?? 'Error occurred');
					}
					break;
				case 'assets':
					try {
						const assetIds = await handleUploadAssets(null);
						if (assetIds.length > 0) {
							setAssetsResponse(`${language.assetsCreated}!`);
						} else {
							setAssetsResponseError(`${language.errorOccurred}`);
						}
					} catch (e: any) {
						console.error(e);
						setAssetsResponseError(e.message ?? 'Error occurred');
					}
					break;
			}

			dispatch(uploadActions.setUploadActive(false));
			dispatch(uploadActions.clearUpload());
			setUploadPercentage(0);
		}
	}

	async function handleUploadCollection() {
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
			const dateTime = new Date().getTime().toString();

			const collectionTags: TagType[] = [
				{ name: TAGS.keys.contentType, value: CONTENT_TYPES.json },
				{ name: TAGS.keys.creator, value: arProvider.walletAddress },
				{ name: TAGS.keys.profileCreator, value: arProvider.profile.id },
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
				{ name: 'Action', value: 'Add-Collection' },
			];

			if (bannerTx) collectionTags.push({ name: TAGS.keys.banner, value: bannerTx });
			if (thumbnailTx) collectionTags.push({ name: TAGS.keys.thumbnail, value: thumbnailTx });

			const aos = connect();

			let processSrc = null;

			try {
				const processSrcFetch = await fetch(getTxEndpoint(AO.collectionSrc));
				if (processSrcFetch.ok) {
					processSrc = await processSrcFetch.text();
				}
			} catch (e: any) {
				console.error(e);
			}

			if (processSrc) {
				processSrc = processSrc.replaceAll(`'<NAME>'`, `[[${uploadReducer.data.title}]]`);
				processSrc = processSrc.replaceAll(`'<DESCRIPTION>'`, `[[${uploadReducer.data.description}]]`);
				processSrc = processSrc.replaceAll('<CREATOR>', arProvider.profile.id);
				processSrc = processSrc.replaceAll('<BANNER>', bannerTx ? bannerTx : DEFAULT_UCM_BANNER);
				processSrc = processSrc.replaceAll('<THUMBNAIL>', thumbnailTx ? thumbnailTx : DEFAULT_UCM_THUMBNAIL);

				processSrc = processSrc.replaceAll('<DATECREATED>', dateTime);
				processSrc = processSrc.replaceAll('<LASTUPDATE>', dateTime);
			}

			let processId: string;
			let retryCount = 0;
			const maxRetries = 25;

			while (!processId && retryCount < maxRetries) {
				try {
					processId = await aos.spawn({
						module: AO.module,
						scheduler: AO.scheduler,
						signer: createDataItemSigner(globalThis.arweaveWallet),
						tags: collectionTags,
					});
					console.log(`Collection process: ${processId}`);
				} catch (e: any) {
					console.error(`Spawn attempt ${retryCount + 1} failed:`, e);
					retryCount++;
					if (retryCount < maxRetries) {
						await new Promise((r) => setTimeout(r, 1000));
					} else {
						throw new Error(`Failed to spawn process after ${maxRetries} attempts`);
					}
				}
			}

			let fetchedCollectionId: string;
			retryCount = 0;
			while (!fetchedCollectionId) {
				await new Promise((r) => setTimeout(r, 2000));
				const gqlResponse = await getGQLData({
					gateway: GATEWAYS.goldsky,
					ids: [processId],
					tagFilters: null,
					owners: null,
					cursor: null,
					reduxCursor: null,
					cursorObjectKey: null,
				});

				if (gqlResponse && gqlResponse.data.length) {
					console.log(`Fetched transaction`, gqlResponse.data[0].node.id, 0);
					fetchedCollectionId = gqlResponse.data[0].node.id;
				} else {
					console.log(`Transaction not found`, processId, 0);
					retryCount++;
					if (retryCount >= 10) {
						throw new Error(`Transaction not found after 10 attempts, process deployment retries failed`);
					}
				}
			}

			if (fetchedCollectionId) {
				const evalMessage = await aos.message({
					process: processId,
					signer: createDataItemSigner(globalThis.arweaveWallet),
					tags: [{ name: 'Action', value: 'Eval' }],
					data: processSrc,
				});

				const evalResult = await aos.result({
					message: evalMessage,
					process: processId,
				});

				if (evalResult) {
					const registryTags = [
						{ name: 'Action', value: 'Add-Collection' },
						{ name: 'CollectionId', value: processId },
						{ name: 'Name', value: uploadReducer.data.title },
						{ name: 'Creator', value: arProvider.profile.id },
						{ name: 'DateCreated', value: dateTime },
					];

					if (bannerTx) registryTags.push({ name: 'Banner', value: bannerTx });
					if (thumbnailTx) registryTags.push({ name: 'Thumbnail', value: thumbnailTx });

					await aos.message({
						process: AO.collectionsRegistry,
						signer: createDataItemSigner(globalThis.arweaveWallet),
						tags: registryTags,
					});

					await aos.message({
						process: processId,
						signer: createDataItemSigner(globalThis.arweaveWallet),
						tags: [
							{ name: 'Action', value: 'Add-Collection-To-Profile' },
							{ name: 'ProfileProcess', value: arProvider.profile.id },
						],
					});

					return processId;
				} else {
					return null;
				}
			} else {
				setCollectionResponseError('Error fetching from gateway');
			}
		} catch (e: any) {
			console.error(e);
			setCollectionResponseError(e.message);
			dispatch(uploadActions.setUploadActive(false));
		}
	}

	async function handleUploadAssets(collectionId: string | null) {
		if (uploadChecksPassed(arProvider, uploadReducer)) {
			let index = 0;
			let assetError = null;
			let uploadedAssetsList: string[] = [];
			for (const data of uploadReducer.data.contentList) {
				index = index + 1;
				setUploadIndex(index);

				const dateTime = new Date().getTime().toString();

				const title = data.title ? data.title : stripFileExtension(data.file.name);
				const description = data.description
					? data.description
					: uploadReducer.data.description
					? uploadReducer.data.description
					: stripFileExtension(data.file.name);
				const type = data.file.type;
				const balance = uploadReducer.data.useFractionalTokens ? Number(uploadReducer.data.contentTokens) : 1;

				try {
					const assetTags: TagType[] = [
						{ name: TAGS.keys.contentType, value: type },
						{ name: TAGS.keys.creator, value: arProvider.profile.id },
						{ name: TAGS.keys.ans110.title, value: title },
						{ name: TAGS.keys.ans110.description, value: description },
						{ name: TAGS.keys.ans110.type, value: type },
						{ name: TAGS.keys.ans110.implements, value: TAGS.values.ansVersion },
						{ name: TAGS.keys.dateCreated, value: dateTime },
						{ name: 'Action', value: 'Add-Uploaded-Asset' },
					];

					uploadReducer.data.topics.forEach((topic: string) =>
						assetTags.push({ name: TAGS.keys.topic(topic), value: topic })
					);

					if (uploadReducer.data.hasLicense && uploadReducer.data.license)
						assetTags.push(...buildLicenseTags(uploadReducer.data.license));

					if (collectionId) {
						assetTags.push({ name: TAGS.keys.collectionId, value: collectionId });
						if (uploadReducer.data.title) {
							assetTags.push({ name: TAGS.keys.collectionName, value: uploadReducer.data.title });
						}
					}

					const aos = connect();

					let processSrc = null;
					const buffer: any = await fileToBuffer(data.file);

					try {
						const processSrcFetch = await fetch(getTxEndpoint(AO.assetSrc));
						if (processSrcFetch.ok) {
							processSrc = await processSrcFetch.text();
						}
					} catch (e: any) {
						console.error(e);
					}

					if (processSrc) {
						processSrc = processSrc.replace('[Owner]', `['${arProvider.profile.id}']`);
						processSrc = processSrc.replaceAll(`'<NAME>'`, `[[${title}]]`);
						processSrc = processSrc.replaceAll('<TICKER>', 'ATOMIC');
						processSrc = processSrc.replaceAll('<DENOMINATION>', '1');
						processSrc = processSrc.replaceAll('<BALANCE>', balance.toString());

						if (!uploadReducer.data.transferableTokens) {
							processSrc = processSrc.replace('Transferable = true', 'Transferable = false');
						}
					}

					let processId: string;
					let retryCount = 0;
					const maxRetries = 25;

					while (!processId && retryCount < maxRetries) {
						try {
							processId = await aos.spawn({
								module: AO.module,
								scheduler: AO.scheduler,
								signer: createDataItemSigner(globalThis.arweaveWallet),
								tags: assetTags,
								data: buffer,
							});
							console.log(`Asset process: ${processId}`);
						} catch (e: any) {
							console.error(`Spawn attempt ${retryCount + 1} failed:`, e);
							retryCount++;
							if (retryCount < maxRetries) {
								await new Promise((r) => setTimeout(r, 1000));
							} else {
								throw new Error(`Failed to spawn process after ${maxRetries} attempts`);
							}
						}
					}

					let fetchedAssetId: string;
					retryCount = 0;
					while (!fetchedAssetId) {
						await new Promise((r) => setTimeout(r, 2000));
						const gqlResponse = await getGQLData({
							gateway: GATEWAYS.goldsky,
							ids: [processId],
							tagFilters: null,
							owners: null,
							cursor: null,
							reduxCursor: null,
							cursorObjectKey: null,
						});

						if (gqlResponse && gqlResponse.data.length) {
							console.log(`Fetched transaction:`, gqlResponse.data[0].node.id);
							fetchedAssetId = gqlResponse.data[0].node.id;
						} else {
							console.log(`Transaction not found:`, processId);
							retryCount++;
							if (retryCount >= 10) {
								throw new Error(`Transaction not found after 10 attempts, process deployment retries failed`);
							}
						}
					}

					if (fetchedAssetId) {
						const evalMessage = await aos.message({
							process: processId,
							signer: createDataItemSigner(globalThis.arweaveWallet),
							tags: [{ name: 'Action', value: 'Eval' }],
							data: processSrc,
						});

						const evalResult = await aos.result({
							message: evalMessage,
							process: processId,
						});

						if (evalResult) {
							await aos.message({
								process: processId,
								signer: createDataItemSigner(globalThis.arweaveWallet),
								tags: [
									{ name: 'Action', value: 'Add-Asset-To-Profile' },
									{ name: 'ProfileProcess', value: arProvider.profile.id },
									{ name: 'Quantity', value: balance.toString() },
								],
								data: JSON.stringify({ Id: processId, Quantity: balance }),
							});

							uploadedAssetsList.push(processId);
						}

						if (index < uploadReducer.data.contentList.length) setUploadPercentage(0);
					} else {
						setAssetsResponseError('Error fetching from gateway');
					}
				} catch (e: any) {
					console.error(e.message);
					assetError = e.message;
					setAssetsResponseError(assetError);
					setUploadPercentage(0);
					dispatch(uploadActions.clearUpload());
				}
			}

			return uploadedAssetsList;
		}
	}

	function handleClear() {
		if (collectionResponse || assetsResponse) {
			if (collectionResponse) setCollectionResponse(null);
			if (assetsResponse) setAssetsResponse(null);
			dispatch(uploadActions.clearUpload());
		}
		if (collectionResponseError) setCollectionResponseError(null);
		if (assetsResponseError) setAssetsResponseError(null);
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
								<AssetsTable useIdAction={true} />
							</S.TWrapper>
						)}
					</S.UWrapper>
					<S.SWrapper>
						<UploadSteps handleUpload={handleUpload} />
					</S.SWrapper>
				</S.UploadWrapper>
			</S.Wrapper>
			{uploadReducer.uploadActive && (
				<Modal header={language.uploading} handleClose={null}>
					<S.AContainer>
						{uploadReducer.data.contentList && uploadReducer.data.contentList.length ? (
							<>
								<S.AMessage>
									<span>{language.assetUploadingInfo(uploadReducer.uploadType === 'collection')}</span>
								</S.AMessage>
								<S.AMessageAlt>
									<span>{language.uploadingFileCount(uploadIndex, uploadReducer.data.contentList.length)}</span>
								</S.AMessageAlt>
								<S.ActionWrapper loading={'true'}>
									<span>{`${language.inProgress}...`}</span>
								</S.ActionWrapper>
							</>
						) : (
							<Loader sm relative />
						)}
					</S.AContainer>
				</Modal>
			)}
			{(collectionResponse || collectionResponseError) && (
				<Modal
					header={collectionResponse ? language.collectionCreated : language.errorOccurred}
					handleClose={handleClear}
				>
					<S.MWrapper>
						<S.MInfo>
							<span>{collectionResponse ? language.collectionUploadedInfo : collectionResponseError}</span>
						</S.MInfo>
						<S.MActions>
							<Button type={'primary'} label={language.close} handlePress={handleClear} noMinWidth />
							{collectionProcessId && (
								<Button
									type={'alt1'}
									label={language.viewCollection}
									handlePress={() => window.open(REDIRECTS.bazar.collection(collectionProcessId), '_blank')}
									disabled={false}
									noMinWidth
								/>
							)}
						</S.MActions>
					</S.MWrapper>
				</Modal>
			)}
			{(assetsResponse || assetsResponseError) && (
				<Modal header={assetsResponse ? assetsResponse : language.errorOccurred} handleClose={handleClear}>
					<S.MWrapper>
						<S.MInfo>
							<span>
								{assetsResponse
									? language.assetsCreatedInfo
									: assetsResponseError
									? assetsResponseError
									: language.errorOccurred}
							</span>
						</S.MInfo>
						<S.MActions>
							<Button type={'primary'} label={language.close} handlePress={handleClear} noMinWidth />
						</S.MActions>
					</S.MWrapper>
				</Modal>
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
