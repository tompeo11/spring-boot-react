import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Product from "../../type/Product";
import { PaginationResponse } from "../../model/pagination";

interface CatalogState {
    productLoad: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    categories: string[];
    productParams: ProductParams;
    pagination: PaginationResponse;
}

const initialState : CatalogState = {
    status: 'idle',
    productLoad: false,
    brands: [],
    categories: [],
    filtersLoaded: false,
    productParams: {
        pageNumber: 1,
        pageSize: 6,
        sort: 'name'
    },
    pagination: {
        number: 0,
        totalElements: 0,
        totalPages: 0,
        size: 0
    },
}


export const productAdapter = createEntityAdapter<Product>();

export const fetchProductThunk = createAsyncThunk<Product[]>(
    'catalog/fetchProducts',
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;

        const params = new URLSearchParams();

        params.append('pageNumber', (state.catalog.productParams.pageNumber - 1).toString());
        params.append('pageSize', state.catalog.productParams.pageSize.toString());
        params.append('sort', state.catalog.productParams.sort);

        if (state.catalog.productParams.name) {
            params.append('name', state.catalog.productParams.name);
        }
        if (state.catalog.productParams.categories) {
            params.append('category', state.catalog.productParams.categories.toString());
        }
        if (state.catalog.productParams.brands) {
            params.append('brand', state.catalog.productParams.brands.toString());
        }


        try {
            const response = await axios.get('/api/products/search',
                {params: params}
            );
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
            const response = await axios.get(`/api/products/${productId}`);
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }
);

export const fetchBrandAndCategoryForFilterThunk = createAsyncThunk<any>(
    'catalog/fetchBrandAndCategoryForFilter',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('/api/products/get-filter');
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productAdapter.getInitialState<CatalogState>(initialState),
    reducers: {
        setProductParams: (state, action) => {
            state.productLoad = false;
            state.productParams = {...state.productParams, ...action.payload, pageNumber: 1};
        },
        setPageNumber: (state, action) => {
            state.productLoad = false;
            state.productParams = {...state.productParams, ...action.payload};
        },
        resetProductParams: (state) => {
            state.productParams = {
                pageNumber: 1,
                pageSize: 6,
                sort: 'name'
            };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProductThunk.pending, (state) => {
            state.status = 'loadingFetchProducts';
        });
        builder.addCase(fetchProductThunk.fulfilled, (state, action) => {
            state.status = 'idle';
            state.productLoad = true;
            productAdapter.setAll(state, action.payload.data);
            state.pagination = action.payload.page;
        });
        builder.addCase(fetchProductThunk.rejected, (state) => {
            state.status = 'idle';
        });

        builder.addCase(fetchProductByIdThunk.pending, (state) => {
            state.status = 'loadingFetchProductsById';
        });
        builder.addCase(fetchProductByIdThunk.fulfilled, (state, action) => {
            state.status = 'idle';
            state.productLoad = true;
            productAdapter.upsertOne(state, action.payload);
        });
        builder.addCase(fetchProductByIdThunk.rejected, (state) => {
            state.status = 'idle';
        });
        builder.addCase(fetchBrandAndCategoryForFilterThunk.pending, (state, action) => {
            state.status = 'pendingFetchBrandAndCategoryForFilter';
        });
        builder.addCase(fetchBrandAndCategoryForFilterThunk.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.categories = action.payload.categories;
            state.status = 'idle';
            state.filtersLoaded = true;
        });
        builder.addCase(fetchBrandAndCategoryForFilterThunk.rejected, (state, action) => {
            console.log(action.payload);
            state.status = 'idle';
        });
    }
});

export const {setProductParams, resetProductParams, setPageNumber} = catalogSlice.actions;