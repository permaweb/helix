import React from 'react';
import { ReactSVG } from 'react-svg';

import { getProfile } from 'api';

import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { AssetsTable } from 'components/organisms/AssetsTable';
import { CollectionsTable } from 'components/organisms/CollectionsTable';
import { ASSETS, REDIRECTS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { ProfileHeaderType } from 'helpers/types';
import { checkAddress, formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';

import * as S from './styles';

export default function Profile(props: { address: string }) {
	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [loading, setLoading] = React.useState<boolean>(false);
	// const [copied, setCopied] = React.useState<boolean>(false);

	const [fullProfile, setFullProfile] = React.useState<ProfileHeaderType | null>(null);

	// const copyAddress = React.useCallback(async () => {
	// 	if (fullProfile && fullProfile.walletAddress) {
	// 		if (fullProfile.walletAddress.length > 0) {
	// 			await navigator.clipboard.writeText(fullProfile.walletAddress);
	// 			setCopied(true);
	// 			setTimeout(() => setCopied(false), 2000);
	// 		}
	// 	}
	// }, [fullProfile]);

	React.useEffect(() => {
		(async function () {
			if (props.address && checkAddress(props.address)) {
				setLoading(true);
				try {
					const currentProfile = await getProfile({ address: props.address });
					setFullProfile(currentProfile);
				} catch (e: any) {
					console.error(e);
				}
				setLoading(false);
			}
		})();
	}, [props.address, arProvider.profile]);

	function getAvatar() {
		if (fullProfile && fullProfile.avatar) return <img src={getTxEndpoint(fullProfile.avatar)} />;
		return <ReactSVG src={ASSETS.user} />;
	}

	function getUsername() {
		return fullProfile.username ? `@${fullProfile.username}` : formatAddress(fullProfile.walletAddress, false);
	}

	function getHeaderDetails() {
		return (
			<S.HeaderHA>
				<h4>{fullProfile.displayName ? fullProfile.displayName : formatAddress(fullProfile.walletAddress, false)}</h4>
				<S.HeaderInfoDetail>
					<span>{`${getUsername()}`}</span>
				</S.HeaderInfoDetail>
				{/* <S.HeaderAddress onClick={copyAddress}>
					<ReactSVG src={ASSETS.wallet} />
					<p>{formatAddress(fullProfile.walletAddress, false)}</p>
					{copied && <span>{`${language.copied}!`}</span>}
				</S.HeaderAddress> */}
			</S.HeaderHA>
		);
	}

	function getProfileData() {
		if (fullProfile) {
			return (
				<>
					<S.Wrapper className={'max-view-wrapper'}>
						<S.HeaderInfo className={'border-wrapper-alt2'}>
							<S.HeaderAvatar>{getAvatar()}</S.HeaderAvatar>
							{getHeaderDetails()}
							<S.HeaderActions>
								<Button
									type={'alt1'}
									label={language.viewOnBazar}
									handlePress={() => window.open(REDIRECTS.bazar.profile(props.address), '_blank')}
									icon={ASSETS.bazar}
									noMinWidth
								/>
							</S.HeaderActions>
						</S.HeaderInfo>
						<S.Body>
							<S.TWrapper>
								<AssetsTable useIdAction={false} />
							</S.TWrapper>
							<S.TWrapper>
								<CollectionsTable />
							</S.TWrapper>
						</S.Body>
					</S.Wrapper>
				</>
			);
		} else {
			if (loading) return <Loader />;
			else return null;
		}
	}

	return <>{getProfileData()}</>;
}
