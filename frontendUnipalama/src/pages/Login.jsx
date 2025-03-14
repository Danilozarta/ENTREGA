import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import Alerta from '../components/Alerta';
import clienteAxios from '../config/axios';

import imgLogin from '../assets/Unipalma-Vertical-Slogan-01.png'; // Cambia esta ruta por la de tu logo
import fondoLogin from '../assets/neodevs.png'; // Cambia esta ruta por la de tu imagen de fondo

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alerta, setAlerta] = useState({});

    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ([email, password].includes('')) {
            setAlerta({ msg: "Todos los campos son obligatorios", error: true });
            return;
        }

        try {
            const { data } = await clienteAxios.post('usuarios/login', {
                email,
                password,
            });

            // Guardar el token y el nombre del usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('nombreUsuario', data.nombre); // Guardar el nombre del usuario

            // Verificar que el nombre no sea undefined
            console.log('Nombre del usuario recibido:', data.nombre);

            // Actualizar el estado de autenticación
            setAuth({
                token: data.token,
                nombre: data.nombre, // Asegúrate de que el backend envíe el nombre
            });

            // Redirigir al usuario
            navigate('/homeHs');
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true,
            });
        }
    };
    const { msg } = alerta;

    return (
        <div>
            {/* Header */}
            <header className="header-epp">
                <img src={imgLogin} alt="Logo Unipalma" className="logo-epp" />
            </header>

            {/* Main */}
            <main className="main-container-epp">
                <section className="login-container-epp">
                    <h1 className="h1-login-epp">Iniciar sesión</h1>
                    <form id="login-form-epp" className="form-epp" onSubmit={handleSubmit}>
                        {msg && <Alerta alerta={alerta} />}
                        <div className="input-group-epp">
                            <label className="label-login-epp" htmlFor="email">
                                Usuario
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="input-login-epp"
                                placeholder="Ingresa tu usuario"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group-epp">
                            <label className="label-login-epp" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="input-login-epp"
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="boton-entrar-epp">
                            Entrar
                        </button>
                        <button type="submit" className="boton-entrar-epp">
                            registro
                        </button>
                    </form>
                    <p id="errorMessage-epp" className="error-message-epp" style={{ display: msg ? 'block' : 'none' }}>
                        {msg}
                    </p>
                </section>
            </main>

            {/* Footer */}
            <footer className="footer-epp">
                <p>&copy; 2025 Unipalma. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Login;