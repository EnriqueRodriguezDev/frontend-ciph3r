<template>
    <v-app>
      <v-app-bar app color="blue darken-1" dark>
        <!-- Toggle Button for Menu -->
        <v-btn icon @click="toggleMenu">
          <v-icon>{{ isMenuOpen ? 'mdi-menu-open' : 'mdi-menu' }}</v-icon>
        </v-btn>
  
        <!-- Logo -->
        <v-img
          class="ml-2"
          max-width="120"
          src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
          contain
        ></v-img>
  
        <!-- Search Bar -->
        <v-select
          v-model="selectedCategory"
          :items="categories"
          item-text="name" 
          item-value="id" 
          label="Categorías"
          outlined
          class="mx-5 mt-5"
        />

        <v-text-field
          v-model="searchQuery"
          label="Buscar productos"
          outlined
          class="mx-2 mt-5"
        ></v-text-field>
        <v-btn icon color="white" @click="searchProducts">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
  
        <!-- Botón para limpiar la búsqueda -->
        <v-btn icon color="white" @click="clearSearch">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
  
        <!-- Cart and Logout -->
        <v-btn icon color="white">
          <v-icon>mdi-cart</v-icon>
        </v-btn>
  
        <v-btn icon color="white" @click="logout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-app-bar>
  
      <!-- Side Menu -->
      <v-navigation-drawer v-model="isMenuOpen" app temporary>
        <v-list>
          <v-list-item>
            <v-list-item-content>Menú</v-list-item-content>
          </v-list-item>
          <v-list-item v-for="item in menuItems" :key="item" link>
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <!-- Product List -->
      <v-container class="mt-15">
        <v-row>
          <!-- Loading Indicator -->
          <v-col cols="12" v-if="isLoading" class="text-center">
            <v-progress-circular indeterminate color="blue" size="70"></v-progress-circular>
          </v-col>
  
          <!-- Products -->
          <v-col v-for="product in paginatedProducts" :key="product.id" cols="12" md="4">
            <v-card>
              <v-img 
                :src="'https://via.placeholder.com/150'" 
                class="mt-5" 
                height="150px"
                contain />
              <v-card-title>{{ product.name }}</v-card-title>
              <v-card-text>${{ product.price }}</v-card-text>
              <v-card-text>Categoria: {{ product.categories.name }}</v-card-text>
  
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn icon color="primary">
                  <v-icon>mdi-cart-plus</v-icon>
                </v-btn>
                <v-btn icon color="error">
                  <v-icon>mdi-cart-remove</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
  
        <!-- Pagination -->
        <v-pagination v-model="currentPage" :length="Math.ceil(totalProducts / itemsPerPage)" class="mt-4"></v-pagination>
      </v-container>
    </v-app>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed, onMounted, watch } from "vue";
  import { useAuthStore } from "../store/auth";
  import { useRouter } from "vue-router";
  import { useCategories } from "../store/categories";
  import { useProducts } from "../store/products";
  import type { ProductSummary } from "../types";
  
  export default defineComponent({
    setup() {
      const authStore = useAuthStore();
      const userData = authStore.getUserData()!;
      const router = useRouter();
  
      const { fetchAllCategories } = useCategories();
      const { fetchProductsForPage, fetchFilteredProducts } = useProducts();
  
      const menuItems = ["Inicio", "Categorías", "Ofertas", "Contacto"];
  
      const categories = ref<string[]>([]);
      const isMenuOpen = ref(false);
      const selectedCategory = ref<string>('');
      const searchQuery = ref("");
      const currentPage = ref(1);
      const itemsPerPage = ref(15);
      const totalProducts = ref(0);
      const products = ref<ProductSummary[]>([]);
      const isLoading = ref(false);
  
      const paginatedProducts = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        return products.value.slice(start, end);
      });

      const fetchCategories = async () => {
        try {
          const response = await fetchAllCategories(userData.token);
          categories.value = response   
                .map((category: { name: string }) => category.name)
                .sort((a: string, b: string) => a.localeCompare(b));
        } catch (error) {
          console.log("Error fetching categories", error);
        }
      };
  
      const fetchPaginatedProducts = async (page: number) => {

        //products.value = [];
        isLoading.value = true;

        try {
          const productsForPage = await fetchProductsForPage(userData.token, page);
          products.value = productsForPage.map((product: ProductSummary) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            categories: product.categories,
          }));
          totalProducts.value = 30; // Ajustar según la API

        } catch (error) {
          console.log("Error fetching products", error);
        } finally {
          isLoading.value = false;
        }
      };
  
      const searchProducts = async () => {
        
        if(!searchQuery.value && !selectedCategory.value){
            alert('Debe seleccionar una categoria o digitar el nombre de un producto');
            return;
        }

        isLoading.value = true;

        try {
          const filteredProducts = await fetchFilteredProducts(userData.token, searchQuery.value, selectedCategory.value);
          products.value = filteredProducts.map((product: ProductSummary) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            categories: product.categories,
          }));
          totalProducts.value = filteredProducts.length;
        } catch (error) {
          console.log("Error fetching filtered products", error);
        } finally {
          isLoading.value = false;
        }
      };
  
      const logout = () => {
        authStore.token = "";
        router.push("/login");
      };
  
      onMounted(() => {
        fetchCategories();
        fetchPaginatedProducts(currentPage.value);
      });
  
      watch(currentPage, (newPage: number) => {
        fetchPaginatedProducts(newPage);
      });
  
      const clearSearch = async () => {
        searchQuery.value = "";
        selectedCategory.value = ""; 
        await fetchCategories();
        products.value = [];
        await fetchPaginatedProducts(1);
      };
  
      return {
        isMenuOpen,
        categories,
        selectedCategory,
        searchQuery,
        products,
        currentPage,
        itemsPerPage,
        totalProducts,
        paginatedProducts,
        isLoading,
        menuItems,
        toggleMenu: () => (isMenuOpen.value = !isMenuOpen),
        logout,
        searchProducts,
        clearSearch,
      };
    },
  });
  </script>  