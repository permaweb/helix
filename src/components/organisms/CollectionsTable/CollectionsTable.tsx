import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { createOrder } from '@permaweb/ucm';

import { readHandler } from 'api';

import { Button } from 'components/atoms/Button';
import { Checkbox } from 'components/atoms/Checkbox';
import { FormField } from 'components/atoms/FormField';
import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
import { Panel } from 'components/molecules/Panel';
import { Table } from 'components/molecules/Table';
import { AO, ASSETS, PAGINATORS, REDIRECTS, URLS } from 'helpers/config';
import { AlignType, CollectionType } from 'helpers/types';
import { checkValidAddress, formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';
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
	const [listingLog, setListingLog] = React.useState<string | null>('');

	React.useEffect(() => {
		(async function () {
			if (props.id && checkValidAddress(props.id) && listingModalOpen && !collection) {
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
			setLoading(true);
			try {
				for (let i = 0; i < collection.Assets.length; i++) {
					try {
						const infoResponse = await readHandler({
							processId: collection.Assets[i],
							action: 'Info',
						});

						const title = `(${i + 1}) ${infoResponse?.Name ?? '-'}`;
						let balance = 0;
						if (infoResponse && infoResponse.Balances && infoResponse.Balances[arProvider.profile.id]) {
							balance = Number(infoResponse.Balances[arProvider.profile.id]);
						}

						if (balance > 0) {
							const dominantToken = collection.Assets[i];
							const swapToken = AO.defaultToken;
							const quantity = Math.floor((percentage / 100) * balance).toString();
							const unitPrice = (price * DENOMINATION).toString();

							const data: any = {
								orderbookId: AO.ucm,
								creatorId: arProvider.profile.id,
								dominantToken: dominantToken,
								swapToken: swapToken,
								quantity: quantity,
							};

							if (unitPrice) data.unitPrice = unitPrice.toString();

							const orderId = await createOrder(
								{ wallet: arProvider.wallet },
								data,
								(args: { processing: boolean; success: boolean; message: string }) => {
									setListingLog((prev) => prev + `${args.message}\n`);
								}
							);

							if (orderId) {
								setListingLog((prev) => prev + `${title}: Listing created!\n`);
							} else {
								setListingLog((prev) => prev + `${title} ${language.errorOccurred}\n`);
							}
						} else {
							setListingLog((prev) => prev + `${title}: Not enough tokens to create listing!\n`);
						}
					} catch (e: any) {
						console.error(e);
						setListingLog((prev) => prev + `${e.message ?? language.errorOccurred}\n`);
					}
				}
			} catch (e: any) {
				console.error(e);
				setListingLog((prev) => prev + `${e.message ?? language.errorOccurred}\n`);
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
				<Panel open={true} width={600} header={language.createListings} handleClose={null}>
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
								disabled={loading || !collection}
								invalid={getInvalidPrice()}
								tooltip={language.listingPriceInfo}
							/>
							<FormField
								type={'number'}
								label={language.listingPercentage}
								value={isNaN(percentage) ? '' : percentage}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceInput(e, 'percentage')}
								disabled={loading || !collection}
								invalid={getInvalidPercentage()}
								tooltip={language.listingPercentageInfo}
							/>
						</S.MBody>
						<S.MFooter>
							<S.MFetchWrapper>{fetchingcCollection && <span>{`${language.fetching}...`}</span>}</S.MFetchWrapper>
							<S.MActions>
								<Button
									type={'primary'}
									label={listingLog ? language.close : language.cancel}
									handlePress={() => setListingModalOpen(false)}
									disabled={loading || !collection}
									noMinWidth
								/>
								<Button
									type={'alt1'}
									label={listingLog ? language.viewOnBazar : language.submit}
									handlePress={() => (listingLog ? window.open(REDIRECTS.bazar.collection(props.id)) : handleSubmit())}
									disabled={loading || price <= 0 || percentage <= 0 || percentage > 100 || !collection}
									loading={loading}
									noMinWidth
								/>
							</S.MActions>
						</S.MFooter>
						<S.MMessage>{listingLog && <pre>{listingLog}</pre>}</S.MMessage>
					</S.MCWrapper>
				</Panel>
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

export default function CollectionsTable(props: {
	useIdAction: boolean;
	useActions: boolean;
	hideCollectionAction?: boolean;
}) {
	const dispatch = useDispatch();
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
					const listingLog = await readHandler({
						processId: AO.collectionsRegistry,
						action: 'Get-Collections-By-User',
						tags: [{ name: 'Creator', value: arProvider.profile.id }],
					});

					if (listingLog && listingLog.Collections && listingLog.Collections.length) {
						setIdCount(listingLog.Collections.length);
						setCollections(
							listingLog.Collections.map((collection: any) => {
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

	function handleCollectionChange(id: string, name: string) {
		const currentId = uploadReducer.data?.collectionId;
		const currentName = uploadReducer.data?.collectionName;
		dispatch(
			uploadActions.setUpload([
				{
					field: 'collectionId',
					data: currentId === id ? null : id,
				},
			])
		);
		dispatch(
			uploadActions.setUpload([
				{
					field: 'collectionName',
					data: currentName === name ? null : name,
				},
			])
		);
	}

	function getTableHeader() {
		const header: any = {};
		header.collectionTitle = {
			width: props.useIdAction ? '85%' : '100%',
			align: 'left' as AlignType,
			display: language.title,
		};

		if (props.useIdAction) {
			header.select = {
				width: '15%',
				align: 'center' as AlignType,
				display: language.select,
			};
		}

		if (props.useActions) {
			header.actions = {
				width: '15%',
				align: 'center' as AlignType,
				display: language.actions,
			};
		}
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

				if (props.useIdAction) {
					data.select = (
						<S.CWrapper>
							<Checkbox
								checked={uploadReducer.data?.collectionId === collection.id}
								handleSelect={() => handleCollectionChange(collection.id, collection.title)}
								disabled={false}
							/>
						</S.CWrapper>
					);
				}

				if (props.useActions) {
					data.actions = <CollectionDropdown id={collection.id} title={title} />;
				}

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
					<span>{language.collectionFetchConnectionRequired}</span>
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
					<S.EmptyContainer id={'collection-empty-wrapper'} className={'border-wrapper-alt1'}>
						<S.EmptyLogo>
							<ReactSVG src={ASSETS.collections} />
						</S.EmptyLogo>
						<p>{language.noCollectionsInfo}</p>
						{!props.hideCollectionAction && (
							<Button type={'alt1'} label={language.upload} handlePress={() => navigate(URLS.upload)} />
						)}
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
