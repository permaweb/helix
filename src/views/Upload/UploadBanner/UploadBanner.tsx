import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { IconButton } from 'components/atoms/IconButton';
import { Modal } from 'components/molecules/Modal';
import { ALLOWED_BANNER_TYPES, ASSETS } from 'helpers/config';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';

import * as S from './styles';

export default function UploadBanner() {
	const dispatch = useDispatch();

	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const fileInputRef = React.useRef<any>(null);

	const [activeBannerIndex, setActiveBannerIndex] = React.useState<number | null>(null);
	const [banners, setBanners] = React.useState([]);
	const [showTooltip, setShowTooltip] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (banners.length && activeBannerIndex !== null) {
			dispatch(uploadActions.setUpload([{ field: 'banner', data: banners[activeBannerIndex] }]));
		}
	}, [activeBannerIndex, banners]);

	const handleThumbnailClick = (index: number) => {
		setActiveBannerIndex(index);
	};

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length) {
			const file = e.target.files[0];
			if (file.type.startsWith('image/')) {
				const reader = new FileReader();

				reader.onload = (event: ProgressEvent<FileReader>) => {
					if (event.target?.result) {
						const updatedThumbnails = [...banners, event.target.result];
						setBanners(updatedThumbnails);
						setActiveBannerIndex(updatedThumbnails.length - 1);
					}
				};

				reader.readAsDataURL(file);
			}
		}
	}

	return (
		<>
			<S.Wrapper>
				<S.Header>
					<p>{language.banner}</p>
					<IconButton
						type={'primary'}
						active={false}
						src={ASSETS.info}
						handlePress={() => setShowTooltip(!showTooltip)}
						dimensions={{ wrapper: 22.5, icon: 13.5 }}
					/>
				</S.Header>
				<S.Body>
					<S.Select disabled={uploadReducer.uploadActive} onClick={() => fileInputRef.current.click()}>
						<ReactSVG src={ASSETS.image} />
						<span>{language.uploadBanner}</span>
					</S.Select>
					{banners && (
						<>
							{banners.map((banner: any, index: number) => {
								return (
									<S.TWrapper
										key={index}
										active={index === activeBannerIndex}
										onClick={() => handleThumbnailClick(index)}
										disabled={uploadReducer.uploadActive}
									>
										<img src={banner} />
									</S.TWrapper>
								);
							})}
						</>
					)}
					<input
						ref={fileInputRef}
						type={'file'}
						onChange={handleFileChange}
						disabled={false}
						accept={ALLOWED_BANNER_TYPES}
					/>
				</S.Body>
			</S.Wrapper>
			{showTooltip && (
				<Modal header={language.banner} handleClose={() => setShowTooltip(false)}>
					<S.Tooltip>
						<p>{language.bannerInfo}</p>
					</S.Tooltip>
				</Modal>
			)}
		</>
	);
}
