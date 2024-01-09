import React from 'react';
import { useParams } from 'react-router-dom';

import { getAssetById } from 'gql';

import { Loader } from 'components/atoms/Loader';
import { AddressComments } from 'components/organisms/AddressComments';
import { GATEWAYS } from 'helpers/config';
import { AssetType } from 'helpers/types';
import * as windowUtils from 'helpers/window';

import { AssetData } from './AssetData';
import { AssetInfo } from './AssetInfo';
import { AssetRecommendations } from './AssetRecommendations';
import * as S from './styles';

export default function Asset() {
	const { id } = useParams();

	const [asset, setAsset] = React.useState<AssetType | null>(null);

	React.useEffect(() => {
		(async function () {
			try {
				setAsset(null);
				windowUtils.scrollTo(0, 0, 'smooth');
				const asset = await getAssetById({ id: id, gateway: GATEWAYS.arweave });
				if (asset) {
					setAsset(asset);
				}
			} catch (e: any) {
				console.error(e);
			}
		})();
	}, [id]);

	return asset ? (
		<S.Wrapper className={'max-view-wrapper'}>
			<S.AWrapper>
				<S.ADWrapper>
					<AssetData asset={asset} />
				</S.ADWrapper>
				<S.ATWrapper>
					<AssetInfo asset={asset} />
				</S.ATWrapper>
				<S.ACWrapper>
					<AddressComments address={asset ? asset.id : null} topLevel={true} />
				</S.ACWrapper>
			</S.AWrapper>
			<S.RWrapper>
				<AssetRecommendations asset={asset} />
			</S.RWrapper>
		</S.Wrapper>
	) : (
		<Loader />
	);
}
