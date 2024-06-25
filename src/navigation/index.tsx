import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { IconButton } from 'components/atoms/IconButton';
import { ASSETS, STYLING, URLS } from 'helpers/config';
import { NavPathType } from 'helpers/types';
import * as windowUtils from 'helpers/window';
import { checkWindowCutoff, checkWindowResize } from 'helpers/window';
import { useCustomThemeProvider } from 'providers/CustomThemeProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { WalletConnect } from 'wallet/WalletConnect';
import { CloseHandler } from 'wrappers/CloseHandler';

import * as S from './styles';

export default function Navigation() {
	const location = useLocation();
	const navigate = useNavigate();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const themeProvider = useCustomThemeProvider();

	const [panelOpen, setPanelOpen] = React.useState<boolean>(false);
	const [_desktop, setDesktop] = React.useState(checkWindowCutoff(parseInt(STYLING.cutoffs.initial)));

	function handleWindowResize() {
		if (checkWindowCutoff(parseInt(STYLING.cutoffs.initial))) {
			setDesktop(true);
		} else {
			setDesktop(false);
		}
	}

	checkWindowResize(handleWindowResize);

	const NAV_PATHS: NavPathType[] = [
		{ path: URLS.base, label: language.home, icon: ASSETS.landing },
		{ path: URLS.upload, label: language.upload, icon: ASSETS.upload },
		{ path: URLS.docs, basePath: URLS.docs, label: language.docs, icon: ASSETS.docs },
	];

	React.useEffect(() => {
		if (panelOpen) windowUtils.hideDocumentBody();
		else windowUtils.showDocumentBody();
	}, [panelOpen]);

	function getNavItems(useFlex: boolean) {
		const Wrapper = useFlex ? S.BNavItemFlex : S.BNavItem;
		return (
			<>
				{NAV_PATHS.map((element: NavPathType, index: number) => {
					return (
						<Wrapper
							key={index}
							active={
								element.basePath ? location.pathname.includes(element.basePath) : element.path === location.pathname
							}
						>
							<Link to={element.path} onClick={() => (useFlex ? setPanelOpen(false) : {})}>
								<ReactSVG src={element.icon} />
								<span>{element.label}</span>
							</Link>
						</Wrapper>
					);
				})}
			</>
		);
	}

	function getMenu() {
		return (
			<S.MFlex>
				<S.MWrapper>
					<IconButton
						src={ASSETS.menu}
						type={'primary'}
						handlePress={() => setPanelOpen(!panelOpen)}
						dimensions={{ wrapper: 32.5, icon: 19.5 }}
					/>
				</S.MWrapper>
				<S.LWrapper>
					<Link to={URLS.base} onClick={() => setPanelOpen(false)}>
						<ReactSVG src={ASSETS.logo} />
						<span>Helix</span>
					</Link>
				</S.LWrapper>
			</S.MFlex>
		);
	}

	return (
		<>
			<S.Wrapper>
				{getMenu()}
				<S.SEWrapper>
					<S.EWrapper>
						<S.TWrapper>
							<IconButton
								src={themeProvider.current === 'light' ? ASSETS.light : ASSETS.dark}
								type={'primary'}
								handlePress={() => themeProvider.setCurrent(themeProvider.current === 'light' ? 'dark' : 'light')}
								dimensions={{ wrapper: 32.5, icon: 18.5 }}
								tooltip={language.toggleTheme}
								useBottomToolTip
								active={true}
							/>
						</S.TWrapper>
						<S.AWrapper>
							<IconButton
								src={ASSETS.upload}
								type={'primary'}
								handlePress={() => navigate(URLS.upload)}
								dimensions={{ wrapper: 32.5, icon: 18.5 }}
								tooltip={language.upload}
								useBottomToolTip
								active={true}
							/>
						</S.AWrapper>
						<WalletConnect />
					</S.EWrapper>
				</S.SEWrapper>
			</S.Wrapper>
			<S.BWrapper>{getNavItems(false)}</S.BWrapper>
			{panelOpen && (
				<div className={'overlay'}>
					<S.PWrapper>
						<CloseHandler active={panelOpen} disabled={!panelOpen} callback={() => setPanelOpen(false)}>
							<S.PMenu>
								{getMenu()}
								<S.BFlexWrapper>{getNavItems(true)}</S.BFlexWrapper>
							</S.PMenu>
						</CloseHandler>
					</S.PWrapper>
				</div>
			)}
		</>
	);
}
