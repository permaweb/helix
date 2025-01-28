import React from 'react';
import { ReactSVG } from 'react-svg';

import { Avatar } from 'components/atoms/Avatar';
import { Modal } from 'components/molecules/Modal';
import { TurboBalanceFund } from 'components/molecules/TurboBalanceFund';
import { ProfileManage } from 'components/organisms/ProfileManage';
import { ASSETS } from 'helpers/config';
import { formatAddress, formatARAmount } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { CloseHandler } from 'wrappers/CloseHandler';

import * as S from './styles';

export default function WalletConnect(_props: { callback?: () => void }) {
	const arProvider = useArweaveProvider();
	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const [showManage, setShowManage] = React.useState<boolean>(false);
	const [showWallet, setShowWallet] = React.useState<boolean>(false);
	const [showWalletDropdown, setShowWalletDropdown] = React.useState<boolean>(false);
	const [showFund, setShowFund] = React.useState<boolean>(false);

	const [copied, setCopied] = React.useState<boolean>(false);
	const [label, setLabel] = React.useState<string | null>(null);

	React.useEffect(() => {
		setTimeout(() => {
			setShowWallet(true);
		}, 200);
	}, [arProvider.walletAddress]);

	React.useEffect(() => {
		if (!showWallet) {
			setLabel(`${language.fetching}...`);
		} else {
			if (arProvider.walletAddress) {
				if (arProvider.profile && arProvider.profile.username) {
					setLabel(arProvider.profile.username);
				} else {
					setLabel(formatAddress(arProvider.walletAddress, false));
				}
			} else {
				setLabel(language.connect);
			}
		}
	}, [showWallet, arProvider.walletAddress, arProvider.profile]);

	function handlePress() {
		if (arProvider.walletAddress) {
			setShowWalletDropdown(!showWalletDropdown);
		} else {
			arProvider.setWalletModalVisible(true);
		}
	}

	const copyAddress = React.useCallback(async (address: string) => {
		if (address) {
			if (address.length > 0) {
				await navigator.clipboard.writeText(address);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			}
		}
	}, []);

	function handleDisconnect() {
		arProvider.handleDisconnect();
		setShowWalletDropdown(false);
	}

	return (
		<>
			<CloseHandler
				callback={() => {
					setShowWalletDropdown(false);
				}}
				active={showWalletDropdown}
				disabled={false}
			>
				<S.Wrapper>
					<S.PWrapper>
						<Avatar owner={arProvider.profile} dimensions={{ wrapper: 32.5, icon: 21.5 }} callback={handlePress} />
					</S.PWrapper>
					{showWalletDropdown && (
						<S.Dropdown className={'border-wrapper-alt2'}>
							<S.DHeaderWrapper>
								<S.DHeaderFlex>
									<Avatar owner={arProvider.profile} dimensions={{ wrapper: 35, icon: 23.5 }} callback={null} />
									<S.DHeader>
										<p>{label}</p>
									</S.DHeader>
								</S.DHeaderFlex>
								<S.BWrapper>
									<S.BalanceLine>
										<ReactSVG src={ASSETS.ar} />
										<span>{formatARAmount(arProvider.arBalance ? arProvider.arBalance : 0)}</span>
									</S.BalanceLine>
									{/* <div>
										<S.BHeader>
											<p>{language.turboBalance}</p>
											<S.BHeaderActions>
												{arProvider.turboBalance === null && (
													<Button
														type={'alt1'}
														label={language.show}
														handlePress={() => arProvider.getTurboBalance()}
														disabled={arProvider.turboBalance !== null}
														height={22.5}
														noMinWidth
													/>
												)}
												<Button
													type={'alt1'}
													label={language.fund}
													handlePress={() => setShowFund(true)}
													height={22.5}
													noMinWidth
												/>
											</S.BHeaderActions>
										</S.BHeader>
										<span>{getTurboBalance(arProvider.turboBalance)}</span>
									</div> */}
								</S.BWrapper>
							</S.DHeaderWrapper>
							<S.DBodyWrapper>
								<li onClick={() => copyAddress(arProvider.profile?.id)}>
									<ReactSVG src={ASSETS.copy} />
									{copied ? `${language.copied}!` : language.copyProfileId}
								</li>
								<li onClick={handleDisconnect}>
									<ReactSVG src={ASSETS.disconnect} />
									{language.disconnect}
								</li>
							</S.DBodyWrapper>
						</S.Dropdown>
					)}
				</S.Wrapper>
			</CloseHandler>
			{showFund && <TurboBalanceFund handleClose={() => setShowFund(false)} />}
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
		</>
	);
}
