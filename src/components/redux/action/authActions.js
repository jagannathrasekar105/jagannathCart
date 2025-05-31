import * as actionTypes from './actionTypes';
import {
    loginUser,
    registerUser,
    uploadProfilePicture,
    removeProfilePicture
} from '../../API/AuthApi';
import { showSuccessToast, showErrorToast } from '../../../utils/toastUtils';

// Basic actions
export const authLoading = () => ({ type: actionTypes.AUTH_LOADING });
export const authLoading_false = () => ({ type: actionTypes.AUTH_LOADING_FALSE });

export const authLogin = (userData) => ({
    type: actionTypes.AUTH_LOGIN,
    payload: userData,
});

export const authLogout = () => ({ type: actionTypes.AUTH_LOGOUT });

// Profile Picture actions
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


export const fetchCurrentUser = () => async (dispatch) => {
    dispatch(authLoading());

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/authenticate/me`, {
            credentials: "include", // important for cookies
        });



        if (!res.ok) {
            dispatch(authLogout());
            return;
        }

        const data = await res.json();
        if (!data.user) {
            dispatch(authLogout());
            return;
        }
        console.log("data", data)

        console.log("data.user", data.user);
        dispatch(authLogin(data.user));
        // dispatch(authLoading_false())
    } catch (error) {
        console.error("Fetch current user error:", error);
        dispatch(authLogout());
    }
};


// Register action
export const register = ({ firstName, lastName, email, username, password }) => async (dispatch) => {


    try {
        const { ok, data } = await registerUser({ firstName, lastName, email, username, password });

        if (!ok) {
            showErrorToast(data.error || data.message || 'Registration failed');
            return { error: data.error || data.message || 'Registration failed' };
        }

        showSuccessToast('Registration successful! Please login.');
        return { success: true };

    } catch (error) {
        console.error('Registration Error:', error);
        showErrorToast('Something went wrong during registration');
        return { error: 'Something went wrong during registration' };
    }
};

// Login action (No localStorage)
export const login = ({ email, password }) => async (dispatch) => {


    try {
        const { ok, data } = await loginUser(email, password);

        if (!ok) {
            showErrorToast(data.error || 'Login failed');
            return { error: data.error || 'Login failed' };
        }

        const { user } = data;

        if (!user) {
            showErrorToast('Invalid login response.');
            return { error: 'Invalid login response.' };
        }

        dispatch(authLogin(user));


        showSuccessToast(`Login successfull! Welcome back, ${user.USERNAME}!`);
        return { success: true };

    } catch (error) {
        console.error('Login Error:', error);
        showErrorToast('Something went wrong during login');
        return { error: 'Something went wrong during login' };
    }
};

// Upload profile picture
export const uploadProfilePic = (file) => async (dispatch, getState) => {
    try {
        const { user } = getState().auth;
        const { ok, data } = await uploadProfilePicture(file, user.ID);

        if (!ok) throw new Error(data.error || 'Profile picture upload failed');

        const updatedUser = { ...user, PROFILEPIC: data.base64Image };
        dispatch(profilePicUploadSuccess(updatedUser));
        showSuccessToast(data.message || 'Profile picture updated successfully');
        return { success: true };

    } catch (error) {
        console.error('Upload error:', error);
        dispatch(profilePicUploadFailure(error.message));
        showErrorToast('Failed to update profile picture');
        return { error: error.message };
    }
};

// Remove profile picture
export const removeProfilePic = () => async (dispatch, getState) => {
    try {
        const { user } = getState().auth;
        const { ok, data } = await removeProfilePicture(user.ID);

        if (!ok) throw new Error(data.error || 'Failed to remove profile picture');

        const updatedUser = { ...user, PROFILEPIC: null };
        dispatch(profilePicRemoveSuccess(updatedUser));
        showSuccessToast(data.message || 'Profile picture removed successfully');
        return { success: true };

    } catch (error) {
        console.error('Remove Profile Picture Error:', error);
        dispatch(profilePicRemoveFailure(error.message));
        showErrorToast('Failed to remove profile picture');
        return { error: error.message };
    }
};

// Logout action (No localStorage)
export const logout = () => async (dispatch) => {
    try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    } catch (err) {
        console.error('Logout error:', err);
    }

    dispatch(authLogout());
    showSuccessToast('Logged out successfully!');
}