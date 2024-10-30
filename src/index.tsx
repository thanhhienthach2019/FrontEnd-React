import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from './components/app/App'
import { SetupCustomApi } from './http/CustomApi'
import { setupStore } from './store/store'
import 'rsuite/dist/rsuite.min.css';
import { Bounce, ToastContainer } from 'react-toastify'; // Thêm ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Nhập CSS cho react-toastify

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const { store, persistor } = setupStore()
export const customApi = SetupCustomApi(store)

root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
        </PersistGate>
    </Provider>
)
