import {postRequest} from '../index';

export const forgetPasswordApi = payload => postRequest(`/rest-auth/password/reset/`, payload);

