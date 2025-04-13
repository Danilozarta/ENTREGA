import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Mostrar notificación de error
export const showError = (message, options = {}) => {
  toast.error(message, {
    position: options.position || "top-right",
    autoClose: options.duration || 5000,
    hideProgressBar: options.hideProgressBar || false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...options
  });
};

// Mostrar notificación de éxito
export const showSuccess = (message, options = {}) => {
  toast.success(message, {
    position: options.position || "top-right",
    autoClose: options.duration || 3000,
    hideProgressBar: options.hideProgressBar || false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...options
  });
};

// Mostrar notificación de advertencia
export const showWarning = (message, options = {}) => {
  toast.warn(message, {
    position: options.position || "top-right",
    autoClose: options.duration || 4000,
    hideProgressBar: options.hideProgressBar || false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...options
  });
};

// Mostrar notificación de información
export const showInfo = (message, options = {}) => {
  toast.info(message, {
    position: options.position || "top-right",
    autoClose: options.duration || 3000,
    hideProgressBar: options.hideProgressBar || false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...options
  });
};

// Mostrar notificación personalizada
export const showCustom = (message, type = 'default', options = {}) => {
  toast(message, {
    type: type, // 'default', 'success', 'error', 'info', 'warning'
    position: options.position || "top-right",
    autoClose: options.duration || 3000,
    hideProgressBar: options.hideProgressBar || false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    ...options
  });
};

// Cargar notificación mientras se procesa algo
export const showLoading = (message) => {
  return toast.loading(message, {
    position: "top-right"
  });
};

// Actualizar notificación de carga
export const updateLoading = (toastId, message, type, options = {}) => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: false,
    autoClose: options.duration || 3000,
    ...options
  });
};