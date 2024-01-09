import { Dispatch } from 'redux';

import { UploadPayloadDataType, UploadStepType } from 'helpers/types';

import {
	CLEAR_UPLOAD,
	SET_STEP_DETAILS,
	SET_STEP_DISABLED,
	SET_UPLOAD,
	SET_UPLOAD_ACTIVE,
	SET_UPLOAD_COST,
	SET_UPLOAD_DISABLED,
} from './constants';

export function setUpload(payload: UploadPayloadDataType[]) {
	return (dispatch: Dispatch) => {
		dispatch({
			type: SET_UPLOAD,
			payload: payload,
		});
	};
}

export function setUploadActive(payload: boolean) {
	return (dispatch: Dispatch) => {
		dispatch({
			type: SET_UPLOAD_ACTIVE,
			payload: payload,
		});
	};
}

export function setStepDetails(payload: UploadStepType) {
	return (dispatch: Dispatch) => {
		dispatch({
			type: SET_STEP_DETAILS,
			payload: payload,
		});
	};
}

export function setStepDisabled(payload: boolean) {
	return (dispatch: Dispatch) => {
		dispatch({
			type: SET_STEP_DISABLED,
			payload: payload,
		});
	};
}

export function setUploadDisabled(payload: boolean) {
	return (dispatch: Dispatch) => {
		dispatch({
			type: SET_UPLOAD_DISABLED,
			payload: payload,
		});
	};
}

export function setUploadCost(payload: number) {
	return (dispatch: Dispatch) => {
		dispatch({
			type: SET_UPLOAD_COST,
			payload: payload,
		});
	};
}

export function clearUpload() {
	return (dispatch: Dispatch) => {
		dispatch({
			type: CLEAR_UPLOAD,
			payload: null,
		});
	};
}
