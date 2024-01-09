import { Loader } from 'components/atoms/Loader';
import { CONTENT_TYPES } from 'helpers/config';

import * as S from './styles';
import { IProps } from './types';
import { Video } from './Video';

export default function AssetData(props: IProps) {
	function getAsset() {
		if (!props.asset) return <Loader placeholder />;
		switch (props.asset.contentType) {
			case CONTENT_TYPES.mp4:
				return <Video asset={props.asset} />;
			default:
				return null;
		}
	}

	return <S.Wrapper>{getAsset()}</S.Wrapper>;
}
