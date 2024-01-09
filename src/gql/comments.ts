import { getAssetById, getGQLData, getProfiles } from 'gql';

import { CONTENT_TYPES, GATEWAYS, STORAGE, TAGS } from 'helpers/config';
import {
	AGQLResponseType,
	CommentGQLResponseType,
	CommentType,
	CursorEnum,
	GQLNodeResponseType,
	ProfileType,
} from 'helpers/types';
import { getTagValue } from 'helpers/utils';

export async function getCommentById(args: { id: string; dataSource: string }): Promise<CommentType | null> {
	try {
		const asset = await getAssetById({ id: args.id, gateway: GATEWAYS.arweave });
		if (asset) {
			return {
				id: asset.id,
				data: asset.description,
				dataSource: args.dataSource,
				dateCreated: asset.dateCreated,
				creator: {
					txId: null,
					channelTitle: null,
					handle: null,
					avatar: null,
					walletAddress: asset.creator.walletAddress,
					profileIndex: null,
					banner: null,
				},
			};
		}
	} catch (e: any) {
		return null;
	}
}

export async function getCommentsByAddress(args: {
	id: string;
	cursor: string | null;
}): Promise<CommentGQLResponseType> {
	const emptyResponseObject = {
		data: [],
		count: 0,
		nextCursor: null,
		previousCursor: null,
	};
	try {
		const gqlResponse: AGQLResponseType = await getGQLData({
			gateway: GATEWAYS.arweave,
			ids: null,
			tagFilters: [
				{
					name: TAGS.keys.contentType,
					values: [CONTENT_TYPES.textPlain],
				},
				{
					name: TAGS.keys.dataProtocol,
					values: [TAGS.values.comment],
				},
				{
					name: TAGS.keys.dataSource,
					values: [args.id],
				},
			],
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

			const comments: CommentType[] = [];
			gqlResponse.data.forEach((element: GQLNodeResponseType) => {
				comments.push(structureComment(element, profiles));
			});

			return {
				data: comments,
				count: gqlResponse.data.length,
				nextCursor: gqlResponse.nextCursor,
				previousCursor: gqlResponse.previousCursor,
			};
		} else return emptyResponseObject;
	} catch (e: any) {
		console.error(e);
		return emptyResponseObject;
	}
}

function structureComment(element: GQLNodeResponseType, profiles: ProfileType[] | null): CommentType {
	const data = getTagValue(element.node.tags, TAGS.keys.ans110.description);

	const initialOwner = getTagValue(element.node.tags, TAGS.keys.initialOwner);
	let creator = {
		txId: null,
		channelTitle: null,
		handle: null,
		avatar: null,
		walletAddress: initialOwner,
		profileIndex: null,
		banner: null,
	};
	if (profiles) {
		const profile = profiles.find((profile: ProfileType) => profile.walletAddress === initialOwner);
		if (profile) creator = profile;
	}
	let dateCreated: string | number = getTagValue(element.node.tags, TAGS.keys.dateCreated);
	if (dateCreated !== STORAGE.none) dateCreated = parseInt(dateCreated);
	else dateCreated = 0;

	return {
		id: element.node.id,
		data: data,
		dataSource: getTagValue(element.node.tags, TAGS.keys.dataSource),
		dateCreated: dateCreated,
		creator: creator,
	};
}
