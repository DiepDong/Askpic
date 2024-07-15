// get all documents
import { get } from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";

export const getAllDocuments = async () => {
    try {
        const response = await get(apiUrls.getDocument);
        return response.data;
    } catch (error) {
        console.error("Error getting all documents:", error);
        throw error;
    }
};