import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productDummyData } from '@/assets/assets'

const productSlice = createSlice({
  name: 'product',
  initialState: {
    list: productDummyData,
  },
  reducers: {
    setProduct: (state, action) => {
      state.list = action.payload
    },
    clearProduct: (state) => {
      state.list = []
    }
  }
})

export const { setProduct, clearProduct } = productSlice.actions

export default productSlice.reducer

// Async thunk to fetch products from API
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/products')
      
      // Check if response is OK
      if (!response.ok) {
        return rejectWithValue(`HTTP error! status: ${response.status}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        return rejectWithValue('Invalid response format from server')
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue('Failed to fetch products: ' + error.message)
    }
  }
)

// Async thunk to fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/products/${id}`)
      
      // Check if response is OK
      if (!response.ok) {
        // Try to parse error response, but handle if it's not JSON
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json()
            return rejectWithValue(errorData.error || `HTTP error! status: ${response.status}`)
          } else {
            return rejectWithValue(`HTTP error! status: ${response.status}`)
          }
        } catch (parseError) {
          return rejectWithValue(`HTTP error! status: ${response.status}`)
        }
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        return rejectWithValue('Invalid response format from server')
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue('Failed to fetch product: ' + error.message)
    }
  }
)