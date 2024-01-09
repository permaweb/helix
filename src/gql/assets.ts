import { getGQLData, getProfiles } from 'gql';

import { ASSET_TITLE_PREFIX, ASSETS, DEFAULT_THUMBNAIL, GATEWAYS, PAGINATORS, STORAGE, TAGS } from 'helpers/config';
import {
	AGQLResponseType,
	AssetGQLResponseType,
	AssetType,
	CursorEnum,
	GQLNodeResponseType,
	LicenseValueType,
	ProfileType,
	TagType,
	UDLType,
} from 'helpers/types';
import { getTagValue } from 'helpers/utils';

export async function getAssetById(args: { id: string; gateway: string }): Promise<AssetType | null> {
	try {
		const gqlResponse: AGQLResponseType = await getGQLData({
			gateway: args.gateway,
			ids: [args.id],
			tagFilters: null,
			owners: null,
			cursor: null,
			reduxCursor: null,
			cursorObjectKey: CursorEnum.IdGQL,
		});

		if (gqlResponse && gqlResponse.data && gqlResponse.data.length) {
			const profiles = await getProfiles({
				addresses: gqlResponse.data.map((element: GQLNodeResponseType) =>
					getTagValue(element.node.tags, TAGS.keys.initialOwner)
				),
			});
			return structureAsset(gqlResponse.data[0], profiles);
		}
		return null;
	} catch (e: any) {
		console.error(e);
		return null;
	}
}

export async function getAssetsByVersion(args: {
	cursor: string | null;
	owners: string[] | null;
}): Promise<AssetGQLResponseType> {
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
			tagFilters: [{ name: TAGS.keys.appVersion, values: [TAGS.values.appVersion] }],
			owners: args.owners ? args.owners : null,
			cursor: args.cursor,
			reduxCursor: null,
			cursorObjectKey: CursorEnum.GQL,
			paginator: PAGINATORS.version,
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

export async function getAssetsByRecommendations(args: {
	id: string;
	cursor: string | null;
}): Promise<AssetGQLResponseType> {
	console.log(`Get recommendations for ${args.id}`);
	return await getAssetsByVersion({ cursor: args.cursor, owners: null });
}

export async function getAssetCountByOwner(args: { address: string }): Promise<number> {
	try {
		const gqlResponse: AGQLResponseType = await getGQLData({
			gateway: GATEWAYS.goldsky,
			ids: null,
			tagFilters: [
				{ name: TAGS.keys.appVersion, values: [TAGS.values.appVersion] },
				{ name: TAGS.keys.initialOwner, values: [args.address] },
			],
			owners: [args.address],
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

export function structureAsset(element: GQLNodeResponseType, profiles: ProfileType[] | null): AssetType {
	const contentType = getTagValue(element.node.tags, TAGS.keys.contentType);

	let contentLength: string | number = getTagValue(element.node.tags, TAGS.keys.contentLength);
	if (contentLength !== STORAGE.none) contentLength = parseInt(contentLength);
	else contentLength = 0;

	const title = getTagValue(element.node.tags, TAGS.keys.ans110.title).replace(ASSET_TITLE_PREFIX, '');
	const description = getTagValue(element.node.tags, TAGS.keys.ans110.description);
	const type = getTagValue(element.node.tags, TAGS.keys.ans110.type);
	const topics = element.node.tags
		.filter((tag: TagType) => tag.name.includes('topic'))
		.map((tag: TagType) => tag.value);

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

	try {
		if (profiles) {
			const profile = profiles.find((profile: ProfileType) => (profile ? profile.walletAddress === initialOwner : ''));
			if (profile) creator = profile;
		}
	} catch (e: any) {
		console.error(e);
	}

	let dateCreated: string | number = getTagValue(element.node.tags, TAGS.keys.dateCreated);
	if (dateCreated !== STORAGE.none) dateCreated = parseInt(dateCreated);
	else dateCreated = 0;

	let thumbnail = getTagValue(element.node.tags, TAGS.keys.thumbnail);
	if (thumbnail === STORAGE.none) thumbnail = DEFAULT_THUMBNAIL;

	const license: UDLType | null = structureLicense(element.node.tags);

	const asset: AssetType = {
		id: element.node.id,
		contentType: contentType,
		contentLength: contentLength,
		title: title,
		description: description,
		type: type,
		topics: topics,
		creator: creator,
		dateCreated: dateCreated,
		thumbnail: thumbnail,
		license: license,
	};

	return asset;
}

function structureLicense(tags: TagType[]): UDLType {
	const license = getTagValue(tags, TAGS.keys.license);
	if (license === STORAGE.none) return null;

	let access: LicenseValueType | null = null;
	const accessTag = getTagValue(tags, TAGS.keys.udl.accessFee);
	if (accessTag !== STORAGE.none) access = { value: accessTag, icon: ASSETS.u };

	let derivations: LicenseValueType | null = null;
	const derivationsTag = getTagValue(tags, TAGS.keys.udl.derivations);
	if (derivationsTag !== STORAGE.none) derivations = getLicenseValuePayment(derivationsTag);

	let commercialUse: LicenseValueType | null = null;
	const commercialUseTag = getTagValue(tags, TAGS.keys.udl.commercialUse);
	if (commercialUseTag !== STORAGE.none) commercialUse = getLicenseValuePayment(commercialUseTag);

	let dataModelTraining: LicenseValueType | null = null;
	const dataModelTrainingTag = getTagValue(tags, TAGS.keys.udl.dataModelTraining);
	if (dataModelTrainingTag !== STORAGE.none) dataModelTraining = getLicenseValuePayment(dataModelTrainingTag);

	let paymentMode: string | null = getTagValue(tags, TAGS.keys.udl.paymentMode);
	if (paymentMode === STORAGE.none) paymentMode = null;

	let paymentAddress: string | null = getTagValue(tags, TAGS.keys.udl.paymentAddress);
	if (paymentAddress === STORAGE.none) paymentAddress = null;

	return {
		license: license,
		access: access,
		derivations: derivations,
		commercialUse: commercialUse,
		dataModelTraining: dataModelTraining,
		paymentMode: paymentMode,
		paymentAddress: paymentAddress,
	};
}

export function getLicenseValuePayment(value: string): LicenseValueType {
	let payment: LicenseValueType = { value: value };
	if (value !== 'Disallowed') {
		if (value.includes('Revenue-Share')) payment.endText = '%';
		if (value.includes('Monthly-Fee') || value.includes('One-Time-Fee')) payment.icon = ASSETS.u;
	}

	return payment;
}

export async function checkDuplicateAsset(args: { title: string; gateway: string }): Promise<boolean> {
	const gqlResponse: AGQLResponseType = await getGQLData({
		gateway: args.gateway,
		ids: null,
		tagFilters: [
			{ name: TAGS.keys.ans110.title, values: [args.title] },
			{ name: TAGS.keys.appVersion, values: [TAGS.values.appVersion] },
		],
		owners: null,
		cursor: null,
		reduxCursor: null,
		cursorObjectKey: CursorEnum.GQL,
	});

	if (gqlResponse && gqlResponse.data.length) {
		return true;
	} else return false;
}
