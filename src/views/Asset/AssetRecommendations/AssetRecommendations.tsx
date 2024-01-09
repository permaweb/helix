import React from 'react';
import { Link } from 'react-router-dom';

import { getAssetsByRecommendations } from 'gql';

import { Loader } from 'components/atoms/Loader';
import { CURSORS, URLS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { AssetGQLResponseType, AssetType } from 'helpers/types';
import { formatTime, getCreatorLabel, getRelativeDate } from 'helpers/utils';

import * as S from './styles';
import { IProps } from './types';

export default function AssetRecommendations(props: IProps) {
	const wrapperRef = React.useRef<HTMLDivElement | null>(null);

	const [assets, setAssets] = React.useState<AssetGQLResponseType>(null);
	const [updating, setUpdating] = React.useState<boolean>(false);
	const [wrapperRefVisible, setWrapperRefVisible] = React.useState<boolean>(false);

	React.useEffect(() => {
		(async function () {
			if (props.asset) {
				try {
					const assetsFetch = await getAssetsByRecommendations({ id: props.asset.id, cursor: null });
					if (assetsFetch && assetsFetch.data) setAssets(assetsFetch);
				} catch (e: any) {
					console.error(e);
				}
			}
		})();
	}, [props.asset]);

	React.useEffect(() => {
		(async function () {
			if (wrapperRefVisible && assets && assets.nextCursor && assets.nextCursor !== CURSORS.end) {
				setUpdating(true);
				const assetsFetch = await getAssetsByRecommendations({ id: props.asset.id, cursor: assets.nextCursor });
				setAssets({
					data: [...assets.data, ...assetsFetch.data],
					count: assetsFetch.count,
					nextCursor: assetsFetch.nextCursor,
					previousCursor: assetsFetch.previousCursor,
				});
				setUpdating(false);
			}
		})();
	}, [wrapperRefVisible, assets]);

	React.useEffect(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [wrapperRef, assets]);

	const handleScroll = () => {
		if (wrapperRef.current && assets) {
			const wrapperElement = wrapperRef.current.getBoundingClientRect();
			const isVisible = wrapperElement.bottom >= 0 && wrapperElement.bottom <= window.innerHeight;
			setWrapperRefVisible(isVisible);
		}
	};

	function getAssets() {
		if (!assets) {
			return (
				<S.LoadingWrapper>
					<Loader sm relative />
				</S.LoadingWrapper>
			);
		} else {
			return (
				<>
					{assets.data.map((asset: AssetType, index: number) => (
						<Asset key={index} asset={asset} />
					))}
					{updating && (
						<S.LoadingWrapper>
							<Loader sm relative />
						</S.LoadingWrapper>
					)}
				</>
			);
		}
	}

	return <S.Wrapper ref={wrapperRef}>{getAssets()}</S.Wrapper>;
}

function Asset(props: { asset: AssetType | null }) {
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
							<>
								<Link to={profileRedirect}>{getCreatorLabel(props.asset.creator)}</Link>
								<span>{`${getRelativeDate(props.asset.dateCreated)}`}</span>
							</>
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
