import { ref } from "vue";
import axios from "axios";
import type { ProductSummary, Token } from "../types"; // Define PartialProduct en ../types
import { products } from "../api/products";

export const useProducts = () => {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const allProducts = ref<ProductSummary[]>([]);
  const paginatedProducts = ref<ProductSummary[]>([]);

  const mapToPartialProduct = (data: any): ProductSummary => ({
    id: data.id,
    name: data.name,
    price: data.price,
    description: data.description,
    categories: {
      id: data.categories[0]?.id || 0,
      name: data.categories[0]?.name || "Unknown",
    },
  });

  const fetchProduct = async (token: Token["value"], id: number): Promise<ProductSummary | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      const { getProductById } = products();
      const response = await axios.get(getProductById(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return mapToPartialProduct(response.data.data);

    } catch (error) {
      console.error("Error fetching product", error);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProductsForPage = async (token: Token["value"], page: number): Promise<ProductSummary[]> => {
    const productsPerPage = 15;
    const startId = (page - 1) * productsPerPage + 1;
    const endId = startId + productsPerPage - 1;

    const pageProducts: ProductSummary[] = [];

    for (let id = startId; id <= endId; id++) {
      const product = await fetchProduct(token, id);
      if (product) {
        pageProducts.push(product);
      }
    }
    // Actualizar la lista de productos de la página actual
    paginatedProducts.value = pageProducts;
    return paginatedProducts.value;
  };

  const fetchFilteredProducts = async (token: Token["value"], searchQuery: string, categoryId: string | null): Promise<ProductSummary[]> => {
    isLoading.value = true;
    error.value = null
  
    try {
      // Obtener todos los productos de la primera página (puedes modificarlo para obtener más páginas si es necesario)
      const allProducts = await fetchProductsForPage(token, 1);
  
      // Filtrar productos usando map
      const filteredProducts = allProducts
        .map((product) => {
          // Verificar si el producto cumple con el filtro de categoría y búsqueda
          const matchesCategory = categoryId === null || product.categories.name === categoryId;
          const matchesSearch = searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase());
  
          // Si cumple con los criterios de filtro, retornar el producto, de lo contrario, devolver null
          if (matchesCategory && matchesSearch) {
            return product;
          }
          return null;
        })
        .filter((product) => product !== null); // Eliminar los valores null de la lista
  
      // Actualizar la lista de productos filtrados para la página actual
      paginatedProducts.value = filteredProducts;
      return paginatedProducts.value;
  
    } catch (error) {
      console.error("Error fetching filtered products", error);
      return [];
    } finally {
      isLoading.value = false;
    }
  };
  

  return {
    isLoading,
    error,
    allProducts,
    paginatedProducts,
    fetchProduct,
    fetchProductsForPage,
    fetchFilteredProducts,  // Nuevo método para búsqueda filtrada
  };
};
