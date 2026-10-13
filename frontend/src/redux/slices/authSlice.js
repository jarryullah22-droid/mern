import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login
      const { email, password } = credentials;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation (in a real app, this would be server-side)
      if (email === 'user@example.com' && password === 'password123') {
        const userData = {
          id: '1',
          email,
          name: 'John Doe',
        };
        
        const token = 'mock-jwt-token';
        localStorage.setItem('token', token);
        
        return { user: userData, token };
      } else {
        return rejectWithValue('Invalid email or password');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful registration
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation (in a real app, this would be server-side)
      const { email, password, firstName, lastName } = userData;
      
      // Check if email is already in use (mock check)
      if (email === 'user@example.com') {
        return rejectWithValue('Email already in use');
      }
      
      const newUser = {
        id: Math.floor(Math.random() * 1000).toString(),
        email,
        name: `${firstName} ${lastName}`,
      };
      
      const token = 'mock-jwt-token';
      localStorage.setItem('token', token);
      
      return { user: newUser, token };
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
    return null;
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Logout case
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
