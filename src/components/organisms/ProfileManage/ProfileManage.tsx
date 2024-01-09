import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { createTransaction } from 'api';
import { getCurrentProfile, getFullProfile } from 'gql';

import { Button } from 'components/atoms/Button';
import { Checkbox } from 'components/atoms/Checkbox';
import { FormField } from 'components/atoms/FormField';
import { TextArea } from 'components/atoms/TextArea';
import { Modal } from 'components/molecules/Modal';
import { ALLOWED_AVATAR_TYPES, ALLOWED_BANNER_TYPES, ASSETS, CONTENT_TYPES, TAGS, URLS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { FullProfileType, TagType } from 'helpers/types';
import { base64ToUint8Array, checkAddress, getBase64Data, getDataURLContentType } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { WalletBlock } from 'wallet/WalletBlock';

import * as S from './styles';
import { IProps } from './types';

const MAX_BIO_LENGTH = 500;

export default function ProfileManage(props: IProps) {
	const navigate = useNavigate();

	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const bannerInputRef = React.useRef<any>(null);
	const avatarInputRef = React.useRef<any>(null);

	const [handle, setHandle] = React.useState<string>('');
	const [channelTitle, setChannelTitle] = React.useState<string>('');
	const [bio, setBio] = React.useState<string>('');
	const [banner, setBanner] = React.useState<any>(null);
	const [avatar, setAvatar] = React.useState<any>(null);
	const [useHandleForChannel, setUseHandleForChannel] = React.useState<boolean>(true);

	const [loading, setLoading] = React.useState<boolean>(false);
	const [fullProfile, setFullProfile] = React.useState<FullProfileType | null>(null);
	const [profileResponse, setProfileResponse] = React.useState<string | null>(null);

	const [profileExists, setProfileExists] = React.useState<boolean>(false);

	React.useEffect(() => {
		(async function () {
			if (!props.initial && arProvider.walletAddress) {
				setFullProfile(await getFullProfile({ address: arProvider.walletAddress }));
			}
		})();
	}, [props.initial, arProvider.walletAddress]);

	React.useEffect(() => {
		if (fullProfile) {
			setHandle(fullProfile.handle ?? '');
			setChannelTitle(fullProfile.channelTitle ?? '');
			setBio(fullProfile.bio ?? '');
			setBanner(fullProfile.banner ?? '');
			setAvatar(fullProfile.avatar ?? '');
			setUseHandleForChannel(false);
		}
	}, [fullProfile]);

	React.useEffect(() => {
		(async function () {
			if (arProvider.walletAddress) {
				try {
					setProfileExists((await getCurrentProfile({ address: arProvider.walletAddress })).txId !== null);
				} catch (e: any) {
					console.error(e);
				}
			}
		})();
	}, [arProvider.walletAddress, arProvider.profile]);

	React.useEffect(() => {
		if (useHandleForChannel) setChannelTitle(handle);
	}, [useHandleForChannel, handle]);

	async function handleSubmit() {
		if (arProvider.walletAddress && handle && channelTitle) {
			setLoading(true);

			const dateTime = new Date().getTime().toString();

			let profileTx: any = null;
			let bannerTx: any = null;
			let avatarTx: any = null;

			if (banner) {
				if (checkAddress(banner)) bannerTx = banner;
				else {
					try {
						const thumbnailContentType = getDataURLContentType(banner);
						const base64Data = getBase64Data(banner);
						const uint8ArrayData = base64ToUint8Array(base64Data);

						bannerTx = await createTransaction({
							content: uint8ArrayData,
							contentType: thumbnailContentType,
							tags: [{ name: TAGS.keys.contentType, value: thumbnailContentType }],
						});
					} catch (e: any) {
						console.error(e);
					}
				}
			}

			if (avatar) {
				if (checkAddress(avatar)) avatarTx = avatar;
				else {
					try {
						const thumbnailContentType = getDataURLContentType(avatar);
						const base64Data = getBase64Data(avatar);
						const uint8ArrayData = base64ToUint8Array(base64Data);

						avatarTx = await createTransaction({
							content: uint8ArrayData,
							contentType: thumbnailContentType,
							tags: [{ name: TAGS.keys.contentType, value: thumbnailContentType }],
						});
					} catch (e: any) {
						console.error(e);
					}
				}
			}

			let content: any = {
				walletAddress: arProvider.walletAddress,
				handle: handle,
				channelTitle: channelTitle,
				bio: bio,
			};

			const updatedProfileIndex =
				fullProfile && fullProfile.profileIndex ? (parseInt(fullProfile.profileIndex) + 1).toString() : '1';

			const tags: TagType[] = [
				{ name: TAGS.keys.contentType, value: CONTENT_TYPES.json },
				{ name: TAGS.keys.initialOwner, value: arProvider.walletAddress },
				{ name: TAGS.keys.handle, value: handle },
				{ name: TAGS.keys.channelTitle, value: channelTitle },
				{ name: TAGS.keys.protocolName, value: TAGS.values.profileVersions['1'] },
				{ name: TAGS.keys.profileIndex, value: updatedProfileIndex },
				{ name: TAGS.keys.dateCreated, value: dateTime },
			];

			if (bannerTx) {
				content.banner = bannerTx;
				tags.push({ name: TAGS.keys.banner, value: bannerTx });
			}
			if (avatarTx) {
				content.avatar = avatarTx;
				tags.push({ name: TAGS.keys.avatar, value: avatarTx });
			}

			try {
				profileTx = await createTransaction({
					content: content,
					contentType: CONTENT_TYPES.json,
					tags: tags,
				});
				setProfileResponse(profileTx);
			} catch (e: any) {
				console.error(e);
			}
			setLoading(false);
		}
	}

	function getInvalidBio() {
		if (bio && bio.length > MAX_BIO_LENGTH) {
			return {
				status: true,
				message: `${language.charLimitReached} (${bio.length} / ${MAX_BIO_LENGTH})`,
			};
		}
		return { status: false, message: null };
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'avatar') {
		if (e.target.files && e.target.files.length) {
			const file = e.target.files[0];
			if (file.type.startsWith('image/')) {
				const reader = new FileReader();

				reader.onload = (event: ProgressEvent<FileReader>) => {
					if (event.target?.result) {
						switch (type) {
							case 'banner':
								setBanner(event.target.result);
								break;
							case 'avatar':
								setAvatar(event.target.result);
								break;
							default:
								break;
						}
					}
				};

				reader.readAsDataURL(file);
			}
			e.target.value = '';
		}
	}

	function getBannerWrapper() {
		if (banner) return <img src={checkAddress(banner) ? getTxEndpoint(banner) : banner} />;
		return (
			<>
				<ReactSVG src={ASSETS.image} />
				<span>{language.uploadBanner}</span>
			</>
		);
	}

	function getAvatarWrapper() {
		if (avatar) return <img src={checkAddress(avatar) ? getTxEndpoint(avatar) : avatar} />;
		return (
			<>
				<ReactSVG src={ASSETS.user} />
				<span>{language.uploadAvatar}</span>
			</>
		);
	}

	function getConnectedView() {
		if (!arProvider.walletAddress) return <WalletBlock />;
		else {
			return (
				<>
					<S.Wrapper className={'max-view-wrapper'}>
						<S.Header>
							<h4>{props.initial ? language.signUp : language.editProfile}</h4>
						</S.Header>
						<S.Body>
							<S.Form className={'border-wrapper-primary'}>
								<FormField
									label={language.handle}
									value={handle}
									onChange={(e: any) => setHandle(e.target.value)}
									disabled={loading || (!props.initial && !fullProfile)}
									invalid={{ status: false, message: null }}
									required
								/>
								<FormField
									label={language.channelTitle}
									value={channelTitle}
									onChange={(e: any) => setChannelTitle(e.target.value)}
									disabled={loading || (!props.initial && !fullProfile) || useHandleForChannel}
									invalid={{ status: false, message: null }}
									required
									hideErrorMessage
								/>
								<S.CWrapper>
									<span>{language.useHandleForChannel}</span>
									<Checkbox
										checked={useHandleForChannel}
										handleSelect={() => setUseHandleForChannel(!useHandleForChannel)}
										disabled={loading}
									/>
								</S.CWrapper>
								<TextArea
									label={language.bio}
									value={bio}
									onChange={(e: any) => setBio(e.target.value)}
									disabled={loading || (!props.initial && !fullProfile)}
									invalid={getInvalidBio()}
								/>
							</S.Form>
							<S.PWrapper>
								<S.BWrapper>
									<S.BInput
										hasBanner={banner !== null}
										onClick={() => bannerInputRef.current.click()}
										disabled={loading || (!props.initial && !fullProfile)}
									>
										{getBannerWrapper()}
									</S.BInput>
									<input
										ref={bannerInputRef}
										type={'file'}
										onChange={(e: any) => handleFileChange(e, 'banner')}
										disabled={loading || (!props.initial && !fullProfile)}
										accept={ALLOWED_BANNER_TYPES}
									/>
									<S.AInput
										hasAvatar={avatar !== null}
										onClick={() => avatarInputRef.current.click()}
										disabled={loading || (!props.initial && !fullProfile)}
									>
										{getAvatarWrapper()}
									</S.AInput>
									<input
										ref={avatarInputRef}
										type={'file'}
										onChange={(e: any) => handleFileChange(e, 'avatar')}
										disabled={loading || (!props.initial && !fullProfile)}
										accept={ALLOWED_AVATAR_TYPES}
									/>
								</S.BWrapper>
								<S.PActions>
									<Button
										type={'primary'}
										label={language.removeAvatar}
										handlePress={() => setAvatar(null)}
										disabled={loading || !avatar || (!props.initial && !fullProfile)}
									/>
									<Button
										type={'primary'}
										label={language.removeBanner}
										handlePress={() => setBanner(null)}
										disabled={loading || !banner || (!props.initial && !fullProfile)}
									/>
								</S.PActions>
								<S.SWrapper className={'border-wrapper-alt1'}>
									<S.SSection>
										<span>{language.handle}</span>
										<p>{handle ? handle : '-'}</p>
									</S.SSection>
									<S.SSection>
										<span>{language.channelTitle}</span>
										<p>{channelTitle ? channelTitle : '-'}</p>
									</S.SSection>
									<S.SSection>
										<span>{language.bio}</span>
										<p>{bio ? bio : '-'}</p>
									</S.SSection>
								</S.SWrapper>
								<S.SAction>
									<Button
										type={'alt1'}
										label={language.submit}
										handlePress={handleSubmit}
										disabled={!handle || !channelTitle || loading}
										loading={loading || (!props.initial && !fullProfile)}
									/>
								</S.SAction>
							</S.PWrapper>
						</S.Body>
					</S.Wrapper>
					{profileResponse && (
						<Modal
							header={props.initial ? language.profileCreated : language.profileUpdated}
							handleClose={() => setProfileResponse(null)}
						>
							<S.MWrapper>
								<S.MInfo>
									<span>{props.initial ? language.profileCreatedInfo : language.profileUpdatedInfo}</span>
								</S.MInfo>
								<S.MActions>
									<Button type={'primary'} label={language.close} handlePress={() => setProfileResponse(null)} />
									<Button
										type={'alt1'}
										label={language.viewProfile}
										handlePress={() => navigate(URLS.profileChannel(arProvider.walletAddress))}
										disabled={false}
										formSubmit
									/>
								</S.MActions>
							</S.MWrapper>
						</Modal>
					)}
					{profileExists && props.initial && (
						<Modal header={language.profileExists} handleClose={null}>
							<S.MWrapper>
								<S.MInfo>
									<span>{language.profileExistsInfo}</span>
								</S.MInfo>
								<S.MActions>
									<Button
										type={'alt1'}
										label={language.viewProfile}
										handlePress={() => navigate(URLS.profileChannel(arProvider.walletAddress))}
										disabled={false}
										formSubmit
									/>
								</S.MActions>
							</S.MWrapper>
						</Modal>
					)}
				</>
			);
		}
	}

	return getConnectedView();
}
