import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'components/atoms/Button';
import { MAX_COVER_IMAGE_SIZE, MAX_THUMBNAIL_IMAGE_SIZE, MAX_UPLOAD_SIZE, UPLOAD_STEPS } from 'helpers/config';
import { UploadStepType } from 'helpers/types';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';

import { UploadBanner } from '../UploadBanner';
import { UploadThumbnail } from '../UploadThumbnail';
import { uploadChecksPassed } from '..';

import * as S from './styles';
import { IProps } from './types';
import { UploadStepsChecks } from './UploadStepsChecks';
import { UploadStepsDetails } from './UploadStepsDetails';
import { UploadStepsLicense } from './UploadStepsLicense';
import { UploadStepsProgress } from './UploadStepsProgress';

export default function UploadSteps(props: IProps) {
	const dispatch = useDispatch();

	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const arProvider = useArweaveProvider();

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const scrollRef = React.useRef(null);

	function getCurrentStepComponent() {
		switch (uploadReducer.currentStep) {
			case 'details':
				return <UploadStepsDetails />;
			case 'license':
				return <UploadStepsLicense />;
			case 'checks':
				return <UploadStepsChecks />;
			default:
				return null;
		}
	}

	function handleScroll() {
		if (scrollRef.current) {
			setTimeout(function () {
				scrollRef.current.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}, 1);
		}
	}

	function handleNextStep() {
		const currentIndex = UPLOAD_STEPS.indexOf(uploadReducer.currentStep);
		if (currentIndex < UPLOAD_STEPS.length - 1) {
			const nextStep = UPLOAD_STEPS[currentIndex + 1] as UploadStepType;
			dispatch(uploadActions.setStepDetails(nextStep));
			handleScroll();
		}
	}

	function handleBackStep() {
		const currentIndex = UPLOAD_STEPS.indexOf(uploadReducer.currentStep);
		if (currentIndex > 0) {
			const previousStep = UPLOAD_STEPS[currentIndex - 1] as UploadStepType;
			dispatch(uploadActions.setStepDetails(previousStep));
			handleScroll();
		}
	}

	function getNextAction() {
		if (uploadReducer.currentStep === 'checks') {
			return (
				<Button
					type={'alt1'}
					label={language.upload}
					handlePress={props.handleUpload}
					disabled={
						!uploadChecksPassed(arProvider, uploadReducer) || uploadReducer.uploadActive || uploadReducer.uploadDisabled
					}
					noMinWidth
				/>
			);
		} else {
			return (
				<Button
					type={'alt1'}
					label={language.next}
					handlePress={handleNextStep}
					disabled={uploadReducer.nextStepDisabled || uploadReducer.uploadActive}
					noMinWidth
				/>
			);
		}
	}

	function getBalanceMessage() {
		if (arProvider.turboBalance === null) return null;
		else {
			if (
				typeof arProvider.turboBalance === 'number' &&
				uploadReducer.uploadCost &&
				arProvider.turboBalance < uploadReducer.uploadCost
			) {
				return <span>{language.insufficientBalance}</span>;
			}
		}
	}

	function getImageSizeMessage() {
		if (!uploadReducer.data.banner && !uploadReducer.data.thumbnail) return null;

		if (
			(uploadReducer.data.banner && (uploadReducer.data.banner.length * 3) / 4 > MAX_COVER_IMAGE_SIZE) ||
			(uploadReducer.data.thumbnail && (uploadReducer.data.thumbnail.length * 3) / 4 > MAX_THUMBNAIL_IMAGE_SIZE)
		)
			return <span>Thumbnail / Banner exceeds max size of 100KB</span>;
		return null;
	}

	function getDataSizeMessage() {
		for (const element of uploadReducer.data.contentList) {
			if (element.file.size > MAX_UPLOAD_SIZE) return <span>{language.fileExceedsLimit}</span>;
		}
		return null;
	}

	return (
		<S.Wrapper ref={scrollRef}>
			<S.PWrapper>
				<UploadStepsProgress />
			</S.PWrapper>
			<S.SWrapper>{getCurrentStepComponent()}</S.SWrapper>
			{uploadReducer.uploadType === 'collection' && (
				<>
					<UploadBanner />
					<UploadThumbnail />
				</>
			)}
			<S.AWrapper>
				<Button
					type={'primary'}
					label={language.back}
					handlePress={handleBackStep}
					disabled={uploadReducer.currentStep === 'details' || uploadReducer.uploadActive}
					noMinWidth
				/>
				{getNextAction()}
			</S.AWrapper>
			<S.MWrapper>
				{arProvider.walletType && arProvider.walletType === 'arweave.app' && (
					<span>{language.arweaveAppUploadBlocked}</span>
				)}
				{!arProvider.wallet && <span>{language.uploadConnectionRequired}</span>}
				{arProvider.profile && !arProvider.profile.id && <span>{language.profileRequired}</span>}
				{getBalanceMessage()}
				{getDataSizeMessage()}
				{getImageSizeMessage()}
				{uploadReducer.data.contentList &&
					uploadReducer.data.idList &&
					uploadReducer.data.contentList.length + uploadReducer.data.idList.length <= 0 &&
					uploadReducer.currentStep === 'checks' && <span>{language.noAssetsSelected}</span>}
			</S.MWrapper>
		</S.Wrapper>
	);
}
