import {postRequest, getRequest, getRequestWithParams,putRequest} from '../index';

export const signupAPI = payload => postRequest(`/api/v1/signup/`, payload);

export const signInAPI = payload => postRequest(`/api/v1/login/`, payload);
