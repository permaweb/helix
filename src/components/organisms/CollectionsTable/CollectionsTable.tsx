import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { messageResults, readHandler } from 'api';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
import { Modal } from 'components/molecules/Modal';
import { Table } from 'components/molecules/Table';
import { AO, ASSETS, PAGINATORS, REDIRECTS, URLS } from 'helpers/config';
import { AlignType, CollectionType } from 'helpers/types';
import { checkAddress, formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import { CloseHandler } from 'wrappers/CloseHandler';

import * as S from './styles';

const DENOMINATION = Math.pow(10, 12);

function CollectionDropdown(props: { id: string; title: string }) {
	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [collection, setCollection] = React.useState<any>(null);
	const [fetchingcCollection, setFetchingCollection] = React.useState<any>(null);

	const [price, setPrice] = React.useState<number>(0);
	const [percentage, setPercentage] = React.useState<number>(100);

	const [open, setOpen] = React.useState<boolean>(false);
	const [listingModalOpen, setListingModalOpen] = React.useState<boolean>(false);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [response, setResponse] = React.useState<{ status: boolean; message: string }>(null);

	React.useEffect(() => {
		(async function () {
			if (props.id && checkAddress(props.id) && listingModalOpen && !collection) {
				setFetchingCollection(true);
				try {
					const fetchResponse = await readHandler({
						processId: props.id,
						action: 'Info',
					});

					if (fetchResponse && fetchResponse.Assets) setCollection(fetchResponse);
				} catch (e: any) {
					console.error(e);
				}
				setFetchingCollection(false);
			}
		})();
	}, [props.id, listingModalOpen]);

	async function handleSubmit() {
		if (
			arProvider.wallet &&
			arProvider.profile &&
			arProvider.profile.id &&
			collection &&
			collection.Assets &&
			collection.Assets.length
		) {
			let responseMessage = '';
			setLoading(true);
			try {
				setResponse({
					status: true,
					message: responseMessage,
				});
				for (let i = 0; i < collection.Assets.length; i++) {
					try {
						const infoResponse = await readHandler({
							processId: collection.Assets[i],
							action: 'Info',
						});

						const title = `(${i + 1}) ${infoResponse.Name || '-'}`;
						let balance = 0;
						if (infoResponse && infoResponse.Balances && infoResponse.Balances[arProvider.profile.id]) {
							balance = Number(infoResponse.Balances[arProvider.profile.id]);
						}

						if (balance > 0) {
							const pair = [collection.Assets[i], AO.defaultToken];
							const dominantToken = pair[0];
							const swapToken = pair[1];
							const recipient = AO.ucm;

							const quantity = Math.floor((percentage / 100) * balance).toString();
							const unitPrice = (price * DENOMINATION).toString();

							const transferTags = [
								{ name: 'Target', value: dominantToken },
								{ name: 'Recipient', value: recipient },
								{ name: 'Quantity', value: quantity },
								{ name: 'X-Order-Action', value: 'Create-Order' },
								{ name: 'X-Swap-Token', value: swapToken },
								{ name: 'X-Price', value: unitPrice },
							];

							const orderResponse: any = await messageResults({
								processId: arProvider.profile.id,
								action: 'Transfer',
								wallet: arProvider.wallet,
								tags: transferTags,
								data: null,
								responses: ['Transfer-Success', 'Transfer-Error'],
								handler: 'Create-Order',
							});
							if (orderResponse) {
								responseMessage += `${title}: Listing created!\n`;
								setResponse({
									status: true,
									message: responseMessage,
								});
							} else {
								responseMessage += `${title}: ` + language.errorOccurred + '\n';
								setResponse({ status: false, message: responseMessage });
							}
						} else {
							responseMessage += `${title}: Not enough tokens to create listing!\n`;
							setResponse({
								status: false,
								message: responseMessage,
							});
						}
					} catch (e: any) {
						setResponse({ status: false, message: e.message ? e.message : language.errorOccurred });
					}
				}
			} catch (e: any) {
				console.error(e);
				setResponse({ status: false, message: e.message ? e.message : language.errorOccurred });
			}
			setLoading(false);
		}
	}

	function handlePriceInput(e: React.ChangeEvent<HTMLInputElement>, input: 'price' | 'percentage') {
		if (e.target.value === '') {
			switch (input) {
				case 'price':
					setPrice(NaN);
					break;
				case 'percentage':
					setPercentage(NaN);
					break;
			}
		} else {
			if (!isNaN(Number(e.target.value))) {
				const value = parseFloat(e.target.value);
				switch (input) {
					case 'price':
						setPrice(value);
						break;
					case 'percentage':
						setPercentage(value);
						break;
				}
			}
		}
	}

	function getInvalidPercentage() {
		if (percentage < 0 || percentage > 100) {
			return { status: true, message: language.valuePercentage };
		}
		return { status: false, message: null };
	}

	function getInvalidPrice() {
		if (price < 0) {
			return { status: true, message: language.valueAboveZero };
		}
		return { status: false, message: null };
	}

	function getListingModal() {
		return (
			<>
				<Modal header={language.createListings} handleClose={() => setListingModalOpen(false)}>
					<S.MCWrapper>
						<S.MBody>
							<S.MHeader>
								<p>{`${language.collection}: ${props.title}`}</p>
							</S.MHeader>
							<FormField
								type={'number'}
								label={language.listingPrice}
								value={isNaN(price) ? '' : price}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceInput(e, 'price')}
								disabled={loading || response !== null || !collection}
								invalid={getInvalidPrice()}
								tooltip={language.listingPriceInfo}
							/>
							<FormField
								type={'number'}
								label={language.listingPercentage}
								value={isNaN(percentage) ? '' : percentage}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceInput(e, 'percentage')}
								disabled={loading || response !== null || !collection}
								invalid={getInvalidPercentage()}
								tooltip={language.listingPercentageInfo}
							/>
							{response && response.message && response.message.length && (
								<S.MMessage className={'border-wrapper-alt1'}>{response && <pre>{response.message}</pre>}</S.MMessage>
							)}
						</S.MBody>
						<S.MFooter>
							<S.MFetchWrapper>{fetchingcCollection && <span>{`${language.fetching}...`}</span>}</S.MFetchWrapper>
							<S.MActions>
								<Button
									type={'primary'}
									label={response ? language.close : language.cancel}
									handlePress={() => setListingModalOpen(false)}
									disabled={loading || !collection}
									noMinWidth
								/>
								<Button
									type={'alt1'}
									label={response && response.status ? language.viewOnBazar : language.submit}
									handlePress={() => (response ? window.open(REDIRECTS.bazar.collection(props.id)) : handleSubmit())}
									disabled={
										loading ||
										price <= 0 ||
										percentage <= 0 ||
										percentage > 100 ||
										(response && !response.status) ||
										!collection
									}
									loading={loading}
									noMinWidth
								/>
							</S.MActions>
						</S.MFooter>
					</S.MCWrapper>
				</Modal>
			</>
		);
	}

	return (
		<>
			<CloseHandler active={open} disabled={!open} callback={() => setOpen(false)}>
				<S.DWrapper>
					<IconButton
						type={'primary'}
						src={ASSETS.actionMenu}
						handlePress={() => setOpen(!open)}
						dimensions={{ wrapper: 27.5, icon: 18.5 }}
					/>
					{open && (
						<S.DDropdown className={'border-wrapper-primary'} open={open}>
							<S.LI onClick={() => setListingModalOpen(true)} disabled={false}>
								{language.createListings}
							</S.LI>
						</S.DDropdown>
					)}
				</S.DWrapper>
			</CloseHandler>
			{listingModalOpen && getListingModal()}
		</>
	);
}

