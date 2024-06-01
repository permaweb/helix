import React from 'react';

import { readHandler } from 'api';

// import Arweave from 'arweave';
// import { DeployPlugin } from 'warp-contracts-plugin-deploy';
// import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature';
// import { OrderBook, OrderBookType } from 'permaweb-orderbook';
// import { getGQLData } from 'gql';
// import { Button } from 'components/atoms/Button';
// import { FormField } from 'components/atoms/FormField';
// import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
// import { Modal } from 'components/molecules/Modal';
import { Table } from 'components/molecules/Table';
import { AOS, PAGINATORS, REDIRECTS } from 'helpers/config';
// import { getTxEndpoint } from 'helpers/endpoints';
import { AlignType, CollectionType } from 'helpers/types';
import { formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';

// import { CloseHandler } from 'wrappers/CloseHandler';
import * as S from './styles';

// function CollectionDropdown(props: { id: string; title: string }) {
// 	const arProvider = useArweaveProvider();

// 	const languageProvider = useLanguageProvider();
// 	const language = languageProvider.object[languageProvider.current];

// 	const [price, setPrice] = React.useState<number>(0);
// 	const [percentage, setPercentage] = React.useState<number>(100);

// 	const [open, setOpen] = React.useState<boolean>(false);
// 	const [listingModalOpen, setListingModalOpen] = React.useState<boolean>(false);

// 	const [loading, setLoading] = React.useState<boolean>(false);
// 	const [orderBook, setOrderBook] = React.useState<OrderBookType | null>(null);
// 	const [response, setResponse] = React.useState<{ status: boolean; message: string }>(null);

// 	React.useEffect(() => {
// 		const arweave = Arweave.init({
// 			host: GATEWAYS.arweave,
// 			port: API_CONFIG.port,
// 			protocol: API_CONFIG.protocol,
// 			timeout: API_CONFIG.timeout,
// 			logging: API_CONFIG.logging,
// 		});

// 		const warp = WarpFactory.forMainnet({
// 			...defaultCacheOptions,
// 			inMemory: true,
// 		}).use(new DeployPlugin());

// 		setOrderBook(
// 			OrderBook.init({
// 				currency: CURRENCIES.u.label as 'U',
// 				arweaveGet: arweave,
// 				arweavePost: arweave,
// 				bundlrKey: arProvider.wallet ? arProvider.wallet : null,
// 				warp: warp,
// 				warpDreNode: DRE_NODE,
// 			})
// 		);
// 	}, [arProvider.wallet, DRE_NODE]);

// 	async function handleSubmit() {
// 		if (arProvider.wallet && orderBook) {
// 			setLoading(true);
// 			try {
// 				const collectionObj = {
// 					collectionId: props.id,
// 					price: price,
// 					percentage: percentage,
// 				};

// 				const signer = new InjectedArweaveSigner(arProvider.wallet);
// 				signer.getAddress = window.arweaveWallet.getActiveAddress;
// 				await signer.setPublicKey();

// 				const collectionManifest = await (await fetch(getTxEndpoint(collectionObj.collectionId))).json();
// 				const items = collectionManifest.items;
// 				const assetStates = {};

// 				for (let i = 0; i < items.length; i++) {
// 					const assetState = await orderBook.env.arClient.read(items[i]);
// 					const walletQty = assetState.balances[arProvider.walletAddress];
// 					assetStates[items[i]] = assetState;
// 					if (!walletQty) {
// 						log(`No balance on asset ${items[i]}`, 1);
// 					}
// 				}

// 				let errorCount: number = 0;
// 				for (let i = 0; i < items.length; i++) {
// 					try {
// 						const assetState = assetStates[items[i]];
// 						const walletQty = assetState.balances[arProvider.walletAddress];
// 						const intendedSaleQty = Math.ceil((collectionObj.percentage / 100) * walletQty);
// 						await orderBook.sell({
// 							assetId: items[i],
// 							price: collectionObj.price * 1e6,
// 							qty: intendedSaleQty,
// 							wallet: signer,
// 							walletAddress: arProvider.walletAddress,
// 						});
// 						logValue(`Listed asset`, `${items[i]}`, 0);
// 					} catch {
// 						errorCount = errorCount + 1;
// 					}
// 				}
// 				setResponse({
// 					status: errorCount !== items.length,
// 					message: `${language.listingsCreated(items.length - errorCount, items.length)}`,
// 				});
// 			} catch (e: any) {
// 				console.error(e);
// 				setResponse({ status: false, message: e.message ? e.message : language.errorOccurred });
// 			}
// 			setLoading(false);
// 		}
// 	}

// 	function handlePriceInput(e: React.ChangeEvent<HTMLInputElement>, input: 'price' | 'percentage') {
// 		if (e.target.value === '') {
// 			switch (input) {
// 				case 'price':
// 					setPrice(NaN);
// 					break;
// 				case 'percentage':
// 					setPercentage(NaN);
// 					break;
// 			}
// 		} else {
// 			if (!isNaN(Number(e.target.value))) {
// 				const value = parseFloat(e.target.value);
// 				switch (input) {
// 					case 'price':
// 						setPrice(value);
// 						break;
// 					case 'percentage':
// 						setPercentage(value);
// 						break;
// 				}
// 			}
// 		}
// 	}

// 	function getInvalidPercentage() {
// 		if (percentage < 0 || percentage > 100) {
// 			return { status: true, message: language.valuePercentage };
// 		}
// 		return { status: false, message: null };
// 	}

// 	function getInvalidPrice() {
// 		if (price < 0) {
// 			return { status: true, message: language.valueAboveZero };
// 		}
// 		return { status: false, message: null };
// 	}

// 	function getListingModal() {
// 		return (
// 			<Modal header={language.createListings} handleClose={() => setListingModalOpen(false)}>
// 				<S.MCWrapper>
// 					<S.MBody>
// 						<S.MHeader>
// 							<p>{`${language.collection}: ${props.title}`}</p>
// 						</S.MHeader>
// 						<FormField
// 							type={'number'}
// 							label={language.listingPrice}
// 							value={isNaN(price) ? '' : price}
// 							onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceInput(e, 'price')}
// 							disabled={loading || response !== null}
// 							invalid={getInvalidPrice()}
// 							tooltip={language.listingPriceInfo}
// 						/>
// 						<FormField
// 							type={'number'}
// 							label={language.listingPercentage}
// 							value={isNaN(percentage) ? '' : percentage}
// 							onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceInput(e, 'percentage')}
// 							disabled={loading || response !== null}
// 							invalid={getInvalidPercentage()}
// 							tooltip={language.listingPercentageInfo}
// 						/>
// 						{(loading || response !== null) && (
// 							<S.MMessage className={'border-wrapper-alt1'}>
// 								<span>{loading ? `${language.listingsCreating}...` : response.message}</span>
// 							</S.MMessage>
// 						)}
// 					</S.MBody>
// 					<S.MActions>
// 						<Button
// 							type={'primary'}
// 							label={response ? language.close : language.cancel}
// 							handlePress={() => setListingModalOpen(false)}
// 							disabled={loading}
// 							noMinWidth
// 						/>
// 						<Button
// 							type={'alt1'}
// 							label={response && response.status ? language.viewOnBazar : language.submit}
// 							handlePress={() => (response ? window.open(REDIRECTS.bazar.collection(props.id)) : handleSubmit())}
// 							disabled={loading || price <= 0 || percentage <= 0 || percentage > 100 || (response && !response.status)}
// 							loading={loading}
// 							noMinWidth
// 						/>
// 					</S.MActions>
// 				</S.MCWrapper>
// 			</Modal>
// 		);
// 	}

// 	return (
// 		<>
// 			<CloseHandler active={open} disabled={!open} callback={() => setOpen(false)}>
// 				<S.DWrapper>
// 					<IconButton
// 						type={'primary'}
// 						src={ASSETS.actionMenu}
// 						handlePress={() => setOpen(!open)}
// 						dimensions={{ wrapper: 27.5, icon: 18.5 }}
// 					/>
// 					{open && (
// 						<S.DDropdown className={'border-wrapper-primary'} open={open}>
// 							<S.LI onClick={() => setListingModalOpen(true)} disabled={false}>
// 								{language.createListings}
// 							</S.LI>
// 						</S.DDropdown>
// 					)}
// 				</S.DWrapper>
// 			</CloseHandler>
// 			{listingModalOpen && getListingModal()}
// 		</>
// 	);
// }

export default function CollectionsTable() {
	const arProvider = useArweaveProvider();

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
						processId: AOS.collectionsRegistry,
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
	}, [arProvider.profile]);

	function getTableHeader() {
		const header: any = {};
		header.collectionTitle = {
			width: '85%',
			align: 'left' as AlignType,
			display: language.title,
		};

		// TODO
		// header.actions = {
		// 	width: '15%',
		// 	align: 'center' as AlignType,
		// 	display: language.actions,
		// };

		return header;
	}

	function getTableData() {
		if (collections && collections.length) {
			return collections.map((collection: CollectionType) => {
				const data: any = {};

				data.collectionTitle = (
					<a href={REDIRECTS.bazar.collection(collection.id)} target={'_blank'}>
						<p>{collection.title ?? formatAddress(collection.id, false)}</p>
					</a>
				);

				// TODO
				// data.actions = <CollectionDropdown id={element.node.id} title={displayTitle} />;

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
					<S.MWrapper>
						<span>{language.noCollections}</span>
					</S.MWrapper>
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
