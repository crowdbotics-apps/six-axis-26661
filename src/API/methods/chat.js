import { getRequest } from "../index";

export const getChatListApi = () => getRequest(`/qr-code/get-message-by-printerId`);
