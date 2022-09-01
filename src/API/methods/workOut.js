import {postRequest, getRequest, getRequestWithParams,putRequest} from '../index';

export const getWorkouts = payload => getRequestWithParams(`/api/v1/workout/`,payload);

