import Arweave from 'arweave';
import { dryrun } from '@permaweb/aoconnect';

import { API_CONFIG, CONTENT_TYPES, GATEWAYS } from 'helpers/config';
import { TagType } from 'helpers/types';

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

export * from './follow';
export * from './profiles';
