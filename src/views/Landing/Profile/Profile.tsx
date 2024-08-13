import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { getProfile } from 'api';

import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { Modal } from 'components/molecules/Modal';
import { AssetsTable } from 'components/organisms/AssetsTable';
import { CollectionsTable } from 'components/organisms/CollectionsTable';
import { ProfileManage } from 'components/organisms/ProfileManage';
import { ASSETS, REDIRECTS, URLS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { ProfileHeaderType } from 'helpers/types';
import { checkValidAddress, formatAddress } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';

import * as S from './styles';

const MAX_BIO_LENGTH = 250;

export default function Profile(props: { address: string }) {
	const navigate = useNavigate();

	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [loading, setLoading] = React.useState<boolean>(false);
	// const [copied, setCopied] = React.useState<boolean>(false);

	const [fullProfile, setFullProfile] = React.useState<ProfileHeaderType | null>(null);
	const [showBio, setShowBio] = React.useState<boolean>(false);
	const [showManage, setShowManage] = React.useState<boolean>(false);

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
			if (props.address && checkValidAddress(props.address)) {
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
		if (fullProfile && fullProfile.avatar && checkValidAddress(fullProfile.avatar))
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
					<S.Wrapper>
						<S.HeaderInfo>
							<S.HeaderAvatar>{getAvatar()}</S.HeaderAvatar>
							{getHeaderDetails()}
							<S.HeaderActions>
								<Button
									type={'primary'}
									label={arProvider.profile && arProvider.profile.id ? language.editProfile : language.createProfile}
									handlePress={() => setShowManage(true)}
									disabled={!arProvider.walletAddress}
									icon={ASSETS.user}
									iconLeftAlign
									noMinWidth
								/>
								<Button
									type={'primary'}
									label={language.upload}
									handlePress={() => navigate(URLS.upload)}
									disabled={!arProvider.walletAddress}
									icon={ASSETS.upload}
									iconLeftAlign
									noMinWidth
								/>
								<Button
									type={'primary'}
									label={language.viewOnBazar}
									handlePress={() => window.open(REDIRECTS.bazar.profile(fullProfile.id), '_blank')}
									disabled={!fullProfile || !fullProfile.id}
									icon={ASSETS.bazar}
									iconLeftAlign
									noMinWidth
								/>
								<Button
									type={'primary'}
									label={language.readDocs}
									handlePress={() => navigate(URLS.docs)}
									disabled={false}
									icon={ASSETS.docs}
									iconLeftAlign
									noMinWidth
								/>
							</S.HeaderActions>
						</S.HeaderInfo>
						<S.Body>
							{fullProfile && fullProfile.id ? (
								<>
									<S.TWrapper>
										<AssetsTable useIdAction={false} />
									</S.TWrapper>
									<S.TWrapper>
										<CollectionsTable />
									</S.TWrapper>
								</>
							) : (
								<S.CreateWrapper>
									<Button
										type={'alt1'}
										label={arProvider.profile && arProvider.profile.id ? language.editProfile : language.createProfile}
										handlePress={() => setShowManage(true)}
										disabled={!arProvider.walletAddress}
										icon={ASSETS.user}
										height={55}
										width={450}
										iconLeftAlign
									/>
								</S.CreateWrapper>
							)}
						</S.Body>
					</S.Wrapper>
					{showManage && (
						<Modal
							header={arProvider.profile && arProvider.profile.id ? language.editProfile : `${language.createProfile}!`}
							handleClose={() => setShowManage(false)}
						>
							<ProfileManage
								profile={arProvider.profile && arProvider.profile.id ? arProvider.profile : null}
								handleClose={() => setShowManage(false)}
								handleUpdate={null}
							/>
						</Modal>
					)}
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
