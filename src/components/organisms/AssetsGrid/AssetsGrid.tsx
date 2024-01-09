import { Link, useNavigate } from 'react-router-dom';

import { Avatar } from 'components/atoms/Avatar';
import { Loader } from 'components/atoms/Loader';
import { PAGINATORS, URLS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { AssetType } from 'helpers/types';
import { formatTime, getCreatorLabel, getRelativeDate } from 'helpers/utils';
import { useLanguageProvider } from 'providers/LanguageProvider';

import * as S from './styles';
import { IProps } from './types';

export default function AssetsGrid(props: IProps) {
	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	function getAssets() {
		if (props.assets) {
			return props.assets.length ? (
				<>
					{props.assets.map((asset: AssetType, index: number) => (
						<Asset key={index} asset={asset} />
					))}
				</>
			) : (
				<S.EWrapper>
					<span>{language.noAssets}</span>
				</S.EWrapper>
			);
		} else {
			return getLoadingElements();
		}
	}

	function getLoadingElements() {
		const keys = Array.from({ length: PAGINATORS.version }, (_, i) => i + 1);
		const elements = keys.map((index) => <Asset key={index} asset={null} />);
		return <>{elements}</>;
	}

	return (
		<S.Wrapper>
			{getAssets()}
			{props.updating && getLoadingElements()}
		</S.Wrapper>
	);
}

function Asset(props: { asset: AssetType | null }) {
	const navigate = useNavigate();

	const assetRedirect = props.asset ? `${URLS.asset}${props.asset.id}` : null;
	const profileRedirect = props.asset ? URLS.profileChannel(props.asset.creator.walletAddress) : null;

	return (
		<S.AWrapper>
			{props.asset && (
				<S.AContentLink>
					<Link to={assetRedirect} />
				</S.AContentLink>
			)}
			<S.AContent>
				{props.asset ? (
					<>
						<img src={getTxEndpoint(props.asset.thumbnail)} />
						{props.asset.contentLength && (
							<S.VLength className={'info-text'}>
								<span>{formatTime(props.asset.contentLength)}</span>
							</S.VLength>
						)}
					</>
				) : (
					<Loader placeholder />
				)}
			</S.AContent>
			<S.AInfo>
				<Avatar
					owner={props.asset ? props.asset.creator : null}
					dimensions={{ wrapper: 35, icon: 23.5 }}
					callback={() => navigate(profileRedirect)}
				/>
				<S.AInfo1>
					{props.asset ? (
						<Link to={assetRedirect}>
							<p>{props.asset.title}</p>
						</Link>
					) : (
						<S.ATLoader>
							<Loader placeholder />
						</S.ATLoader>
					)}
					<S.AInfoFlex>
						{props.asset ? (
							<span>
								<Link to={profileRedirect}>{getCreatorLabel(props.asset.creator)}</Link>
								{` · ${getRelativeDate(props.asset.dateCreated)}`}
							</span>
						) : (
							<S.AILoader>
								<Loader placeholder />
							</S.AILoader>
						)}
					</S.AInfoFlex>
				</S.AInfo1>
			</S.AInfo>
		</S.AWrapper>
	);
}
