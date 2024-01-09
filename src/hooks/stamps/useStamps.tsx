import React from 'react';

import Arweave from 'arweave';
import { defaultCacheOptions, LoggerFactory, WarpFactory } from 'warp-contracts';
import { DeployPlugin } from 'warp-contracts-plugin-deploy';
import { InjectedArweaveSigner } from 'warp-contracts-plugin-signature';
import Stamps from '@permaweb/stampjs';

import { API_CONFIG, GATEWAYS } from 'helpers/config';
import { StampType } from 'helpers/types';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';

LoggerFactory.INST.logLevel('fatal');

export default function useStamps() {
	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [stampLib, setStampLib] = React.useState<any>(null);
	const [stampDisabled, setStampDisabled] = React.useState<boolean>(false);

	React.useEffect(() => {
		(async function () {
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

			const stamps = Stamps.init({
				warp: warp,
				arweave: arweave,
				wallet: arProvider.walletAddress ? new InjectedArweaveSigner(arProvider.walletAddress) : null,
				graphql: `${API_CONFIG.protocol}://${GATEWAYS.arweave}/graphql`,
			});
			setStampLib(stamps);

			if (!arProvider.walletAddress) setStampDisabled(true);
		})();
	}, [arProvider.walletAddress]);

	async function getStampObject(ids: string[]) {
		if (ids && stampLib) {
			let stampCounts: any = {};
			let stampChecks: any = {};
			try {
				stampCounts = await stampLib.counts(ids);

				if (arProvider.walletAddress) {
					stampChecks = await stampLib.hasStamped([...ids, '']);
				}

				const stampObject = {};
				ids.forEach((id: string) => {
					stampObject[id] = getStamps(id, { ...stampCounts }, { ...stampChecks });
				});
				return stampObject;
			} catch (e: any) {
				console.error(e);
				return null;
			}
		}
	}

	const handleStamp: any = React.useCallback(
		async (id: string, amount?: number) => {
			try {
				if (id) {
					setStampDisabled(true);

					const stamp: any = await stampLib.stamp(id, amount ? amount : 0, [{ name: '', value: '' }]);
					let stampSuccess = stamp && stamp.bundlrResponse && stamp.bundlrResponse.id;
					if (!stampSuccess) {
						stampSuccess = stamp && stamp.id;
					}

					if (!stampSuccess) {
						setStampDisabled(false);
						return language.errorOccurred;
					}

					return stampSuccess ? language.stamped : language.errorOccurred;
				}
			} catch (e: any) {
				return e.toString();
			}
		},
		[stampLib]
	);

	return {
		stampLib,
		handleStamp,
		stampDisabled,
		getStampObject,
	};
}

function getStamps(assetId: string, stampCounts: any, stampChecks: any) {
	let stamps: StampType = { total: 0, vouched: 0, connectedWalletStamped: false };

	if (stampCounts && stampCounts[assetId]) {
		stamps.total = stampCounts[assetId].total;
		stamps.vouched = stampCounts[assetId].vouched;
	}
	if (stampChecks && stampChecks[assetId]) {
		stamps.connectedWalletStamped = stampChecks[assetId];
	}
	return stamps;
}
