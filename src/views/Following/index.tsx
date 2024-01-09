import React from 'react';

import { getFollowing } from 'gql';

import { Loader } from 'components/atoms/Loader';
import { AssetsTable } from 'components/organisms/AssetsTable';
import { GATEWAYS } from 'helpers/config';
import { FollowingType } from 'helpers/types';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { WalletBlock } from 'wallet/WalletBlock';

export default function Following() {
	const arProvider = useArweaveProvider();

	const [following, setFollowing] = React.useState<FollowingType | null>(null);

	React.useEffect(() => {
		(async function () {
			if (arProvider.walletAddress) {
				try {
					setFollowing(await getFollowing({ requestAddress: arProvider.walletAddress, gateway: GATEWAYS.arweave }));
				} catch (e: any) {
					console.error(e);
				}
			} else {
				setFollowing(null);
			}
		})();
	}, [arProvider.walletAddress]);

	function getConnectedView() {
		if (!arProvider.walletAddress) return <WalletBlock />;
		if (!following) return <Loader />;
		else {
			return <AssetsTable owners={following.addresses} />;
		}
	}

	return getConnectedView();
}
