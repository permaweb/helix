import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { Button } from 'components/atoms/Button';
import { TurboBalanceFund } from 'components/molecules/TurboBalanceFund';
import { ALLOWED_VIDEO_TYPES, ALLOWED_VIDEO_TYPES_DISPLAY, ASSETS } from 'helpers/config';
import { getTurboCostWincEndpoint } from 'helpers/endpoints';
import { formatTime, formatTurboAmount, getARAmountFromWinc, getByteSize, getTurboBalance } from 'helpers/utils';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';

import * as S from './styles';

export default function UploadAsset() {
	const dispatch = useDispatch();

	const arProvider = useArweaveProvider();

	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const fileInputRef = React.useRef<any>(null);

	const [contentLength, setContentLength] = React.useState<number | null>(null);
	const [calculatingCost, setCalculatingCost] = React.useState<boolean>(false);

	const [showFund, setShowFund] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (contentLength) {
			dispatch(uploadActions.setUpload([{ field: 'contentLength', data: contentLength }]));
		}
	}, [contentLength]);

	React.useEffect(() => {
		(async function () {
			if (uploadReducer.data.content && arProvider.wallet) {
				setCalculatingCost(true);
				try {
					const turboCostResponse = await fetch(getTurboCostWincEndpoint(uploadReducer.data.content.size));
					if (turboCostResponse.ok) {
						const winc = (await turboCostResponse.json()).winc;
						dispatch(uploadActions.setUploadCost(getARAmountFromWinc(winc)));
					}
				} catch (e: any) {
					console.error(e);
				}
				setCalculatingCost(false);
			}
		})();
	}, [uploadReducer.data.content, arProvider.wallet]);

	function handleFileChange(e: any) {
		if (e.target.files && e.target.files.length) {
			const file = e.target.files[0];
			dispatch(
				uploadActions.setUpload([
					{
						field: 'content',
						data: file,
					},
					{
						field: 'contentType',
						data: file.type,
					},
				])
			);

			if (file.type.includes('video')) {
				const url = URL.createObjectURL(file);
				const video = document.createElement('video');
				video.src = url;

				video.addEventListener('loadedmetadata', function () {
					setContentLength(video.duration);
					URL.revokeObjectURL(url);
				});
			}
		}
	}

	function getUploadMessage() {
		if (
			arProvider.turboBalance !== null &&
			typeof arProvider.turboBalance === 'number' &&
			uploadReducer.uploadCost &&
			arProvider.turboBalance < uploadReducer.uploadCost
		) {
			return (
				<S.BalanceWarning>
					<span>{language.insufficientBalance}</span>
				</S.BalanceWarning>
			);
		}
		return null;
	}

	function getFileWrapper() {
		if (uploadReducer.data.content) {
			return (
				<>
					<S.FWrapper>
						<S.FContainer className={'border-wrapper-alt1'}>
							<span>{uploadReducer.uploadActive ? `${language.uploading}...` : `${language.uploadStepsInfo}...`}</span>
						</S.FContainer>
						<S.FInfoWrapper>
							<S.FInfoLine>
								<span>{language.size}</span>
								<p>{getByteSize(uploadReducer.data.content.size)}</p>
							</S.FInfoLine>
							<S.FInfoLine>
								<span>{language.length}</span>
								<p>{uploadReducer.data.contentLength ? formatTime(uploadReducer.data.contentLength) : `-`}</p>
							</S.FInfoLine>
							{arProvider.wallet && (
								<S.CostWrapper>
									<S.FInfoLine>
										<span>{language.turboUploadCost}</span>
										<p>
											{calculatingCost
												? `${language.calculating}...`
												: formatTurboAmount(uploadReducer.uploadCost ? uploadReducer.uploadCost : 0)}
										</p>
									</S.FInfoLine>
									<S.FInfoLine>
										<S.FInfoFlex>
											<span>{language.yourBalance}</span>
											{arProvider.turboBalance === null && (
												<Button
													type={'alt2'}
													label={`(${language.show})`}
													handlePress={() => arProvider.getTurboBalance()}
													disabled={arProvider.turboBalance !== null}
													height={22.5}
													noMinWidth
												/>
											)}
											<Button
												type={'alt2'}
												label={language.fund}
												handlePress={() => setShowFund(true)}
												height={22.5}
												noMinWidth
											/>
										</S.FInfoFlex>
										<p>{getTurboBalance(arProvider.turboBalance)}</p>
									</S.FInfoLine>
									{getUploadMessage()}
								</S.CostWrapper>
							)}
						</S.FInfoWrapper>
					</S.FWrapper>
					<S.FName>
						<span>{language.fileName}</span>
						<p>{uploadReducer.data.content.name}</p>
					</S.FName>
				</>
			);
		} else {
			return (
				<S.EWrapper>
					<S.EIcon>
						<ReactSVG src={ASSETS.upload} />
					</S.EIcon>
					<S.EInfo>
						<p>{language.selectAFile}</p>
						<span>
							{language.supportedFileTypes}{' '}
							{ALLOWED_VIDEO_TYPES_DISPLAY.map(
								(type: string, index: number) =>
									`${type}${index === ALLOWED_VIDEO_TYPES_DISPLAY.length - 1 ? '' : ', '}`
							)}
						</span>
					</S.EInfo>
					<Button
						type={'alt1'}
						label={language.select}
						handlePress={() => fileInputRef.current.click()}
						disabled={uploadReducer.uploadActive}
					/>
				</S.EWrapper>
			);
		}
	}

	return (
		<>
			<S.Wrapper>
				<S.Header>
					<h4>{language.uploadAFile}</h4>
					<Button
						type={'primary'}
						label={language.select}
						handlePress={() => fileInputRef.current.click()}
						disabled={uploadReducer.uploadActive}
					/>
				</S.Header>
				<S.Body>{getFileWrapper()}</S.Body>
				<input
					ref={fileInputRef}
					type={'file'}
					onChange={handleFileChange}
					disabled={false}
					accept={ALLOWED_VIDEO_TYPES}
				/>
			</S.Wrapper>
			{showFund && <TurboBalanceFund handleClose={() => setShowFund(false)} />}
		</>
	);
}
