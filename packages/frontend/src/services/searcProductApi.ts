import { ProductDTO } from '@smartcart/shared/src/dto/Product.dto';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 70000,
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

export const searchProductApiService = {
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  getSearchProduct: async (itemTxt: string, storePKs: string[]): Promise<any[]> => {
    console.log("getSearchProduct called with itemTxt:", itemTxt, "and storePKs:", storePKs);
    const response = await apiClient.post(`/searchProduct/${itemTxt}`, {
      storePKs: storePKs, // Send storePKs in the request body
    });
    console.log("response", response);
    if (response.status === 200) {
      return response.data.map((item: any) => ({
        itemCode: item.item_code,
        priceId: item.price_id,
        itemName: item.product_name,
        storePK: item.store_pk,
        manufacturerItemDescription: item.manufacturer_item_description,
        manufacturerName: item.manufacturer_name,
        price: item.price,
        unitOfMeasurePrice: item.unit_of_measure_price,
        quantityInPackage: item.quantity_in_package,
        hasPromotion: item.has_promotion,
        promotionText: item.promotion_text,
      })) || [];
    }
    throw new Error(response.data.error);
  },
};