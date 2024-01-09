import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { getAssetCountByOwner, getFollowerCount, getFullProfile } from 'gql';

import { Button } from 'components/atoms/Button';
import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
import { AddressFollow } from 'components/molecules/AddressFollow';
import { AddressShare } from 'components/molecules/AddressShare';
import { Modal } from 'components/molecules/Modal';
import { URLTabs } from 'components/molecules/URLTabs';
import { ASSETS, URLS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { FullProfileType } from 'helpers/types';
import { checkAddress, formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';

import { ProfileChannel } from './ProfileChannel';
import { ProfileCommunity } from './ProfileCommunity';
import * as S from './styles';

export default function Profile() {
	const { address } = useParams();
	const navigate = useNavigate();

	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [loading, setLoading] = React.useState<boolean>(false);
	const [profileExists, setProfileExists] = React.useState<boolean>(true);
	const [connectedProfile, setConnectedProfile] = React.useState<boolean>(false);
	const [copied, setCopied] = React.useState<boolean>(false);

	const [fullProfile, setFullProfile] = React.useState<FullProfileType | null>(null);
	const [showInfoModal, setShowInfoModal] = React.useState<boolean>(false);

	const [followerCount, setFollowerCount] = React.useState<number | null>(null);
	const [assetCount, setAssetCount] = React.useState<number | null>(null);

	const copyAddress = React.useCallback(async () => {
		if (fullProfile && fullProfile.walletAddress) {
			if (fullProfile.walletAddress.length > 0) {
				await navigator.clipboard.writeText(fullProfile.walletAddress);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			}
		}
	}, [fullProfile]);

	React.useEffect(() => {
		(async function () {
			if (address && checkAddress(address)) {
				setLoading(true);
				try {
					const currentProfile = await getFullProfile({ address: address });
					setFullProfile(currentProfile);
					setProfileExists(currentProfile.txId !== null);
				} catch (e: any) {
					console.error(e);
				}
				setLoading(false);

				try {
					setFollowerCount(await getFollowerCount({ address: address }));
				} catch (e: any) {
					console.error(e);
					setFollowerCount(0);
				}
				try {
					setAssetCount(await getAssetCountByOwner({ address: address }));
				} catch (e: any) {
					console.error(e);
					setAssetCount(0);
				}
			} else {
				navigate(URLS.signup);
			}
		})();
	}, [address]);

	React.useEffect(() => {
		if (address && arProvider.walletAddress && address === arProvider.walletAddress) setConnectedProfile(true);
	}, [address, arProvider.walletAddress]);

	const TABS = [
		{
			label: language.channel,
			disabled: false,
			url: URLS.profileChannel(address),
			view: () => <ProfileChannel address={address} />,
		},
		{
			label: language.community,
			disabled: false,
			url: URLS.profileCommunity(address),
			view: () => <ProfileCommunity address={address} />,
		},
	];

	function getAvatar() {
		if (fullProfile && fullProfile.avatar) return <img src={getTxEndpoint(fullProfile.avatar)} />;
		return <ReactSVG src={ASSETS.user} />;
	}

	const urlTabs = React.useMemo(() => {
		return <URLTabs tabs={TABS} activeUrl={TABS[0]!.url} />;
	}, [address]);

	function getHandle() {
		return fullProfile.handle ? `@${fullProfile.handle}` : formatAddress(fullProfile.walletAddress, false);
	}

	function getFollowCount() {
		return followerCount !== null
			? `${followerCount} ${followerCount === 1 ? language.follower.toLowerCase() : language.followers.toLowerCase()}`
			: `${language.fetching}...`;
	}

	function getAssetCount() {
		return assetCount !== null
			? `${assetCount} ${assetCount === 1 ? language.video.toLowerCase() : language.videos.toLowerCase()}`
			: `${language.fetching}...`;
	}

	function getHeaderDetails() {
		return (
			<S.HeaderHA>
				<h4>{fullProfile.channelTitle ? fullProfile.channelTitle : formatAddress(fullProfile.walletAddress, false)}</h4>
				<S.HeaderInfoDetail>
					<span>{`${getHandle()} · ${getFollowCount()} · ${getAssetCount()}`}</span>
				</S.HeaderInfoDetail>
				{profileExists && (
					<S.HeaderInfoAction>
						{fullProfile.bio ? (
							<S.HBio>
								<p>{fullProfile.bio}</p>
								<S.HAction>
									<IconButton
										type={'primary'}
										active={false}
										src={ASSETS.arrow}
										handlePress={() => setShowInfoModal(true)}
										dimensions={{ wrapper: 21.5, icon: 11.5 }}
									/>
								</S.HAction>
							</S.HBio>
						) : (
							<Button type={'alt2'} label={'View details'} handlePress={() => setShowInfoModal(true)} />
						)}
					</S.HeaderInfoAction>
				)}
				<S.HeaderAddress onClick={copyAddress}>
					<ReactSVG src={ASSETS.wallet} />
					<p>{formatAddress(fullProfile.walletAddress, false)}</p>
					{copied && <span>{`${language.copied}!`}</span>}
				</S.HeaderAddress>
			</S.HeaderHA>
		);
	}

	function getProfile() {
		if (fullProfile) {
			return (
				<>
					<S.Wrapper className={'max-view-wrapper'}>
						<S.Header banner={fullProfile.banner ? getTxEndpoint(fullProfile.banner) : null}>
							<S.HeaderInfo>
								<S.HeaderAvatar>{getAvatar()}</S.HeaderAvatar>
								{getHeaderDetails()}
								<S.HeaderActions>
									<AddressShare type={'alt1'} address={address} />
									{connectedProfile && !profileExists && (
										<Button
											type={'alt1'}
											label={language.signUp}
											handlePress={() => navigate(URLS.signup)}
											noMinWidth
										/>
									)}
									{!connectedProfile && <AddressFollow address={address} />}
									{connectedProfile && profileExists && (
										<Button
											type={'alt1'}
											label={language.editProfile}
											handlePress={() => navigate(URLS.profileManage)}
											noMinWidth
										/>
									)}
								</S.HeaderActions>
							</S.HeaderInfo>
						</S.Header>
						<S.Body>{urlTabs}</S.Body>
					</S.Wrapper>
					{showInfoModal && (
						<Modal header={language.about} handleClose={() => setShowInfoModal(false)}>
							<S.MWrapper>
								<S.MSection>
									<span>{fullProfile.bio ? fullProfile.bio : language.noBio}</span>
								</S.MSection>
								<S.MSection>
									<p>{language.channelDetails}</p>
									<S.MDetailSection>
										<ReactSVG src={ASSETS.link} />
										<Link to={URLS.profileChannel(address)} target={'_blank'}>{`${
											window.location.origin
										}/#${URLS.profileChannel(address)}`}</Link>
									</S.MDetailSection>
									<S.MDetailSection>
										<ReactSVG src={ASSETS.following} />
										<span>{getFollowCount()}</span>
									</S.MDetailSection>
									<S.MDetailSection>
										<ReactSVG src={ASSETS.asset} />
										<span>{getAssetCount()}</span>
									</S.MDetailSection>
								</S.MSection>
							</S.MWrapper>
						</Modal>
					)}
				</>
			);
		} else {
			if (loading) return <Loader />;
			else return null;
		}
	}

	return <>{getProfile()}</>;
}
