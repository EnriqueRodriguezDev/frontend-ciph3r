import type { BaseEntity } from "../types";
import { url } from "./url";

export const products = () => {
    
  const getProductById = (productId: BaseEntity['id']) => {
    return `${url()}/products/${productId}`;
  };

  return {
    getProductById
  }
};