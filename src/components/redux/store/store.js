import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/authReducer'; // Your traditional reducer

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});
export default store; 