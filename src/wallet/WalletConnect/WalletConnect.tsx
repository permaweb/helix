import React from 'react';

import { Avatar } from 'components/atoms/Avatar';
import { Button } from 'components/atoms/Button';
import { TurboBalanceFund } from 'components/molecules/TurboBalanceFund';
import { formatAddress, formatARAmount, getTurboBalance } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { CloseHandler } from 'wrappers/CloseHandler';

import * as S from './styles';

export default function WalletConnect(_props: { callback?: () => void }) {
	const arProvider = useArweaveProvider();
	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

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
				if (arProvider.profile && arProvider.profile.handle) {
					setLabel(arProvider.profile.handle);
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

	const copyAddress = React.useCallback(async () => {
		if (arProvider.walletAddress) {
			if (arProvider.walletAddress.length > 0) {
				await navigator.clipboard.writeText(arProvider.walletAddress);
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			}
		}
	}, [arProvider.walletAddress]);

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
						{label && <span>{label}</span>}
						<Avatar owner={arProvider.profile} dimensions={{ wrapper: 32.5, icon: 21.5 }} callback={handlePress} />
					</S.PWrapper>
					{showWalletDropdown && (
						<S.Dropdown className={'border-wrapper-primary'}>
							<S.DHeaderWrapper>
								<S.DHeaderFlex>
									<Avatar owner={arProvider.profile} dimensions={{ wrapper: 35, icon: 23.5 }} callback={null} />
									<S.DHeader>
										<p>{label}</p>
										<span>{formatAddress(arProvider.walletAddress, false)}</span>
									</S.DHeader>
								</S.DHeaderFlex>
								<S.BWrapper>
									<div>
										<p>{language.arBalance}</p>
										<span>{formatARAmount(arProvider.availableBalance ? arProvider.availableBalance : 0)}</span>
									</div>
									<div>
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
									</div>
								</S.BWrapper>
							</S.DHeaderWrapper>
							<S.DBodyWrapper>
								<li onClick={copyAddress}>{copied ? `${language.copied}!` : language.copyWalletAddress}</li>
							</S.DBodyWrapper>
							<S.DFooterWrapper>
								<li onClick={handleDisconnect}>{language.disconnect}</li>
							</S.DFooterWrapper>
						</S.Dropdown>
					)}
				</S.Wrapper>
			</CloseHandler>
			{showFund && <TurboBalanceFund handleClose={() => setShowFund(false)} />}
		</>
	);
}
