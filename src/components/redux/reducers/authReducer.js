import * as actionTypes from '../action/actionTypes'; // Import action types

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    profilePicError: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_LOADING:
            return { ...state, loading: true };
        case actionTypes.AUTH_LOGIN:
            return {
                ...state,
                loading: false,
                user: action.payload.userData,
                token: action.payload.token,
            };
        case actionTypes.AUTH_LOGOUT:
            return { ...state, user: null, token: null };
        case actionTypes.PROFILE_PIC_UPLOAD_SUCCESS:
            return {
                ...state,
                user: action.payload,
                profilePicError: null,
            };

        case actionTypes.PROFILE_PIC_UPLOAD_FAILURE:
            return {
                ...state,
                profilePicError: action.payload,
            };
        case actionTypes.PROFILE_PIC_REMOVE_SUCCESS:
            return {
                ...state,
                user: action.payload,
                profilePicError: null,
            };

        case actionTypes.PROFILE_PIC_REMOVE_FAILURE:
            return {
                ...state,
                profilePicError: action.payload,
            };
        default:
            return state;
    }
};

export default authReducer;
