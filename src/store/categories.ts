import { ref } from "vue";
import axios from "axios";
import type { CategoriesSummmary, Token } from "../types";
import { categories } from "../api/categories";

export const useCategories = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchAllCategories = async (token: Token["value"]): Promise<CategoriesSummmary[]> => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const { getAll } = categories();
      const response = await axios.get(getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      //Filtrar y mapear los datos a CategoriesSummary
      const allCategories = response.data.data.map((category: any): CategoriesSummmary => ({
        id: category.id,
        name: category.name,
      }));

      return allCategories;
    
    } catch (error) {
      console.error("Error fetching categories", error);
      return [];

    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    fetchAllCategories,
  };
};