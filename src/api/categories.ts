import { url } from "./url";

export const categories = () => {

  const getAll = `${url()}/categories`;

  return {
    getAll
  }

};