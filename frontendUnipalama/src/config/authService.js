export const logout = (redirectPath = '/', message = '') => {
    // Limpiar almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    
    // Redirigir con mensaje si es necesario
    if (message) {
        window.location.href = `${redirectPath}?message=${encodeURIComponent(message)}`;
    } else {
        window.location.href = redirectPath;
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
};