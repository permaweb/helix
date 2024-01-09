import React from 'react';

import { followAddress } from 'api';
import { checkFollowingTarget } from 'gql';

import { Button } from 'components/atoms/Button';
import { Notification } from 'components/atoms/Notification';
import { GATEWAYS } from 'helpers/config';
import { formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';

import { IProps } from './types';

export default function AddressFollow(props: IProps) {
	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [followDisabled, setFollowDisabled] = React.useState<boolean>(true);
	const [isFollowing, setIsFollowing] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [followResponse, setFollowResponse] = React.useState<string | null>(null);

	React.useEffect(() => {
		(async function () {
			if (arProvider.walletAddress) {
				if (arProvider.walletAddress === props.address) setFollowDisabled(true);
				else {
					const isFollowing = await checkFollowingTarget({
						targetAddress: props.address,
						requestAddress: arProvider.walletAddress,
						gateway: GATEWAYS.arweave,
					});
					setIsFollowing(isFollowing);
					setFollowDisabled(isFollowing);
				}
			} else setFollowDisabled(true);
		})();
	}, [arProvider, props.address]);

	async function handleFollow() {
		setLoading(true);
		try {
			const txId = await followAddress({ address: props.address });
			if (txId) {
				setFollowResponse(language.followed(formatAddress(props.address, false)));
				setFollowDisabled(true);
			}
		} catch (e: any) {
			console.error(e);
			setFollowResponse(language.errorOccurred);
		}
		setLoading(false);
	}

	function getAction() {
		if (!props.address) return null;
		if (arProvider.walletAddress && props.address && arProvider.walletAddress === props.address) return null;
		return (
			<>
				<Button
					type={'alt1'}
					label={language.follow}
					handlePress={handleFollow}
					disabled={followDisabled || loading}
					loading={loading}
					noMinWidth
					tooltip={arProvider.walletAddress ? (isFollowing ? language.following : null) : language.connectWallet}
					useBottomToolTip
				/>
				{followResponse && <Notification message={followResponse} callback={() => setFollowResponse(null)} />}
			</>
		);
	}

	return getAction();
}
