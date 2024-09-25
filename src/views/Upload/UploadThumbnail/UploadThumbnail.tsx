import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { Button } from 'components/atoms/Button';
import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
import { Modal } from 'components/molecules/Modal';
import { ALLOWED_THUMBNAIL_TYPES, ASSETS } from 'helpers/config';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';

import * as S from './styles';

export default function UploadThumbnail() {
	const dispatch = useDispatch();

	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const fileInputRef = React.useRef<any>(null);
	const videoRef = React.useRef(null);

	const [generatingThumbnails, setGeneratingThumbnails] = React.useState<boolean>(false);
	const [activeThumbnailIndex, setActiveThumbnailIndex] = React.useState<number | null>(null);
	const [thumbnails, setThumbnails] = React.useState([]);
	const [showTooltip, setShowTooltip] = React.useState<boolean>(false);

	const [showPlayer, setShowPlayer] = React.useState<boolean>(false);
	const [videoSrc, setVideoSrc] = React.useState('');

	React.useEffect(() => {
		if (thumbnails.length && activeThumbnailIndex !== null) {
			dispatch(uploadActions.setUpload([{ field: 'thumbnail', data: thumbnails[activeThumbnailIndex] }]));
		}
	}, [activeThumbnailIndex, thumbnails]);

	React.useEffect(() => {
		if (showPlayer && uploadReducer.data.content) {
			const url = URL.createObjectURL(uploadReducer.data.content);
			setVideoSrc(url);
		}
	}, [showPlayer, uploadReducer.data.content]);

	React.useEffect(() => {
		if (uploadReducer.data.content && uploadReducer.data.contentType.includes('video')) {
			setThumbnails([]);
			setGeneratingThumbnails(true);
			const url = URL.createObjectURL(uploadReducer.data.content);
			const video = document.createElement('video');
			video.src = url;

			let capturedThumbnails = [];
			let times = [];

			const captureThumbnail = (time: any) => {
				if (time !== undefined) {
					video.currentTime = time;
				}
			};

			video.addEventListener('loadedmetadata', function () {
				const duration = video.duration;
				const middleTime = duration / 2;
				times = [2, duration - 2, middleTime];
				captureThumbnail(times.shift());
			});

			video.addEventListener('seeked', function () {
				const canvas = document.createElement('canvas');
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

				const thumbnail = canvas.toDataURL('image/jpeg');
				capturedThumbnails.push(thumbnail);

				if (times.length > 0) {
					captureThumbnail(times.shift());
				} else {
					setThumbnails(capturedThumbnails);
					setActiveThumbnailIndex(0);
					setGeneratingThumbnails(false);
					URL.revokeObjectURL(url);
				}
			});
		} else {
			setThumbnails([]);
			setActiveThumbnailIndex(null);
		}
	}, [uploadReducer.data.content, uploadReducer.data.contentType]);

	const handleThumbnailClick = (index: number) => {
		setActiveThumbnailIndex(index);
	};

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length) {
			const file = e.target.files[0];
			if (file.type.startsWith('image/')) {
				const reader = new FileReader();

				reader.onload = (event: ProgressEvent<FileReader>) => {
					if (event.target?.result) {
						const updatedThumbnails = [...thumbnails, event.target.result];
						setThumbnails(updatedThumbnails);
						setActiveThumbnailIndex(updatedThumbnails.length - 1);
					}
				};

				reader.readAsDataURL(file);
			}
		}
	}

	const handleCreateThumbnail = () => {
		if (videoRef.current) {
			const video = videoRef.current;
			const canvas = document.createElement('canvas');
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			const thumbnail = canvas.toDataURL('image/jpeg');

			const updatedThumbnails = [...thumbnails, thumbnail];
			setThumbnails(updatedThumbnails);
			setActiveThumbnailIndex(updatedThumbnails.length - 1);

			setShowPlayer(false);
		}
	};

	const handleRemoveThumbnail = (index: number) => {
		const updatedThumbnails = thumbnails.filter((_, i) => i !== index);
		setThumbnails(updatedThumbnails);
		setActiveThumbnailIndex(updatedThumbnails.length - 1);
	};

	return (
		<>
			<S.Wrapper>
				<S.Header>
					<p>{language.thumbnail}</p>
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
						<span>{language.uploadThumbnail}</span>
					</S.Select>
					{generatingThumbnails && (
						<>
							{Array.from({ length: 3 }, (_, i) => i + 1).map((index) => (
								<S.TWrapper key={index} active={false}>
									<Loader placeholder />
								</S.TWrapper>
							))}
						</>
					)}
					{thumbnails && (
						<>
							{thumbnails.map((thumbnail: any, index: number) => {
								return (
									<S.TWrapper
										key={index}
										active={index === activeThumbnailIndex}
										onClick={(e: any) => {
											e.stopPropagation();
											handleThumbnailClick(index);
										}}
										disabled={uploadReducer.uploadActive}
									>
										<img src={thumbnail} />
										<S.TAction>
											<IconButton
												type={'primary'}
												src={ASSETS.close}
												handlePress={() => handleRemoveThumbnail(index)}
												dimensions={{ wrapper: 21.5, icon: 8.5 }}
											/>
										</S.TAction>
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
						accept={ALLOWED_THUMBNAIL_TYPES}
					/>
				</S.Body>
			</S.Wrapper>
			{showPlayer && uploadReducer.data.content && (
				<Modal header={language.useScreenshot} handleClose={() => setShowPlayer(false)}>
					<S.MWrapper>
						<video ref={videoRef} src={videoSrc} controls autoPlay />
						<S.MInfo>
							<span>{language.uploadThumbnailInfo}</span>
						</S.MInfo>
						<S.MActions>
							<Button type={'primary'} label={language.cancel} handlePress={() => setShowPlayer(false)} />
							<Button type={'alt1'} label={language.upload} handlePress={handleCreateThumbnail} />
						</S.MActions>
					</S.MWrapper>
				</Modal>
			)}
			{showTooltip && (
				<Modal header={language.thumbnail} handleClose={() => setShowTooltip(false)}>
					<S.Tooltip>
						<p>{language.thumbnailInfo}</p>
					</S.Tooltip>
				</Modal>
			)}
		</>
	);
}
