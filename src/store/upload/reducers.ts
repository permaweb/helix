import { ReduxActionType, UploadPayloadDataType, UploadReduxType, UploadStepType } from 'helpers/types';

import {
	CLEAR_UPLOAD,
	SET_STEP_DETAILS,
	SET_STEP_DISABLED,
	SET_UPLOAD,
	SET_UPLOAD_ACTIVE,
	SET_UPLOAD_COST,
	SET_UPLOAD_DISABLED,
} from './constants';

const initStateUploadReducer = {
	data: {
		content: null,
		contentType: '',
		contentLength: null,
		license: null,
		title: '',
		description: '',
		thumbnail: null,
		topics: [],
		type: '',
		hasLicense: true,
	},
	currentStep: 'details' as UploadStepType,
	nextStepDisabled: true,
	uploadActive: false,
	uploadDisabled: false,
	uploadCost: 0,
};

export function uploadReducer(state: UploadReduxType = initStateUploadReducer, action: ReduxActionType) {
	let updatedState: any;
	switch (action.type) {
		case SET_UPLOAD:
			updatedState = { ...state };
			action.payload.forEach(
				(payloadElement: UploadPayloadDataType) => (updatedState.data[payloadElement.field] = payloadElement.data)
			);
			return updatedState;
		case SET_UPLOAD_ACTIVE:
			updatedState = { ...state };
			updatedState.uploadActive = action.payload;
			return updatedState;
		case SET_STEP_DETAILS:
			updatedState = { ...state };
			updatedState.currentStep = action.payload;
			return updatedState;
		case SET_STEP_DISABLED:
			updatedState = { ...state };
			updatedState.nextStepDisabled = action.payload;
			return updatedState;
		case SET_UPLOAD_COST:
			updatedState = { ...state };
			updatedState.uploadCost = action.payload;
			return updatedState;
		case SET_UPLOAD_DISABLED:
			updatedState = { ...state };
			updatedState.uploadDisabled = action.payload;
			return updatedState;
		case CLEAR_UPLOAD:
			return {
				data: {
					content: null,
					contentType: '',
					contentLength: null,
					title: '',
					description: '',
					thumbnail: null,
					topics: [],
					type: '',
				},
				currentStep: 'details' as UploadStepType,
				nextStepDisabled: true,
				uploadActive: false,
				uploadDisabled: false,
				uploadCost: 0,
			};
		default:
			return state;
	}
}
