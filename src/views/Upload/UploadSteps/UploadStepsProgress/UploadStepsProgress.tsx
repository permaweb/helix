import React from 'react';
import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';

import { ASSETS, UPLOAD_STEPS } from 'helpers/config';
import { UploadStepType } from 'helpers/types';
import { useLanguageProvider } from 'providers/LanguageProvider';
import { RootState } from 'store';

import * as S from './styles';

export default function UploadStepsProgress() {
	const uploadReducer = useSelector((state: RootState) => state.uploadReducer);

	const languageProvider = useLanguageProvider();
	const language = languageProvider.object[languageProvider.current];

	const isStepActiveOrCompleted = (step: UploadStepType) => {
		if (uploadReducer.uploadActive) {
			return {
				active: true,
				completed: true,
			};
		}
		const currentIndex = UPLOAD_STEPS.indexOf(uploadReducer.currentStep);
		const stepIndex = UPLOAD_STEPS.indexOf(step);
		return {
			active: currentIndex === stepIndex,
			completed: stepIndex < currentIndex,
		};
	};

	return (
		<S.Wrapper>
			{UPLOAD_STEPS.map((step: UploadStepType, index: number) => {
				return (
					<React.Fragment key={step}>
						<S.Step {...isStepActiveOrCompleted(step)}>
							<span>{language[step]}</span>
							<S.SIndicator {...isStepActiveOrCompleted(step)}>
								{isStepActiveOrCompleted(step).completed && <ReactSVG src={ASSETS.checkmark} />}
							</S.SIndicator>
						</S.Step>
						{index < UPLOAD_STEPS.length - 1 && (
							<S.Line completed={isStepActiveOrCompleted(UPLOAD_STEPS[index]).completed} />
						)}
					</React.Fragment>
				);
			})}
		</S.Wrapper>
	);
}
