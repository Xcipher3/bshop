import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: {},
    total: 0
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId } = action.payload
      if (state.cartItems[productId]) {
        state.cartItems[productId]++
      } else {
        state.cartItems[productId] = 1
      }
      state.total += 1
    },
    removeFromCart: (state, action) => {
      const { productId } = action.payload
      if (state.cartItems[productId]) {
        state.cartItems[productId]--
        if (state.cartItems[productId] === 0) {
          delete state.cartItems[productId]
        }
      }
      state.total -= 1
    },
    deleteItemFromCart: (state, action) => {
      const { productId } = action.payload
      state.total -= state.cartItems[productId] ? state.cartItems[productId] : 0
      delete state.cartItems[productId]
    },
    clearCart: (state) => {
      state.cartItems = {}
      state.total = 0
    },
  }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions

export default cartSlice.reducer

// Async thunk to fetch cart from API
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cart/${userId}`)
      
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
      return rejectWithValue('Failed to fetch cart: ' + error.message)
    }
  }
)

// Async thunk to update cart in API
export const updateCart = createAsyncThunk(
  'cart/updateCart',
  async ({ userId, cart }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cart/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart }),
      })
      
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
      return rejectWithValue('Failed to update cart: ' + error.message)
    }
  }
)