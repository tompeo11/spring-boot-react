import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Product from "../../type/Product";


export const productAdapter = createEntityAdapter<Product>();

export const fetchProductThunk = createAsyncThunk<Product[]>(
    'catalog/fetchProducts',
    async () => {
        try {
            const response = await axios.get('products');
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }
);


export const fetchProductByIdThunk = createAsyncThunk<Product, number>(
    'catalog/fetchProductsById',
    async (productId) => {
        try {
            const response = await axios.get(`products/${productId}`);
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }
);

// export const fetchBrandAndCategoryForFilterThunk = createAsyncThunk<any>(
//     'catalog/fetchBrandAndCategoryForFilter',
//     async (productId) => {}
// )


export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productAdapter.getInitialState({
        status: 'idle',
        productLoad: false,
        brands: [],
        categories: [],
        filtersLoaded: false
    }),
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProductThunk.pending, (state, action) => {
            state.status = 'loadingFetchProducts';
        });
        builder.addCase(fetchProductThunk.fulfilled, (state, action) => {
            state.status = 'idle';
            state.productLoad = true;
            productAdapter.setAll(state, action.payload);
        });
        builder.addCase(fetchProductThunk.rejected, (state, action) => {
            state.status = 'idle';
        });

        builder.addCase(fetchProductByIdThunk.pending, (state, action) => {
            state.status = 'loadingFetchProductsById';
        });
        builder.addCase(fetchProductByIdThunk.fulfilled, (state, action) => {
            state.status = 'idle';
            state.productLoad = true;
            productAdapter.upsertOne(state, action.payload);
        });
        builder.addCase(fetchProductByIdThunk.rejected, (state, action) => {
            state.status = 'idle';
        });
    }
});