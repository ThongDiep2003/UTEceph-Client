import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import DoctorSlice from './DoctorSlice.jsx';
import GeneralSlice from './GeneralSlice.jsx';

const persistConfig = {
	key: 'root',
	version: 1,
	storage,
	backList: ['general']
};

const rootReducer = combineReducers({doctor: DoctorSlice, general: GeneralSlice});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
			},
		}),
});

export let persistor = persistStore(store);