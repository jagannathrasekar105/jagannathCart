import * as actionTypes from '../action/actionTypes'; // Import action types

const initialState = {
    user: null,
    loading: false,
    profilePicError: null,
    isInitialized: false,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_LOADING:
            return { ...state, loading: true };
        case actionTypes.AUTH_LOADING_FALSE:
            return { ...state, loading: false };
        case actionTypes.AUTH_LOGIN:
            return {
                ...state,
                loading: false,
                user: action.payload,
                isInitialized: true,
            };
        case actionTypes.AUTH_LOGOUT:
            return {
                ...state,
                user: null,
                loading: false,
                isInitialized: true,
            };
        case actionTypes.PROFILE_PIC_UPLOAD_SUCCESS:
            return {
                ...state,
                user: action.payload,
                profilePicError: null,
                loading: false,
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
                loading: false,
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
