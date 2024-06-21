import React from 'react';
import { ReactSVG } from 'react-svg';

import { getProfile } from 'api';

import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { Modal } from 'components/molecules/Modal';
import { AssetsTable } from 'components/organisms/AssetsTable';
import { CollectionsTable } from 'components/organisms/CollectionsTable';
import { ASSETS, REDIRECTS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { ProfileHeaderType } from 'helpers/types';
import { checkAddress, formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';

import * as S from './styles';

const MAX_BIO_LENGTH = 80;

export default function Profile(props: { address: string }) {
	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [loading, setLoading] = React.useState<boolean>(false);
	// const [copied, setCopied] = React.useState<boolean>(false);

	const [fullProfile, setFullProfile] = React.useState<ProfileHeaderType | null>(null);
	const [showBio, setShowBio] = React.useState<boolean>(false);

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
		if (fullProfile && fullProfile.avatar && checkAddress(fullProfile.avatar))
			return <img src={getTxEndpoint(fullProfile.avatar)} />;
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
				{fullProfile.bio && (
					<S.HeaderInfoBio>
						<span>
							{fullProfile.bio.length > MAX_BIO_LENGTH
								? fullProfile.bio.substring(0, MAX_BIO_LENGTH) + '...'
								: fullProfile.bio}
						</span>
						{fullProfile.bio.length > MAX_BIO_LENGTH && (
							<button onClick={() => setShowBio(true)}>{language.viewFullBio}</button>
						)}
					</S.HeaderInfoBio>
				)}
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
								{fullProfile && fullProfile.id && (
									<Button
										type={'alt1'}
										label={language.viewOnBazar}
										handlePress={() => window.open(REDIRECTS.bazar.profile(fullProfile.id), '_blank')}
										icon={ASSETS.bazar}
										noMinWidth
									/>
								)}
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
					{showBio && fullProfile && fullProfile.bio && (
						<Modal header={language.bio} handleClose={() => setShowBio(false)}>
							<div className={'modal-wrapper'}>
								<S.HeaderInfoBio>
									<p>{fullProfile.bio}</p>
								</S.HeaderInfoBio>
							</div>
						</Modal>
					)}
				</>
			);
		} else {
			if (loading) return <Loader />;
			else return null;
		}
	}

	return <>{getProfileData()}</>;
}
