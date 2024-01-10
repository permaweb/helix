import { useArweaveProvider } from 'providers/ArweaveProvider';
import { WalletBlock } from 'wallet/WalletBlock';

import { Profile } from './Profile';

export default function Landing() {
	const arProvider = useArweaveProvider();

	return arProvider.walletAddress ? <Profile address={arProvider.walletAddress} /> : <WalletBlock />;
}
