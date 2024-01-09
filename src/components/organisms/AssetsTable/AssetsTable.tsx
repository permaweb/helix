import React from 'react';
import debounce from 'lodash/debounce';

import { getAssetsByVersion } from 'gql';

import { AssetsGrid } from 'components/organisms/AssetsGrid';
import { CURSORS } from 'helpers/config';
import { AssetGQLResponseType } from 'helpers/types';
import * as windowUtils from 'helpers/window';

import * as S from './styles';
import { IProps } from './types';

export default function AssetsTable(props: IProps) {
	const wrapperRef = React.useRef<HTMLDivElement | null>(null);

	const [assets, setAssets] = React.useState<AssetGQLResponseType | null>(null);
	const [updating, setUpdating] = React.useState<boolean>(false);
	const [wrapperRefVisible, setWrapperRefVisible] = React.useState<boolean>(false);

	const [initialLoadComplete, setInitialLoadComplete] = React.useState(false);

	const fetchAssets = async (cursor = null) => {
		try {
			const assetsFetch = await getAssetsByVersion({ cursor: cursor, owners: props.owners });
			if (assetsFetch && assetsFetch.data) {
				setAssets((prevAssets) => ({
					data: prevAssets ? [...prevAssets.data, ...assetsFetch.data] : assetsFetch.data,
					count: assetsFetch.count,
					nextCursor: assetsFetch.nextCursor,
					previousCursor: assetsFetch.previousCursor,
				}));
			}
		} catch (e: any) {
			console.error(e);
		}
	};

	React.useEffect(() => {
		if (assets && props.owners) setAssets(null);
	}, [props.owners]);

	React.useEffect(() => {
		if (!assets) {
			windowUtils.scrollTo(0, 0, 'smooth');
			fetchAssets().then(() => setInitialLoadComplete(true));
		}
	}, [assets]);

	React.useEffect(() => {
		if (
			initialLoadComplete &&
			!updating &&
			window.innerHeight >= document.body.offsetHeight &&
			assets &&
			assets.nextCursor !== CURSORS.end
		) {
			fetchAssets(assets?.nextCursor);
		}
	}, [initialLoadComplete, updating]);

	React.useEffect(() => {
		(async function () {
			if (wrapperRefVisible && assets && assets.nextCursor && assets.nextCursor !== CURSORS.end) {
				setUpdating(true);
				const assetsFetch = await getAssetsByVersion({ cursor: assets.nextCursor, owners: props.owners });
				setAssets({
					data: [...assets.data, ...assetsFetch.data],
					count: assetsFetch.count,
					nextCursor: assetsFetch.nextCursor,
					previousCursor: assetsFetch.previousCursor,
				});
				setUpdating(false);
				setWrapperRefVisible(false);
			}
		})();
	}, [wrapperRefVisible, assets?.nextCursor]);

	React.useEffect(() => {
		window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
		debouncedHandleScroll();

		return () => {
			window.removeEventListener('scroll', debouncedHandleScroll);
		};
	}, [wrapperRef]);

	const handleScroll = () => {
		if (wrapperRef.current) {
			const wrapperElement = wrapperRef.current.getBoundingClientRect();
			const isVisible = wrapperElement.top < window.innerHeight && wrapperElement.bottom > 200;
			setWrapperRefVisible(isVisible);
		}
	};

	const debouncedHandleScroll = debounce(handleScroll, 500);

	return (
		<S.Wrapper ref={wrapperRef}>
			<AssetsGrid assets={assets ? assets.data : null} updating={updating} />
		</S.Wrapper>
	);
}
