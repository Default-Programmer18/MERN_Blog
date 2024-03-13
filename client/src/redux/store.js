import { configureStore,combineReducers } from '@reduxjs/toolkit'
import userReducer from "./user/userSlice"
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

//combining all reducers
const rootReducer =combineReducers({
  user:userReducer,
})

const persistConfig={
  key:"root",
  storage ,
  version:1,


}

const persistedReducer=persistReducer(persistConfig,rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({serializableCheck:false}),
})
//This variable holds the persistor object created by persistStore().
//The persistor is responsible for persisting and rehydrating the Redux store's state.
export const persistor = persistStore(store)