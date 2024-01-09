import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';

import { getGQLData } from 'gql';

import { API_CONFIG, CONTENT_TYPES, CONTRACT_CONFIG, GATEWAYS } from 'helpers/config';
import { TagType } from 'helpers/types';
import { log, logValue } from 'helpers/utils';

LoggerFactory.INST.logLevel('fatal');

const arweave = Arweave.init({
	host: GATEWAYS.arweave,
	protocol: API_CONFIG.protocol,
	port: API_CONFIG.port,
	timeout: API_CONFIG.timeout,
	logging: API_CONFIG.logging,
});

const warp = WarpFactory.forMainnet({
	...defaultCacheOptions,
	inMemory: true,
}).use(new DeployPlugin());

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

export async function createContract(args: { assetId: string }) {
	try {
		let fetchedAssetId: string;
		while (!fetchedAssetId) {
			await new Promise((r) => setTimeout(r, 2000));
			const gqlResponse = await getGQLData({
				gateway: GATEWAYS.arweave,
				ids: [args.assetId],
				tagFilters: null,
				owners: null,
				cursor: null,
				reduxCursor: null,
				cursorObjectKey: null,
			});

			if (gqlResponse && gqlResponse.data.length) {
				logValue(`Fetched Transaction`, gqlResponse.data[0].node.id, 0);
				fetchedAssetId = gqlResponse.data[0].node.id;
			} else {
				logValue(`Transaction Not Found`, args.assetId, 0);
			}
		}

		const { contractTxId } = await warp.register(fetchedAssetId, CONTRACT_CONFIG.node as any);
		return contractTxId;
	} catch (e: any) {
		logValue(`Error deploying contract - Asset ID`, args.assetId, 1);

		const errorString = e.toString();
		if (errorString.indexOf('500') > -1) {
			return null;
		}

		if (errorString.indexOf('502') > -1 || errorString.indexOf('504') > -1 || errorString.indexOf('FetchError') > -1) {
			let retries = 5;
			for (let i = 0; i < retries; i++) {
				await new Promise((r) => setTimeout(r, 2000));
				try {
					log(`Retrying Warp ...`, null);
					const { contractTxId } = await warp.register(args.assetId, CONTRACT_CONFIG.node as any);
					log(`Retry succeeded`, 0);
					return contractTxId;
				} catch (e2: any) {
					logValue(`Error deploying contract - Asset ID`, args.assetId, 1);
					continue;
				}
			}
		}
	}

	throw new Error(`Contract deployment retries failed ...`);
}

export * from './assets';
export * from './follow';
