import {patchRequest,postRequest} from '../index'

export const updateProfileData = payload => patchRequest(`/rest-auth/user/`, payload);

export const changePasswordApi = payload => postRequest(`/rest-auth/password/change/`, payload);