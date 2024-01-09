import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getFollowerCount } from 'gql';

import { Avatar } from 'components/atoms/Avatar';
import { Button } from 'components/atoms/Button';
import { Loader } from 'components/atoms/Loader';
import { Notification } from 'components/atoms/Notification';
import { AddressFollow } from 'components/molecules/AddressFollow';
import { AddressShare } from 'components/molecules/AddressShare';
import { AssetInfoLicense } from 'components/molecules/AssetInfoLicense';
import { ASSETS, REDIRECTS, URLS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { StampType } from 'helpers/types';
import { formatAddress, formatDate } from 'helpers/utils';
import { useStamps } from 'hooks/stamps';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';

import * as S from './styles';
import { IProps } from './types';

export default function AssetInfo(props: IProps) {
	const navigate = useNavigate();
	const profileRedirect = props.asset ? URLS.profileChannel(props.asset.creator.walletAddress) : null;

	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const { stampLib, getStampObject, handleStamp, stampDisabled } = useStamps();

	const [stampResponse, setStampResponse] = React.useState<string | null>(null);
	const [stampData, setStampData] = React.useState<StampType | null>({
		total: 0,
		vouched: 0,
		connectedWalletStamped: true,
	});

	const [downloading, setDownloading] = React.useState<boolean>(false);
	const [downloadDisabled, setDownloadDisabled] = React.useState<boolean>(false);

	const [followerCount, setFollowerCount] = React.useState<number | null>(null);

	React.useEffect(() => {
		(async function () {
			if (props.asset) {
				try {
					setFollowerCount(await getFollowerCount({ address: props.asset.creator.walletAddress }));
				} catch (e: any) {
					console.error(e);
					setFollowerCount(0);
				}
			}
		})();
	}, [props.asset]);

	React.useEffect(() => {
		(async function () {
			if (props.asset && stampLib) {
				try {
					setStampData((await getStampObject([props.asset.id]))[props.asset.id]);
				} catch (e: any) {
					console.error(e);
				}
			}
		})();
	}, [props.asset, stampLib]);

	function getCreatorLabel() {
		if (!props.asset) return null;
		if (props.asset.creator.handle) return props.asset.creator.handle;
		return formatAddress(props.asset.creator.walletAddress, false);
	}

	async function handleStampAction() {
		if (props.asset) {
			const resultMessage = await handleStamp(props.asset.id);
			if (resultMessage && stampData) {
				setStampData({
					total: stampData.total + 1,
					vouched: stampData.vouched,
					connectedWalletStamped: stampData.connectedWalletStamped,
				});
				setStampResponse(resultMessage);
			}
		}
	}

	async function handleDownloadAction() {
		if (props.asset) {
			setDownloading(true);
			setDownloadDisabled(true);
			try {
				const response = await fetch(getTxEndpoint(props.asset.id));
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				const data = await response.blob();
				const url = window.URL.createObjectURL(data);
				const a = document.createElement('a');
				a.href = url;
				a.download = props.asset.title;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			} catch (e: any) {
				console.error('Download failed:', e);
			}
			setDownloading(false);
			setDownloadDisabled(false);
		}
	}

	return props.asset ? (
		<>
			<S.Wrapper>
				<S.TWrapper>
					<h1>{props.asset.title}</h1>
					<span>{`${formatDate(props.asset.dateCreated, 'epoch')}`}</span>
				</S.TWrapper>
				<S.AWrapper>
					<S.DHeaderWrapper>
						<Avatar
							owner={props.asset.creator}
							dimensions={{ wrapper: 35, icon: 23.5 }}
							callback={() => navigate(profileRedirect)}
						/>
						<S.DHeader>
							<Link to={profileRedirect}>
								<p>{getCreatorLabel()}</p>
							</Link>
							<span>
								{followerCount !== null
									? `${followerCount} ${
											followerCount === 1 ? language.follower.toLowerCase() : language.followers.toLowerCase()
									  }`
									: `${language.fetching}...`}
							</span>
						</S.DHeader>
						<AddressFollow address={props.asset.creator.walletAddress} />
					</S.DHeaderWrapper>
					<S.DActions>
						<Button
							type={'primary'}
							label={stampData.total.toString()}
							handlePress={handleStampAction}
							disabled={!stampData || stampDisabled || stampData.connectedWalletStamped}
							icon={ASSETS.stamp}
							iconLeftAlign
							noMinWidth
							tooltip={
								arProvider.walletAddress
									? stampData.connectedWalletStamped
										? language.stamped
										: null
									: language.connectWallet
							}
							useBottomToolTip
						/>
						<Button
							type={'primary'}
							label={language.viewOnBazar}
							handlePress={() => window.open(REDIRECTS.bazar.asset(props.asset.id), '_blank')}
							disabled={false}
							icon={ASSETS.bazar}
							noMinWidth
						/>
						<AddressShare type={'primary'} address={props.asset.id} />
						<Button
							type={'primary'}
							label={downloading ? `${language.downloading}...` : language.download}
							handlePress={handleDownloadAction}
							disabled={downloadDisabled}
							icon={ASSETS.download}
							noMinWidth
						/>
					</S.DActions>
				</S.AWrapper>
				<S.DWrapper>
					<p>{props.asset.description}</p>
				</S.DWrapper>
				{props.asset.topics.length > 0 && (
					<S.TOWrapper>
						{props.asset.topics.map((topic: string, index: number) => {
							return (
								<S.Topic key={index}>
									<span>{topic.toUpperCase()}</span>
								</S.Topic>
							);
						})}
					</S.TOWrapper>
				)}
				<S.LWrapper>
					<AssetInfoLicense asset={props.asset} />
				</S.LWrapper>
			</S.Wrapper>
			{stampResponse && <Notification message={stampResponse} callback={() => setStampResponse(null)} />}
		</>
	) : (
		<Loader sm relative />
	);
}
