import { ProductDTO } from '@smartcart/shared/src/dto/Product.dto';
import { ProductDTOResponse } from '@smartcart/shared/src/types';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const searchAnotherApiService = {
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  getSearchProduct: async (itemTxt: string, storePKs: string[]): Promise<ProductDTO[]> => {

    const response = await apiClient.post(`/searchAnotherProduct/${itemTxt}`, { storePKs });

    console.log("response", response);
    if (response.status === 200) {
      console.log("response.data", response.data);
      return response.data || [];
    }
    throw new Error(response.data.error);
  },
};