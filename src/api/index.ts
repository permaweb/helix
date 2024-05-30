import Arweave from 'arweave';
import { createDataItemSigner, dryrun, message, results } from '@permaweb/aoconnect';

import { API_CONFIG, CONTENT_TYPES, GATEWAYS } from 'helpers/config';
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

export async function readHandler(args: { processId: string; action: string; data: any }): Promise<any> {
	const response = await dryrun({
		process: args.processId,
		tags: [{ name: 'Action', value: args.action }],
		data: JSON.stringify(args.data),
	});

	if (response.Messages && response.Messages.length && response.Messages[0].Data) {
		return JSON.parse(response.Messages[0].Data);
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
