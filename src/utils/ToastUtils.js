import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Nhập CSS cho thông báo

const showToast = (type, message) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};

export const ToastUtils = {
  success: (message) => showToast('success', message),
  error: (message) => showToast('error', message),
  info: (message) => showToast('info', message),
  warn: (message) => showToast('warn', message),
};