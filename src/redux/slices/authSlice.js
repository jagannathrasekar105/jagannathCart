import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  uploadProfilePicture,
  removeProfilePicture,
} from "../../components/API/AuthApi";
const storedUser = localStorage.getItem("user");
const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { ok, data } = await loginUser(email, password);
      if (!ok) return rejectWithValue(data.error || "Login Failed");
      localStorage.setItem("token", data.token);
      return data.user;
    } catch (err) {
      return rejectWithValue("Login error");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { ok, data } = await registerUser(userData);
      if (!ok) return rejectWithValue(data.error || "Registrtion failed");
      return true;
    } catch (err) {
      return rejectWithValue("register error");
    }
  }
);

export const uploadProfile = createAsyncThunk(
  "auth/uploadProfile",
  async (File, { getState, rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const { ok, data } = await uploadProfilePicture(File, token);
      if (!ok) throw new Error();

      return data.base64Image;
    } catch {
      return rejectWithValue("upload failed");
    }
  }
);

export const removeProfile = createAsyncThunk(
  "auth/removeProfile",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    try {
      const { ok } = await removeProfilePicture(token);
      if (!ok) throw new Error();

      return null;
    } catch {
      return rejectWithValue("removed Failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("buyProduct");
      localStorage.removeItem("theme");
    },

    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user.profilePic = action.payload;
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(removeProfile.fulfilled, (state) => {
        if (state.user) {
          state.user.profilePic = null;
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
