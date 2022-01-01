import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Preference from 'react-native-preference';
import Qs from 'qs';

// import { showErrorMsg } from '../utils'

const ROOT_URL = __DEV__
  ? 'https://six-axis-26661.botics.co'
  : 'https://six-axis-26661.botics.co';
  
const BASE_URL = `${ROOT_URL}`;

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
    let authToken = await AsyncStorage.getItem("authToken")
    if(authToken){
      authToken = JSON.parse(authToken)
    }
    if (authToken) {
      requestConfig.headers = {
        'Authorization': `token ${authToken}`,
      };
    }
    console.log("🚀 ~ file: config.js ~ line 24 ~ requestConfig", requestConfig)
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
