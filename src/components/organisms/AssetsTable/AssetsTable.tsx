import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAssetIdsByUser, getGQLData } from 'gql';

import { Checkbox } from 'components/atoms/Checkbox';
import { Loader } from 'components/atoms/Loader';
import { Table } from 'components/molecules/Table';
import { GATEWAYS, PAGINATORS, REDIRECTS, STORAGE, TAGS, TRADE_SOURCES } from 'helpers/config';
import { AlignType, CursorEnum, GQLNodeResponseType, GroupIndexType } from 'helpers/types';
import { formatAddress, getTagValue } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';

import * as S from './styles';

export default function AssetsTable(props: { useIdAction: boolean }) {
	const dispatch = useDispatch();

	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [assets, setAssets] = React.useState<GQLNodeResponseType[] | null>(null);
	const [groupIndex, setGroupIndex] = React.useState<GroupIndexType | null>(null);
	const [idCount, setIdCount] = React.useState<number>(0);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [recordsPerPage] = React.useState(PAGINATORS.assetTable);

	const [currentTableCursor, setCurrentTableCursor] = React.useState<string | null>(null);
	const [currentRecords, setCurrentRecords] = React.useState<GQLNodeResponseType[] | null>(null);

	const lastRecordIndex = 1 * recordsPerPage;
	const firstRecordIndex = lastRecordIndex - recordsPerPage;

	React.useEffect(() => {
		if (assets !== null) {
			setCurrentRecords(assets.length ? assets.slice(firstRecordIndex, lastRecordIndex) : []);
		}
	}, [assets]);

	React.useEffect(() => {
		(async function () {
			if (arProvider.walletAddress) {
				setLoading(true);
				try {
					const groups: GroupIndexType = [];
					const ids = await getAssetIdsByUser({ walletAddress: arProvider.walletAddress });
					if (ids && ids.length) {
						setIdCount(ids.length);
						const groupIndex = new Map(groups.map((group: any) => [group.index, group.ids]));

						for (let i = 0, j = 0; i < ids.length; i += PAGINATORS.assetTable, j++) {
							const cursorIds = [...ids].slice(i, i + PAGINATORS.assetTable);
							const newIndex = `index-${j}`;

							if (
								![...groupIndex.values()].some((groupedIds: any) =>
									groupedIds.every((id: any, index: any) => id === cursorIds[index])
								) ||
								newIndex === `index-0`
							) {
								groups.push({
									index: newIndex,
									ids: cursorIds,
								});
							}
						}

						if (groups && groups.length) {
							setCurrentTableCursor(groups[0].index);
							setGroupIndex(groups);
						}
					}
				} catch (e: any) {
					console.error(e);
				}
				setLoading(false);
			}
		})();
	}, [arProvider.walletAddress]);

	React.useEffect(() => {
		(async function () {
			if (currentTableCursor && groupIndex) {
				const index = parseInt(currentTableCursor.match(/\d+/)[0], 10);
				if (index !== null) {
					try {
						const assetsResponse = await getGQLData({
							gateway: GATEWAYS.arweave,
							ids: groupIndex[index].ids,
							tagFilters: null,
							owners: null,
							cursor: null,
							reduxCursor: null,
							cursorObjectKey: CursorEnum.IdGQL,
						});
						if (assetsResponse) {
							setAssets(assetsResponse.data);
						}
					} catch (e: any) {
						console.error(e);
					}
				} else {
					setAssets([]);
				}
			} else {
				setAssets([]);
			}
		})();
	}, [currentTableCursor]);

	function handleId(id: string) {
		let ids: string[];
		const index = uploadReducer.data.idList.indexOf(id);
		if (index === -1) ids = [...uploadReducer.data.idList, id];
		else ids = uploadReducer.data.idList.filter((item: string) => item !== id);
		dispatch(
			uploadActions.setUpload([
				{
					field: 'idList',
					data: ids,
				},
			])
		);
	}

	function getPaginatorAction(action: 'next' | 'prev') {
		if (groupIndex.length) {
			const currentIndex = parseInt(currentTableCursor.match(/\d+/)[0], 10);
			switch (action) {
				case 'next':
					return groupIndex.length > currentIndex + 1 ? groupIndex[currentIndex + 1].index : null;
				case 'prev':
					return currentIndex > 0 ? groupIndex[currentIndex - 1].index : null;
				default:
					return null;
			}
		} else {
			return null;
		}
	}

	function getTableHeader() {
		const header: any = {};
		header.assetTitle = {
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

		return header;
	}

	function getTableData() {
		if (currentRecords && currentRecords.length) {
			return currentRecords.map((element: GQLNodeResponseType) => {
				const data: any = {};

				const titleTag = getTagValue(element.node.tags, TAGS.keys.ans110.title);
				const title = titleTag !== STORAGE.none ? titleTag : formatAddress(element.node.id, false);

				const contractSrc = getTagValue(element.node.tags, TAGS.keys.contractSrc);

				let idChecked = false;
				if (uploadReducer.data && uploadReducer.data.idList) {
					idChecked = uploadReducer.data.idList.includes(element.node.id);
				}

				data.assetTitle = (
					<a href={REDIRECTS.bazar.asset(element.node.id)} target={'_blank'}>
						<p>{title}</p>
					</a>
				);

				if (props.useIdAction) {
					data.select = (
						<S.CWrapper>
							<Checkbox
								checked={idChecked}
								handleSelect={() => handleId(element.node.id)}
								disabled={!TRADE_SOURCES.includes(contractSrc)}
							/>
						</S.CWrapper>
					);
				}

				return {
					data: data,
					active: false,
					viewed: false,
				};
			});
		} else return null;
	}

	function getAssets() {
		if (!arProvider.walletAddress) {
			return (
				<S.MWrapper>
					<span>{language.assetFetchConnectionRequired}</span>
				</S.MWrapper>
			);
		}
		if (loading) return <Loader sm relative />;
		if (currentRecords !== null) {
			if (currentRecords.length) {
				const currentIndex = parseInt(currentTableCursor.match(/\d+/)[0], 10);
				const currentIndexDisplay = currentIndex * PAGINATORS.assetTable;

				return (
					<>
						<Table
							title={`${language.assets} (${idCount})`}
							action={null}
							header={getTableHeader()}
							data={getTableData()}
							recordsPerPage={PAGINATORS.assetTable}
							showPageNumbers={false}
							handleCursorFetch={(cursor: string | null) => setCurrentTableCursor(cursor)}
							cursors={{
								next: getPaginatorAction('next'),
								previous: getPaginatorAction('prev'),
							}}
							showNoResults={false}
						/>
						<S.TMessage>
							<span>{`${language.showingAssets}: ${currentIndexDisplay + 1} - ${
								currentIndexDisplay + PAGINATORS.assetTable
							}`}</span>
						</S.TMessage>
					</>
				);
			} else {
				return (
					<S.MWrapper>
						<span>{language.noAssets}</span>
					</S.MWrapper>
				);
			}
		}
	}

	return (
		<S.Wrapper>
			{props.useIdAction && (
				<S.Header>
					<h4>{language.chooseExistingAssets}</h4>
				</S.Header>
			)}
			<S.Body>{getAssets()}</S.Body>
		</S.Wrapper>
	);
}
