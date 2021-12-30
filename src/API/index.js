import { client } from './config';

export const getRequest = (url) => client.get(url);

export const getRequestWithParams = (url, params = {}) => client.get(url, params);

export const postRequest = (url, payload = {}) => client.post(url, payload);

export const patchRequest = (url, payload = {}) => client.patch(url, payload);

export const putRequest = (url, payload = {}) => client.put(url, payload);

export const deleteRequest = (url, payload = {}) =>
  client.delete(url, { payload });
