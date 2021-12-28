import {postRequest, getRequest, getRequestWithParams,putRequest} from '../index';

export const signupAPI = payload => postRequest(`/signup/`, payload);

export const signInAPI = payload => postRequest(`/login/`, payload);
