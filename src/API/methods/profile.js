import {getRequest,postRequest} from '../index';

export const getProfile = () => getRequest(`/rest-auth/user/`);

export const logOut = () => postRequest(`/rest-auth/logout/`);