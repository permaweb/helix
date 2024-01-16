import { ReduxActionType, UploadPayloadDataType, UploadReduxType, UploadStepType, UploadType } from 'helpers/types';

import {
	CHANGE_UPLOAD,
	CLEAR_UPLOAD,
	SET_STEP_DETAILS,
	SET_STEP_DISABLED,
	SET_UPLOAD,
	SET_UPLOAD_ACTIVE,
	SET_UPLOAD_COST,
	SET_UPLOAD_DISABLED,
	SET_UPLOAD_TYPE,
} from './constants';

const initStateUploadReducer = {
	data: {
		content: null,
		contentList: [],
		contentType: '',
		contentLength: null,
		idList: [],
		license: null,
		title: '',
		description: '',
		collectionCode: '',
		contentTokens: 100,
		useFractionalTokens: true,
		banner: null,
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
	uploadType: 'collection' as UploadType,
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
		case SET_UPLOAD_TYPE:
			updatedState = { ...state };
			updatedState.uploadType = action.payload;
			return updatedState;
		case CLEAR_UPLOAD:
			return {
				data: {
					content: null,
					contentList: [],
					contentType: '',
					contentLength: null,
					idList: [],
					license: null,
					title: '',
					description: '',
					collectionCode: '',
					contentTokens: 100,
					useFractionalTokens: true,
					banner: null,
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
				uploadType: 'collection',
			};
		case CHANGE_UPLOAD:
			return {
				data: {
					content: null,
					contentList: state.data.contentList,
					contentType: '',
					contentLength: null,
					idList: [],
					license: null,
					title: '',
					description: '',
					collectionCode: '',
					contentTokens: 100,
					useFractionalTokens: true,
					banner: null,
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
				uploadType: state.uploadType,
			};
		default:
			return state;
	}
}
