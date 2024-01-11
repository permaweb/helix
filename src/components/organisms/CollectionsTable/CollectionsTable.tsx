import React from 'react';

import { getGQLData } from 'gql';

import { Loader } from 'components/atoms/Loader';
import { Table } from 'components/molecules/Table';
import { GATEWAYS, PAGINATORS, REDIRECTS, STORAGE, TAGS } from 'helpers/config';
import { AlignType, CursorEnum, GQLNodeResponseType } from 'helpers/types';
import { formatAddress, getTagValue } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';

import * as S from './styles';

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
			width: '100%',
			align: 'left' as AlignType,
			display: language.title,
		};

		return header;
	}

	function getTableData() {
		if (collections && collections.length) {
			return collections.map((element: GQLNodeResponseType) => {
				const data: any = {};

				const titleTag = getTagValue(element.node.tags, TAGS.keys.ans110.title);
				const title = titleTag !== STORAGE.none ? titleTag : formatAddress(element.node.id, false);

				data.collectionTitle = (
					<a href={REDIRECTS.bazar.collection(element.node.id)} target={'_blank'}>
						<p>{title ? title : 'Title not found'}</p>
					</a>
				);

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
