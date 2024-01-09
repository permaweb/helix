import React from 'react';

import { IconButton } from 'components/atoms/IconButton';
import { Loader } from 'components/atoms/Loader';
import { ASSETS } from 'helpers/config';
import { getTxEndpoint } from 'helpers/endpoints';
import { formatTime } from 'helpers/utils';
import { useLanguageProvider } from 'providers/LanguageProvider';

import { IProps } from '../types';

import * as S from './styles';

const AUTO_PLAY = false;

export default function Video(props: IProps) {
	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const videoRef = React.useRef<any>(null);

	const [videoLoaded, setVideoLoaded] = React.useState<boolean>(false);

	const [playing, setPlaying] = React.useState<boolean>(AUTO_PLAY);
	const [volume, setVolume] = React.useState(1);
	const [muted, setMuted] = React.useState<boolean>(false);
	const [inPiPMode, setInPiPMode] = React.useState<boolean>(false);

	const [duration, setDuration] = React.useState(0);
	const [currentTime, setCurrentTime] = React.useState<number>(0);
	const [elapsedTime, setElapsedTime] = React.useState<string>('0:00');
	const [totalTime, setTotalTime] = React.useState<string>('0:00');
	const [bufferProgress, setBufferProgress] = React.useState<number>(0);

	const [tooltipVisible, setTooltipVisible] = React.useState<boolean>(false);
	const [tooltipContent, setTooltipContent] = React.useState<string>('');
	const [tooltipPosition, setTooltipPosition] = React.useState<number>(0);

	React.useEffect(() => {
		if (videoLoaded) {
			const duration = videoRef.current.duration;
			setDuration(duration);
			setTotalTime(formatTime(duration - videoRef.current.currentTime));
		}
	}, [videoLoaded, videoRef.current]);

	React.useEffect(() => {
		const video = videoRef.current;
		video.addEventListener('progress', handleProgress);
		return () => {
			video.removeEventListener('progress', handleProgress);
		};
	}, [videoRef]);

	React.useEffect(() => {
		if (videoRef.current) {
			videoRef.current.muted = muted;
			if (!muted && videoRef.current.volume === 0) {
				setVolume(1);
			}
		}
	}, [muted]);

	const handleProgress = () => {
		const buffer = videoRef.current.buffered;
		const loaded = buffer.length > 0 ? buffer.end(buffer.length - 1) : 0;
		const percent = (loaded / videoRef.current.duration) * 100;
		setBufferProgress(percent);
	};

	const handleHoverOnProgressBar = (event: any) => {
		const progressBar = event.target;
		const rect = progressBar.getBoundingClientRect();
		const offsetX = event.clientX - rect.left;
		const hoverTime = (offsetX / progressBar.offsetWidth) * duration;

		if (hoverTime >= 0) {
			setTooltipContent(formatTime(hoverTime));
			setTooltipPosition(offsetX);
			setTooltipVisible(true);
		}
	};

	const handleMouseOutFromProgressBar = () => {
		setTooltipVisible(false);
	};

	const updateTime = () => {
		if (videoRef.current) {
			const duration = videoRef.current.duration;
			setCurrentTime(videoRef.current.currentTime);
			if (duration && !isNaN(duration) && duration > 0) {
				setElapsedTime(formatTime(videoRef.current.currentTime));
			} else {
				setElapsedTime(formatTime(videoRef.current.currentTime));
				setTotalTime('--:--');
			}
		}
	};

	React.useEffect(() => {
		if (videoRef.current) {
			videoRef.current.volume = volume;
		}
	}, [volume]);

	function togglePlay() {
		if (videoRef.current) {
			if (playing) {
				videoRef.current.pause();
			} else {
				videoRef.current.play();
			}
			setPlaying(!playing);
		}
	}

	function toggleVolume() {
		if (videoRef.current) {
			const muteCheck = !videoRef.current.muted;
			videoRef.current.muted = muteCheck;
			setVolume(muteCheck ? 0 : 1);
			setMuted(muteCheck);
		}
	}

	function toggleFullScreen() {
		if (videoRef.current) {
			if (!document.fullscreenElement) {
				if (videoRef.current.requestFullscreen) {
					videoRef.current.requestFullscreen();
				} else if (videoRef.current.webkitRequestFullscreen) {
					videoRef.current.webkitRequestFullscreen();
				} else if (videoRef.current.msRequestFullscreen) {
					videoRef.current.msRequestFullscreen();
				}
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if ((document as any).webkitExitFullscreen) {
					(document as any).webkitExitFullscreen();
				} else if ((document as any).msExitFullscreen) {
					(document as any).msExitFullscreen();
				}
			}
		}
	}

	async function toggleMiniPlayer() {
		if (videoRef.current) {
			try {
				if (!document.pictureInPictureElement) {
					await videoRef.current.requestPictureInPicture();
					setInPiPMode(true);
				} else {
					await document.exitPictureInPicture();
					setInPiPMode(false);
				}
			} catch (e: any) {
				console.error(e);
			}
		}
	}

	const handleProgressChange = (e: any) => {
		if (videoRef.current) {
			videoRef.current.currentTime = (duration / 100) * e.target.value;
		}
	};

	const handleVolumeChange = (e: any) => {
		setVolume(e.target.value);
		if (parseFloat(e.target.value) <= 0) setMuted(true);
		else setMuted(false);
	};

	const handleLoadedMetadata = () => {
		setVideoLoaded(true);
	};

	return props.asset ? (
		<S.Wrapper onClick={() => (videoLoaded && !inPiPMode ? togglePlay() : {})}>
			{!videoLoaded && (
				<S.VLoader>
					<Loader placeholder />
				</S.VLoader>
			)}
			{/* {inPiPMode && (
				<S.PiPOverlay>
					<span>{language.playingPiP}</span>
				</S.PiPOverlay>
			)} */}
			<S.Video
				ref={videoRef}
				onLoadedMetadata={handleLoadedMetadata}
				loaded={videoLoaded}
				onTimeUpdate={updateTime}
				autoPlay={AUTO_PLAY}
			>
				<source src={getTxEndpoint(props.asset.id)} type={props.asset.contentType} />
			</S.Video>
			{videoLoaded && (
				<S.Controls
					onClick={(e: any) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					<S.ProgressBar
						type={'range'}
						min={'0'}
						max={'100'}
						step={'1'}
						value={((currentTime / duration) * 100).toString()}
						bufferProgress={bufferProgress}
						onChange={handleProgressChange}
						onMouseMove={handleHoverOnProgressBar}
						onMouseOut={handleMouseOutFromProgressBar}
						disabled={false}
					/>

					{tooltipVisible && (
						<S.PTooltip className={'info-text'} style={{ left: `${tooltipPosition}px` }}>
							<span>{tooltipContent}</span>
						</S.PTooltip>
					)}

					<S.Actions>
						<IconButton
							type={'alt1'}
							src={playing ? ASSETS.pause : ASSETS.play}
							handlePress={togglePlay}
							dimensions={{
								icon: 18.5,
								wrapper: 37.5,
							}}
							tooltip={playing ? language.pause : language.play}
						/>
						<IconButton
							type={'alt1'}
							src={muted ? ASSETS.volumeInactive : ASSETS.volumeActive}
							handlePress={toggleVolume}
							dimensions={{
								icon: 18.5,
								wrapper: 37.5,
							}}
							tooltip={muted ? language.unmute : language.mute}
						/>
						<S.VolumeRange
							type={'range'}
							min={'0'}
							max={'1'}
							step={'0.1'}
							value={volume.toString()}
							bufferProgress={0}
							onChange={handleVolumeChange}
							disabled={false}
						/>
						<S.TimeRange>
							<span style={{ minWidth: elapsedTime.length > 5 ? '52.5px' : elapsedTime.length > 4 ? '45px' : '35px' }}>
								{elapsedTime}
							</span>
							<S.TDivider>
								<span>/</span>
							</S.TDivider>
							<span style={{ minWidth: totalTime.length > 5 ? '52.5px' : totalTime.length > 4 ? '45px' : '35px' }}>
								{totalTime}
							</span>
						</S.TimeRange>
						<S.EndActions>
							{'pictureInPictureEnabled' in document && (
								<IconButton
									type={'alt1'}
									src={inPiPMode ? ASSETS.miniPlayerActive : ASSETS.miniPlayerInactive}
									handlePress={toggleMiniPlayer}
									dimensions={{
										icon: 23.5,
										wrapper: 37.5,
									}}
									tooltip={inPiPMode ? language.returnToWindow : language.miniplayer}
								/>
							)}
							<IconButton
								type={'alt1'}
								src={ASSETS.fullScreen}
								handlePress={toggleFullScreen}
								dimensions={{
									icon: 18.5,
									wrapper: 37.5,
								}}
								tooltip={language.fullScreen}
							/>
						</S.EndActions>
					</S.Actions>
				</S.Controls>
			)}
		</S.Wrapper>
	) : null;
}
