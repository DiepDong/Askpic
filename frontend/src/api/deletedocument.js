// deletedocument.js

import { apiHelper } from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";

export const deleteDocument = async (documentId) => {
  try {
    const url = `${apiUrls.deleteDocument}?document_id=${documentId}`;
    const response = await apiHelper.delete(url);
    return response.data; // Assuming your backend returns data upon successful deletion
  } catch (error) {
    throw error; // Handle errors as per your application's requirements
  }
};
