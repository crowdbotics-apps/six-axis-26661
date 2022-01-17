import {getRequest,postRequest} from '../index';

export const createCard = (payload) => postRequest(`/api/v1/create_card/`,payload);
