import * as actionTypes from './actionTypes'; // Importing action types
import { loginUser, registerUser, uploadProfilePicture, removeProfilePicture } from '../../API/AuthApi'; // Adjust the path as needed
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";

// Action Creators for Loading, Login, Logout
export const authLoading = () => ({ type: actionTypes.AUTH_LOADING });

export const authLogin = (userData, token) => ({
    type: actionTypes.AUTH_LOGIN,
    payload: { userData, token },
});

export const authLogout = () => ({ type: actionTypes.AUTH_LOGOUT });

// Action Creators for Profile Picture Upload and Removal
const profilePicUploadSuccess = (updatedUser) => ({
    type: actionTypes.PROFILE_PIC_UPLOAD_SUCCESS,
    payload: updatedUser,
});

const profilePicUploadFailure = (errorMessage) => ({
    type: actionTypes.PROFILE_PIC_UPLOAD_FAILURE,
    payload: errorMessage,
});

const profilePicRemoveSuccess = (updatedUser) => ({
    type: actionTypes.PROFILE_PIC_REMOVE_SUCCESS,
    payload: updatedUser,
});

const profilePicRemoveFailure = (errorMessage) => ({
    type: actionTypes.PROFILE_PIC_REMOVE_FAILURE,
    payload: errorMessage,
});
// dispatch({
//     type: actionTypes.PROFILE_PIC_REMOVE_FAILURE,
//     payload: error.message,
// });

// Register Action
export const register = ({ firstName, lastName, email, username, password }) => async (dispatch) => {
    dispatch(authLoading()); // Dispatch loading state
    try {
        const { ok, data } = await registerUser({ firstName, lastName, email, username, password });

        if (!ok) {
            showErrorToast(data.error || data.message || "Registration failed");
            return { error: data.error || data.message || "Registration failed" };
        }

        showSuccessToast("Registration successful! Please login.");
        return { success: true };

    } catch (error) {
        console.error("Registration Error:", error);
        showErrorToast("Something went wrong during registration");
        return { error: "Something went wrong during registration" };
    }
};

// Login Action
export const login = ({ email, password }) => async (dispatch) => {
    dispatch(authLoading()); // Dispatch loading state
    try {
        const { ok, data } = await loginUser(email, password);

        if (!ok) {
            showErrorToast(data.error || "Login failed");
            return { error: data.error || "Login failed" };
        }

        const { token, user } = data;

        if (!token || !user) {
            showErrorToast("Invalid login response.");
            return { error: "Invalid login response." };
        }

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        dispatch(authLogin(user, token));

        showSuccessToast(`Login successful! Welcome back, ${user.username}!`);
        return { success: true };

    } catch (error) {
        console.error("Login Error:", error);
        showErrorToast("Something went wrong during login");
        return { error: "Something went wrong during login" };
    }
};

// Profile Picture Upload
export const uploadProfilePic = (file) => async (dispatch, getState) => {
    try {
        const token = localStorage.getItem("token");
        const { ok, data } = await uploadProfilePicture(file, token);

        if (!ok) {
            throw new Error(data.error || "Profile picture upload failed");
        }

        const currentUser = getState().auth.user;
        const updatedUser = { ...currentUser, profilePic: data.base64Image };

        localStorage.setItem("user", JSON.stringify(updatedUser)); // Update localStorage

        dispatch(profilePicUploadSuccess(updatedUser)); // Dispatch success action
        showSuccessToast(data.message || "Profile picture updated successfully");

        return { success: true };

    } catch (error) {
        console.error("Upload error:", error);
        dispatch(profilePicUploadFailure(error.message)); // Dispatch failure action
        showErrorToast("Failed to update profile picture");
        return { error: error.message };
    }
};

// Profile Picture Removal
export const removeProfilePic = () => async (dispatch, getState) => {
    try {
        const token = localStorage.getItem("token");
        const { ok, data } = await removeProfilePicture(token);

        if (!ok) throw new Error(data.error || "Failed to remove profile picture");

        const currentUser = getState().auth.user;
        const updatedUser = { ...currentUser, profilePic: null };

        localStorage.setItem("user", JSON.stringify(updatedUser)); // Update localStorage

        dispatch(profilePicRemoveSuccess(updatedUser)); // Dispatch success action
        showSuccessToast(data.message || "Profile picture removed successfully");

        return { success: true };

    } catch (error) {
        console.error("Remove Profile Picture Error:", error);
        dispatch(profilePicRemoveFailure(error.message)); // Dispatch failure action
        showErrorToast("Failed to remove profile picture");
        return { error: error.message };
    }
};

// Logout Action
export const logout = () => (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(authLogout()); // Dispatch logout action
    showSuccessToast("Logged out successfully!");
};
