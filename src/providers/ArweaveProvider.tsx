import React from 'react';
import { randomBytes } from 'crypto-browserify';

import Arweave from 'arweave';
import { bufferTob64Url } from 'arweave/node/lib/utils.js';
import { ArweaveWebWallet } from 'arweave-wallet-connector';
import { ArconnectSigner } from 'arbundles';
import { Othent } from 'permaweb-sdk/dist/helpers/wallet';

import { getCurrentProfile } from 'gql';

import { Modal } from 'components/molecules/Modal';
import { API_CONFIG, APP, AR_WALLETS, ASSETS, GATEWAYS, WALLET_PERMISSIONS } from 'helpers/config';
import { getARBalanceEndpoint, getTurboBalanceEndpoint } from 'helpers/endpoints';
import { ProfileType, WalletEnum } from 'helpers/types';
import { getARAmountFromWinc } from 'helpers/utils';
import { useLanguageProvider } from 'providers/LanguageProvider';

import * as S from './styles';

interface ArweaveContextState {
	wallets: { type: WalletEnum; logo: string }[];
	wallet: any;
	walletAddress: string | null;
	walletType: WalletEnum | null;
	availableBalance: number | null;
	handleConnect: any;
	handleDisconnect: () => void;
	walletModalVisible: boolean;
	setWalletModalVisible: (open: boolean) => void;
	profile: any;
	turboBalance: number | string | null;
	getTurboBalance: () => void;
}

interface ArweaveProviderProps {
	children: React.ReactNode;
}

const DEFAULT_CONTEXT = {
	wallets: [],
	wallet: null,
	walletAddress: null,
	walletType: null,
	availableBalance: null,
	handleConnect() {},
	handleDisconnect() {},
	walletModalVisible: false,
	setWalletModalVisible(_open: boolean) {},
	profile: null,
	turboBalance: null,
	getTurboBalance() {},
};

const ARContext = React.createContext<ArweaveContextState>(DEFAULT_CONTEXT);

export function useArweaveProvider(): ArweaveContextState {
	return React.useContext(ARContext);
}

function WalletList(props: { handleConnect: any }) {
	return (
		<S.WalletListContainer>
			{AR_WALLETS.map((wallet: any, index: number) => (
				<S.WalletListItem key={index} onClick={() => props.handleConnect(wallet.type)}>
					<img src={`${wallet.logo}`} alt={''} />
					<span>{wallet.type.charAt(0).toUpperCase() + wallet.type.slice(1)}</span>
				</S.WalletListItem>
			))}
		</S.WalletListContainer>
	);
}

