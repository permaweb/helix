import { getGQLData, getProfiles, structureAsset } from 'gql';

import { GATEWAYS, TAGS } from 'helpers/config';
import { AGQLResponseType, AssetGQLResponseType, AssetType, CursorEnum, GQLNodeResponseType } from 'helpers/types';
import { checkValidAddress, getTagValue } from 'helpers/utils';

export async function search(args: { term: string; cursor: string | null }): Promise<AssetGQLResponseType | null> {
	const emptyResponseObject = {
		data: [],
		count: 0,
		nextCursor: null,
		previousCursor: null,
	};
	try {
		const addressCheck = checkValidAddress(args.term);

		const gqlResponse: AGQLResponseType = await getGQLData({
			gateway: GATEWAYS.goldsky,
			ids: addressCheck ? [args.term] : null,
			tagFilters: addressCheck ? null : [{ name: TAGS.keys.ans110.title, values: [args.term], match: 'FUZZY_OR' }],
			owners: null,
			cursor: args.cursor,
			reduxCursor: null,
			cursorObjectKey: CursorEnum.GQL,
		});

		if (gqlResponse && gqlResponse.data && gqlResponse.data.length) {
			const profiles = await getProfiles({
				addresses: gqlResponse.data.map((element: GQLNodeResponseType) =>
					getTagValue(element.node.tags, TAGS.keys.initialOwner)
				),
			});

			const assets: AssetType[] = [];
			gqlResponse.data.forEach((element: GQLNodeResponseType) => {
				assets.push(structureAsset(element, profiles));
			});

			return {
				data: assets,
				count: gqlResponse.count,
				nextCursor: gqlResponse.nextCursor,
				previousCursor: gqlResponse.previousCursor,
			};
		} else return emptyResponseObject;
	} catch (e: any) {
		console.error(e);
		return emptyResponseObject;
	}
}
