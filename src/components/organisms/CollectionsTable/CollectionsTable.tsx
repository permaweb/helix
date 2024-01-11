import React from 'react';

import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature';
import { OrderBook, OrderBookType } from 'permaweb-orderbook';

import { getGQLData } from 'gql';

import { Button } from 'components/atoms/Button';
import { FormField } from 'components/atoms/FormField';
import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
import { Modal } from 'components/molecules/Modal';
import { Table } from 'components/molecules/Table';
import {
	API_CONFIG,
	ASSETS,
	CURRENCIES,
	DRE_NODE,
	GATEWAYS,
	PAGINATORS,
	REDIRECTS,
	STORAGE,
	TAGS,
} from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { AlignType, CursorEnum, GQLNodeResponseType } from 'helpers/types';
import { formatAddress, getTagValue, log } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { CloseHandler } from 'wrappers/CloseHandler';

import * as S from './styles';

LoggerFactory.INST.logLevel('fatal');

function CollectionDropdown(props: { id: string; title: string }) {
	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [price, setPrice] = React.useState<number>(0);
	const [percentage, setPercentage] = React.useState<number>(100);

	const [open, setOpen] = React.useState<boolean>(false);
	const [listingModalOpen, setListingModalOpen] = React.useState<boolean>(false);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [orderBook, setOrderBook] = React.useState<OrderBookType | null>(null);
	const [response, setResponse] = React.useState<{ status: boolean; message: string }>(null);

	React.useEffect(() => {
		const arweave = Arweave.init({
			host: GATEWAYS.arweave,
			port: API_CONFIG.port,
			protocol: API_CONFIG.protocol,
			timeout: API_CONFIG.timeout,
			logging: API_CONFIG.logging,
		});

		const warp = WarpFactory.forMainnet({
			...defaultCacheOptions,
			inMemory: true,
		}).use(new DeployPlugin());

		setOrderBook(
			OrderBook.init({
				currency: CURRENCIES.u.label as 'U',
				arweaveGet: arweave,
				arweavePost: arweave,
				bundlrKey: arProvider.wallet ? arProvider.wallet : null,
				warp: warp,
				warpDreNode: DRE_NODE,
			})
		);
	}, [arProvider.wallet, DRE_NODE]);

	async function handleSubmit() {
		if (arProvider.wallet && orderBook) {
			setLoading(true);
			try {
				const collectionObj = {
					collectionId: props.id,
					price: price,
					percentage: percentage,
				};

				const signer = new InjectedArweaveSigner(arProvider.wallet);
				signer.getAddress = window.arweaveWallet.getActiveAddress;
				await signer.setPublicKey();

				const collectionManifest = await (await fetch(getTxEndpoint(collectionObj.collectionId))).json();
				const items = collectionManifest.items;
				const assetStates = {};

				for (let i = 0; i < items.length; i++) {
					const assetState = await orderBook.env.arClient.read(items[i]);
					const walletQty = assetState.balances[arProvider.walletAddress];
					assetStates[items[i]] = assetState;
					if (!walletQty) {
						log(`No balance on asset ${items[i]}`, 1);
					}
				}

				for (let i = 0; i < items.length; i++) {
					try {
						let assetState = assetStates[items[i]];
						let walletQty = assetState.balances[arProvider.walletAddress];

						let intendedSaleQty = Math.ceil((collectionObj.percentage / 100) * walletQty);
						await orderBook
							.sell({
								assetId: items[i],
								price: collectionObj.price * 1e6,
								qty: intendedSaleQty,
								wallet: signer,
								walletAddress: arProvider.walletAddress,
							})
							.catch((e: any) => console.error(e));
						log(`Listed asset: ${items[i]}`, 0);
					} catch (e: any) {
						console.error(e);
					}
				}

				setResponse({ status: true, message: `${language.listingsCreated}!` });
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
			<Modal header={language.createListings} handleClose={() => setListingModalOpen(false)}>
				<S.MCWrapper>
					<S.MBody>
						<S.MHeader>
							<p>{`${language.collection}: ${props.title}${response ? ` (${response.message})` : ''}`}</p>
						</S.MHeader>
						<FormField
							type={'number'}
							label={language.listingPrice}
							value={isNaN(price) ? '' : price}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceInput(e, 'price')}
							disabled={loading || response !== null}
							invalid={getInvalidPrice()}
							tooltip={language.listingPriceInfo}
						/>
						<FormField
							type={'number'}
							label={language.listingPercentage}
							value={isNaN(percentage) ? '' : percentage}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceInput(e, 'percentage')}
							disabled={loading || response !== null}
							invalid={getInvalidPercentage()}
							tooltip={language.listingPercentageInfo}
						/>
					</S.MBody>
					<S.MActions>
						<Button
							type={'primary'}
							label={response ? language.close : language.cancel}
							handlePress={() => setListingModalOpen(false)}
							disabled={loading}
							noMinWidth
						/>
						<Button
							type={'alt1'}
							label={response && response.status ? language.viewOnBazar : language.submit}
							handlePress={() => (response ? window.open(REDIRECTS.bazar.collection(props.id)) : handleSubmit())}
							disabled={loading || price <= 0 || percentage <= 0 || percentage > 100 || (response && !response.status)}
							loading={loading}
							noMinWidth
						/>
					</S.MActions>
				</S.MCWrapper>
			</Modal>
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
	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [collections, setCollections] = React.useState<GQLNodeResponseType[] | null>(null);
	const [idCount, setIdCount] = React.useState<number>(0);

	const [loading, setLoading] = React.useState<boolean>(false);

	React.useEffect(() => {
		(async function () {
			setLoading(true);
			try {
				const collectionsResponse = await getGQLData({
					gateway: GATEWAYS.arweave,
					ids: null,
					tagFilters: [
						{ name: TAGS.keys.dataProtocol, values: [TAGS.values.collection] },
						{ name: TAGS.keys.creator, values: [arProvider.walletAddress] },
					],
					owners: null,
					cursor: null,
					reduxCursor: null,
					cursorObjectKey: CursorEnum.IdGQL,
				});
				if (collectionsResponse) {
					setCollections(collectionsResponse.data);
					setIdCount(collectionsResponse.data.length);
				}
			} catch (e: any) {
				console.error(e);
			}
			setLoading(false);
		})();
	}, [arProvider.walletAddress]);

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
			return collections.map((element: GQLNodeResponseType) => {
				const data: any = {};

				const titleTag = getTagValue(element.node.tags, TAGS.keys.ans110.title);
				const title = titleTag !== STORAGE.none ? titleTag : formatAddress(element.node.id, false);
				const displayTitle = title ? title : language.titleNotFound;

				data.collectionTitle = (
					<a href={REDIRECTS.bazar.collection(element.node.id)} target={'_blank'}>
						<p>{displayTitle}</p>
					</a>
				);

				data.actions = <CollectionDropdown id={element.node.id} title={displayTitle} />;

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
