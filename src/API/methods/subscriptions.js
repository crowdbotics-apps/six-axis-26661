import {getRequest,postRequest} from '../index';

export const getSubscriptionsApi = () => getRequest(`/api/v1/payment/get_subscription_price/`);

