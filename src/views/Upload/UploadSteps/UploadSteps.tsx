import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'components/atoms/Button';
import { UPLOAD_STEPS } from 'helpers/config';
import { UploadStepType } from 'helpers/types';
import { useArweaveProvider } from 'providers/ArweaveProvider';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';
import * as uploadActions from 'store/upload/actions';

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

	function handleNextStep() {
		const currentIndex = UPLOAD_STEPS.indexOf(uploadReducer.currentStep);
		if (currentIndex < UPLOAD_STEPS.length - 1) {
			const nextStep = UPLOAD_STEPS[currentIndex + 1] as UploadStepType;
			dispatch(uploadActions.setStepDetails(nextStep));
		}
	}

	function handleBackStep() {
		const currentIndex = UPLOAD_STEPS.indexOf(uploadReducer.currentStep);
		if (currentIndex > 0) {
			const previousStep = UPLOAD_STEPS[currentIndex - 1] as UploadStepType;
			dispatch(uploadActions.setStepDetails(previousStep));
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
				/>
			);
		} else {
			return (
				<Button
					type={'alt1'}
					label={language.next}
					handlePress={handleNextStep}
					disabled={uploadReducer.nextStepDisabled || uploadReducer.uploadActive}
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

	return (
		<S.Wrapper>
			<S.PWrapper>
				<UploadStepsProgress />
			</S.PWrapper>
			<S.SWrapper>{getCurrentStepComponent()}</S.SWrapper>
			<S.AWrapper>
				<Button
					type={'primary'}
					label={language.back}
					handlePress={handleBackStep}
					disabled={uploadReducer.currentStep === 'details' || uploadReducer.uploadActive}
				/>
				{getNextAction()}
			</S.AWrapper>
			<S.MWrapper>
				{arProvider.walletType && arProvider.walletType === 'arweave.app' && (
					<span>{language.arweaveAppUploadBlocked}</span>
				)}
				{!arProvider.wallet && <span>{language.uploadConnectionRequired}</span>}
				{getBalanceMessage()}
			</S.MWrapper>
		</S.Wrapper>
	);
}
