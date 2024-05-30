import React from 'react';
import { randomBytes } from 'crypto-browserify';

import Arweave from 'arweave';
import { bufferTob64Url } from 'arweave/node/lib/utils.js';
import { ArconnectSigner } from 'arbundles';
import { Othent } from 'permaweb-sdk/dist/helpers/wallet';

import { getProfile } from 'api';

import { Modal } from 'components/molecules/Modal';
import { API_CONFIG, AR_WALLETS, GATEWAYS, WALLET_PERMISSIONS } from 'helpers/config';
import { getARBalanceEndpoint, getTurboBalanceEndpoint } from 'helpers/endpoints';
import { ProfileHeaderType, WalletEnum } from 'helpers/types';
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
	profile: ProfileHeaderType;
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
	const [profile, setProfile] = React.useState<ProfileHeaderType | null>(null);

	React.useEffect(() => {
		(async function () {
			await handleWallet();
		})();
	}, []);

	React.useEffect(() => {
		handleWallet();

		window.addEventListener('arweaveWalletLoaded', handleWallet);

		return () => {
			window.removeEventListener('arweaveWalletLoaded', handleWallet);
		};
	}, [walletType]);

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
					setProfile(await getProfile({ address: walletAddress }));
				} catch (e: any) {
					console.error(e);
				}
			}
		})();
	}, [wallet, walletAddress, walletType]);

	async function handleWallet() {
		if (localStorage.getItem('walletType')) {
			try {
				await handleConnect(localStorage.getItem('walletType') as any);
			} catch (e: any) {
				console.error(e);
			}
		}
	}

	async function handleConnect(walletType: WalletEnum.arConnect | WalletEnum.othent) {
		let walletObj: any = null;
		switch (walletType) {
			case WalletEnum.arConnect:
				handleArConnect();
				break;
			case WalletEnum.othent:
				handleOthent();
				break;
			default:
				if (window.arweaveWallet || walletType === WalletEnum.arConnect) {
					handleArConnect();
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
					console.error(e);
				}
			}
		}
	}

	async function handleOthent() {
		Othent.init();
		await window.arweaveWallet.connect(WALLET_PERMISSIONS as any);
		setWallet(window.arweaveWallet);
		setWalletAddress(Othent.getUserInfo().walletAddress);
		setWalletType(WalletEnum.othent);
		localStorage.setItem('walletType', WalletEnum.othent);
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
		if (wallet && walletType) {
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
