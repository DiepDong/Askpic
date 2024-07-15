import {apiHelper} from '../utils/apiHelper';
import { apiUrls } from '../utils/constants';

export const askDocument = async (documentId, question) => {
    try {
        const url = `${apiUrls.askInDocument}`;
        const params = new URLSearchParams();
        params.append('question', question);
        params.append('document_id', documentId);

        const response = await apiHelper.post(url, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'accept': 'application/json',
            },
        });

        return response.data; // Return response data directly assuming it contains answers
    } catch (error) {
        console.error('Error asking document:', error);
        throw error;
    }
};
