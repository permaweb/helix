import Arweave from 'arweave';
import { createDataItemSigner, dryrun, message, result, results } from '@permaweb/aoconnect';

import { AO, API_CONFIG, CONTENT_TYPES, GATEWAYS } from 'helpers/config';
import { TagType } from 'helpers/types';
import { getTagValue } from 'helpers/utils';

const arweave = Arweave.init({
	host: GATEWAYS.arweave,
	protocol: API_CONFIG.protocol,
	port: API_CONFIG.port,
	timeout: API_CONFIG.timeout,
	logging: API_CONFIG.logging,
});

export async function createTransaction(args: { content: any; contentType: string; tags: TagType[] }) {
	let finalContent: any;
	switch (args.contentType) {
		case CONTENT_TYPES.json as any:
			finalContent = JSON.stringify(args.content);
			break;
		default:
			finalContent = args.content;
			break;
	}
	try {
		const txRes = await arweave.createTransaction({ data: finalContent }, 'use_wallet');
		args.tags.forEach((tag: TagType) => txRes.addTag(tag.name, tag.value));
		const response = await global.window.arweaveWallet.dispatch(txRes);
		return response.id;
	} catch (e: any) {
		throw new Error(`Error creating transaction ...\n ${e}`);
	}
}

export async function getProfileByWalletAddress(args: { address: string }): Promise<any | null> {
	const emptyProfile = {
		id: null,
		walletAddress: args.address,
		displayName: null,
		username: null,
		bio: null,
		avatar: null,
		banner: null,
	};

	try {
		const profileLookup = await readHandler({
			processId: AO.profileRegistry,
			action: 'Get-Profiles-By-Delegate',
			data: { Address: args.address },
		});

		let activeProfileId: string;
		if (profileLookup && profileLookup.length > 0 && profileLookup[0].ProfileId) {
			activeProfileId = profileLookup[0].ProfileId;
		}

		if (activeProfileId) {
			const fetchedProfile = await readHandler({
				processId: activeProfileId,
				action: 'Info',
				data: null,
			});

			if (fetchedProfile) {
				return {
					id: activeProfileId,
					walletAddress: fetchedProfile.Owner || null,
					displayName: fetchedProfile.Profile.DisplayName || null,
					username: fetchedProfile.Profile.UserName || null,
					bio: fetchedProfile.Profile.Description || null,
					avatar: fetchedProfile.Profile.ProfileImage || null,
					banner: fetchedProfile.Profile.CoverImage || null,
				};
			} else return emptyProfile;
		} else return emptyProfile;
	} catch (e: any) {
		throw new Error(e);
	}
}

export async function readHandler(args: {
	processId: string;
	action: string;
	tags?: TagType[];
	data?: any;
}): Promise<any> {
	const tags = [{ name: 'Action', value: args.action }];
	if (args.tags) tags.push(...args.tags);

	const response = await dryrun({
		process: args.processId,
		tags: tags,
		data: JSON.stringify(args.data || {}),
	});

	if (response.Messages && response.Messages.length) {
		if (response.Messages[0].Data) {
			return JSON.parse(response.Messages[0].Data);
		} else {
			if (response.Messages[0].Tags) {
				return response.Messages[0].Tags.reduce((acc: any, item: any) => {
					acc[item.name] = item.value;
					return acc;
				}, {});
			}
		}
	}
}

export async function messageResult(args: {
	processId: string;
	wallet: any;
	action: string;
	tags: TagType[] | null;
	data: any;
	useRawData?: boolean;
}): Promise<any> {
	try {
		const tags = [{ name: 'Action', value: args.action }];
		if (args.tags) tags.push(...args.tags);

		const data = args.useRawData ? args.data : JSON.stringify(args.data);

		const txId = await message({
			process: args.processId,
			signer: createDataItemSigner(args.wallet),
			tags: tags,
			data: data,
		});

		const { Messages } = await result({ message: txId, process: args.processId });

		if (Messages && Messages.length) {
			const response = {};

			Messages.forEach((message: any) => {
				const action = getTagValue(message.Tags, 'Action') || args.action;

				let responseData = null;
				const messageData = message.Data;

				if (messageData) {
					try {
						responseData = JSON.parse(messageData);
					} catch {
						responseData = messageData;
					}
				}

				const responseStatus = getTagValue(message.Tags, 'Status');
				const responseMessage = getTagValue(message.Tags, 'Message');

				response[action] = {
					id: txId,
					status: responseStatus,
					message: responseMessage,
					data: responseData,
				};
			});

			return response;
		} else return null;
	} catch (e) {
		console.error(e);
	}
}

export async function messageResults(args: {
	processId: string;
	wallet: any;
	action: string;
	tags: TagType[] | null;
	data: any;
	responses?: string[];
	handler?: string;
}): Promise<any> {
	try {
		const tags = [{ name: 'Action', value: args.action }];
		if (args.tags) tags.push(...args.tags);

		await message({
			process: args.processId,
			signer: createDataItemSigner(args.wallet),
			tags: tags,
			data: JSON.stringify(args.data),
		});

		const messageResults = await results({
			process: args.processId,
			sort: 'DESC',
			limit: 100,
		});

		if (messageResults && messageResults.edges && messageResults.edges.length) {
			const response = {};

			for (const result of messageResults.edges) {
				if (result.node && result.node.Messages && result.node.Messages.length) {
					const resultSet = [args.action];
					if (args.responses) resultSet.push(...args.responses);

					for (const message of result.node.Messages) {
						const action = getTagValue(message.Tags, 'Action');

						if (action) {
							let responseData = null;
							const messageData = message.Data;

							if (messageData) {
								try {
									responseData = JSON.parse(messageData);
								} catch {
									responseData = messageData;
								}
							}

							const responseStatus = getTagValue(message.Tags, 'Status');
							const responseMessage = getTagValue(message.Tags, 'Message');

							if (action === 'Action-Response') {
								const responseHandler = getTagValue(message.Tags, 'Handler');
								if (args.handler && args.handler === responseHandler) {
									response[action] = {
										status: responseStatus,
										message: responseMessage,
										data: responseData,
									};
								}
							} else {
								if (resultSet.includes(action)) {
									response[action] = {
										status: responseStatus,
										message: responseMessage,
										data: responseData,
									};
								}
							}

							if (Object.keys(response).length === resultSet.length) break;
						}
					}
				}
			}

			return response;
		}

		return null;
	} catch (e) {
		console.error(e);
	}
}

export * from './follow';
export * from './profiles';