export function ArweaveProvider(props: ArweaveProviderProps) {
	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const wallets = AR_WALLETS;

	const [wallet, setWallet] = React.useState<any>(null);
	const [walletType, setWalletType] = React.useState<WalletEnum | null>(null);
	const [walletModalVisible, setWalletModalVisible] = React.useState<boolean>(false);
	const [walletAddress, setWalletAddress] = React.useState<string | null>(null);
	const [availableBalance, setAvailableBalance] = React.useState<number | null>(null);
	const [turboBalance, setTurboBalance] = React.useState<number | string | null>(null);
	const [profile, setProfile] = React.useState<ProfileType | null>(null);

	React.useEffect(() => {
		(async function () {
			if (localStorage.getItem('walletType')) {
				try {
					await handleConnect(localStorage.getItem('walletType') as any);
				} catch (e: any) {
					console.error(e);
				}
			}
		})();
	}, []);

	React.useEffect(() => {
		(async function () {
			if (walletAddress) {
				try {
					setAvailableBalance(await getARBalance(walletAddress));
				} catch (e: any) {
					console.error(e);
				}
			}
		})();
	}, [walletAddress]);

	React.useEffect(() => {
		(async function () {
			if (wallet && walletAddress) {
				try {
					setProfile(await getCurrentProfile({ address: walletAddress }));
				} catch (e: any) {
					console.error(e);
				}
			}
		})();
	}, [wallet, walletAddress, walletType]);

	async function handleConnect(walletType: WalletEnum.arConnect | WalletEnum.othent | WalletEnum.arweaveApp) {
		let walletObj: any = null;
		switch (walletType) {
			case WalletEnum.arConnect:
				handleArConnect();
				break;
			case WalletEnum.othent:
				handleOthent();
				break;
			case WalletEnum.arweaveApp:
				handleArweaveApp();
				break;
			default:
				if (window.arweaveWallet || walletType === WalletEnum.arConnect) {
					handleArConnect();
					break;
				} else {
					handleArweaveApp();
					break;
				}
		}
		setWalletModalVisible(false);
		return walletObj;
	}

	async function handleArConnect() {
		if (!walletAddress) {
			if (window.arweaveWallet) {
				try {
					await global.window?.arweaveWallet?.connect(WALLET_PERMISSIONS as any);
					setWalletAddress(await global.window.arweaveWallet.getActiveAddress());
					setWallet(window.arweaveWallet);
					setWalletType(WalletEnum.arConnect);
					setWalletModalVisible(false);
					localStorage.setItem('walletType', WalletEnum.arConnect);
				} catch (e: any) {
					alert(e);
				}
			} else {
				alert(language.connectorNotFound);
			}
		}
	}

	async function handleOthent() {
		Othent.init();
		// @ts-ignore -- othent ignores permissions, so no point passing in
		await window.arweaveWallet.connect();
		setWallet(window.arweaveWallet);
		setWalletAddress(Othent.getUserInfo().walletAddress);
		setWalletType(WalletEnum.othent);
		localStorage.setItem('walletType', WalletEnum.othent);
	}

	async function handleArweaveApp() {
		const wallet = new ArweaveWebWallet({
			name: APP.name,
			logo: ASSETS.wallets.arweaveApp,
		});
		wallet.setUrl(WalletEnum.arweaveApp);
		await wallet.connect();
		wallet.on('disconnect', () => {
			handleDisconnect();
		});
		setWallet(wallet);
		setWalletType(WalletEnum.arweaveApp);
		localStorage.setItem('walletType', WalletEnum.arweaveApp);
	}

	async function handleDisconnect() {
		await global.window?.arweaveWallet?.disconnect();
		setWallet(null);
		setWalletAddress(null);
		setProfile(null);
		if (localStorage.getItem('walletType')) localStorage.removeItem('walletType');
	}

	async function getARBalance(walletAddress: string) {
		const rawBalance = await fetch(getARBalanceEndpoint(walletAddress));
		const jsonBalance = await rawBalance.json();
		return jsonBalance / 1e12;
	}

	async function getTurboBalance() {
		if (wallet) {
			try {
				setTurboBalance(`${language.loading}...`);
				const arweave = Arweave.init({
					host: GATEWAYS.arweave,
					protocol: API_CONFIG.protocol,
					port: API_CONFIG.port,
					timeout: API_CONFIG.timeout,
					logging: API_CONFIG.logging,
				});

				const publicKey = await wallet.getActivePublicKey();
				const nonce = randomBytes(16).toString('hex');
				const buffer = Buffer.from(nonce);

				const signer = new ArconnectSigner(wallet, arweave as any);
				const signature = await signer.sign(buffer);
				const b64UrlSignature = bufferTob64Url(Buffer.from(signature));

				const result = await fetch(getTurboBalanceEndpoint(), {
					headers: {
						'x-nonce': nonce,
						'x-public-key': publicKey,
						'x-signature': b64UrlSignature,
					},
				});

				if (result.ok) {
					setTurboBalance(getARAmountFromWinc(Number((await result.json()).winc)));
				} else {
					setTurboBalance(0);
				}
			} catch (e: any) {
				console.error(e);
				setTurboBalance(null);
			}
		}
	}

	return (
		<>
			{walletModalVisible && (
				<Modal header={language.connect} handleClose={() => setWalletModalVisible(false)}>
					<WalletList handleConnect={handleConnect} />
				</Modal>
			)}
			<ARContext.Provider
				value={{
					wallet,
					walletAddress,
					walletType,
					availableBalance,
					handleConnect,
					handleDisconnect,
					wallets,
					walletModalVisible,
					setWalletModalVisible,
					profile,
					turboBalance: turboBalance,
					getTurboBalance: getTurboBalance,
				}}
			>
				{props.children}
			</ARContext.Provider>
		</>
	);
}
