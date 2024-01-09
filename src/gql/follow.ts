import { getGQLData } from 'gql';

import { GATEWAYS, TAGS } from 'helpers/config';
import { AGQLResponseType, CursorEnum, FollowingType, GQLNodeResponseType } from 'helpers/types';
import { getTagValue, getUniqueAddresses } from 'helpers/utils';

export async function getFollowing(args: { requestAddress: string; gateway: string }): Promise<FollowingType> {
	try {
		const gqlResponse: AGQLResponseType = await getGQLData({
			gateway: args.gateway,
			ids: null,
			tagFilters: [{ name: TAGS.keys.dataProtocol, values: [TAGS.values.followDataProtocol] }],
			owners: [args.requestAddress],
			cursor: null,
			reduxCursor: null,
			cursorObjectKey: CursorEnum.GQL,
		});

		if (gqlResponse && gqlResponse.data.length) {
			return {
				addresses: getUniqueAddresses(
					gqlResponse.data.map((element: GQLNodeResponseType) => getTagValue(element.node.tags, TAGS.keys.target))
				),
				count: gqlResponse.count,
			};
		} else return { addresses: [], count: 0 };
	} catch (e: any) {
		return { addresses: [], count: 0 };
	}
}

export async function getFollowerCount(args: { address: string }): Promise<number> {
	try {
		const gqlResponse: AGQLResponseType = await getGQLData({
			gateway: GATEWAYS.goldsky,
			ids: null,
			tagFilters: [
				{ name: TAGS.keys.dataProtocol, values: [TAGS.values.followDataProtocol] },
				{ name: TAGS.keys.target, values: [args.address] },
			],
			owners: null,
			cursor: null,
			reduxCursor: null,
			cursorObjectKey: CursorEnum.GQL,
		});

		if (gqlResponse) {
			return gqlResponse.count;
		} else return 0;
	} catch (e: any) {
		console.error(e);
		return 0;
	}
}

export async function checkFollowingTarget(args: {
	targetAddress: string;
	requestAddress: string;
	gateway: string;
}): Promise<boolean> {
	try {
		const gqlResponse: AGQLResponseType = await getGQLData({
			gateway: args.gateway,
			ids: null,
			tagFilters: [
				{ name: TAGS.keys.dataProtocol, values: [TAGS.values.followDataProtocol] },
				{ name: TAGS.keys.target, values: [args.targetAddress] },
			],
			owners: [args.requestAddress],
			cursor: null,
			reduxCursor: null,
			cursorObjectKey: CursorEnum.GQL,
		});

		if (gqlResponse && gqlResponse.data.length) {
			return true;
		} else return false;
	} catch (e: any) {
		console.error(e);
	}
}
