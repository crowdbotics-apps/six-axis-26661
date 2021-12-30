import axios from 'axios';
// import Preference from 'react-native-preference';
import Qs from 'qs';

// import { showErrorMsg } from '../utils'

const ROOT_URL = __DEV__
  ? 'https://six-axis-26661.botics.co/api'
  : 'https://six-axis-26661.botics.co/api';
  
const BASE_URL = `${ROOT_URL}/v1`;

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  async (config) => {
    const requestConfig = config;
    console.log("🚀 ~ file: config.js ~ line 24 ~ requestConfig", requestConfig)
    let authToken = null
    // let authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMGI3N2NmYzI5ZDczMGJjNDYyOWUwOSIsImlhdCI6MTYyOTc4Mjg5MSwiZXhwIjoxNjMwMzg3NjkxfQ.sf0rXBhq7fEm41K9w-AiZj7kiQOOKn8UYwAMQU--HXU"
    if (authToken) {
      requestConfig.headers = {
        'Authorization': `Bearer ${authToken}`,
      };
    }
    requestConfig.paramsSerializer = params => {
      return Qs.stringify(params, {
        arrayFormat: "brackets",
        encode: false
      });
    };
    return requestConfig;
  },
  (err) => {
    // showErrorMsg(err);
    return Promise.reject(err);
  },
);

export {
  ROOT_URL,
  BASE_URL,
  client,
};
