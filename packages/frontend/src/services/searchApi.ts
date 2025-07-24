
import { ProductDTO } from '@smartcart/shared/src/dto/Product.dto';
import { ProductDTOResponse } from '@smartcart/shared/src/types';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;


const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
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


export const searchApiService = {
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  getSearchProduct: async (itemTxt: string, storePK: string): Promise<ProductDTO[]> => {
    const response = await apiClient.get(`/searchProduct/${itemTxt}/${storePK}`);
   //const response1 = await apiClient.get<ProductDTOResponse>(`/searchProduct/${itemTxt}/${storePK}`);
   if (response.status == 200) {
      return response.data || [];
    }
    throw new Error(response.data.error);
  },
}