export default function CollectionsTable() {
	const navigate = useNavigate();

	const arProvider = useArweaveProvider();

	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [collections, setCollections] = React.useState<CollectionType[] | null>(null);
	const [idCount, setIdCount] = React.useState<number>(0);

	const [loading, setLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		(async function () {
			if (arProvider.profile && arProvider.profile.id) {
				setLoading(true);
				try {
					const response = await readHandler({
						processId: AO.collectionsRegistry,
						action: 'Get-Collections-By-User',
						tags: [{ name: 'Creator', value: arProvider.profile.id }],
					});

					if (response && response.Collections && response.Collections.length) {
						setIdCount(response.Collections.length);
						setCollections(
							response.Collections.map((collection: any) => {
								return {
									id: collection.Id,
									title: collection.Name,
									description: collection.Description,
									creator: collection.Creator,
									dateCreated: collection.DateCreated,
									banner: collection.Banner,
									thumbnail: collection.Thumbnail,
								};
							})
						);
					} else {
						setIdCount(0);
						setCollections([]);
					}
				} catch (e: any) {
					console.error(e);
				}
				setLoading(false);
			}
		})();
	}, [arProvider.profile, uploadReducer.uploadActive]);

	function getTableHeader() {
		const header: any = {};
		header.collectionTitle = {
			width: '85%',
			align: 'left' as AlignType,
			display: language.title,
		};

		header.actions = {
			width: '15%',
			align: 'center' as AlignType,
			display: language.actions,
		};

		return header;
	}

	function getTableData() {
		if (collections && collections.length) {
			return collections.map((collection: CollectionType) => {
				const data: any = {};
				const title = collection.title ?? formatAddress(collection.id, false);

				data.collectionTitle = (
					<a href={REDIRECTS.bazar.collection(collection.id)} target={'_blank'}>
						<p>{title}</p>
					</a>
				);

				data.actions = <CollectionDropdown id={collection.id} title={title} />;

				return {
					data: data,
					active: false,
					viewed: false,
				};
			});
		} else return null;
	}

	function getCollections() {
		if (!arProvider.walletAddress) {
			return (
				<S.MWrapper>
					<span>{language.assetFetchConnectionRequired}</span>
				</S.MWrapper>
			);
		}
		if (loading) return <Loader sm relative />;
		if (collections !== null) {
			if (collections.length) {
				return (
					<>
						<Table
							title={`${language.collections} (${idCount})`}
							action={null}
							header={getTableHeader()}
							data={getTableData()}
							recordsPerPage={PAGINATORS.assetTable}
							showPageNumbers={false}
							handleCursorFetch={(_cursor: string | null) => {}}
							cursors={{
								next: null,
								previous: null,
							}}
							showNoResults={false}
						/>
					</>
				);
			} else {
				return (
					<S.EmptyContainer className={'border-wrapper-alt1'}>
						<S.EmptyLogo>
							<ReactSVG src={ASSETS.collections} />
						</S.EmptyLogo>
						<p>{language.noCollectionsInfo}</p>
						<Button type={'alt1'} label={language.upload} handlePress={() => navigate(URLS.upload)} />
					</S.EmptyContainer>
				);
			}
		}
	}

	return (
		<S.Wrapper>
			<S.Body>{getCollections()}</S.Body>
		</S.Wrapper>
	);
}
