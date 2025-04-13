import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imgLogin from '../assets/Unipalma-Vertical-Slogan-01.png';
import { FaArrowLeft } from "react-icons/fa"


const AccountBlocked = () => {

    // Datos de contacto
    const navigate = useNavigate();
    const redirect = 20000; // tiempo de redireccion en milisegundos
    const contactEmail = "soporteadministrador@unipalma.com"; // Email personalizado de contacto
    const contactPhone = "+57 1234567" // Telefono peronalizado de contacto
    const contactHorario = 'Lunes a Viernes, 9:00 - 18:00';
    const [seconds, setSeconds] = useState(30); // Tiempo inicial en segundos

    // Función para volver inmediatamente
    const handleReturnNow = () => {
        navigate('/'); // Redirige a la página principal
    };


    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={styles.container}>
            <div className="logo-container-unipalma">
                            <img
                                src={imgLogin}
                                alt="Logo de Unipalma"
                                className="logo-unipalma"
                            />
                        </div>
                        <div style={styles.card}>
                        <h1 style={styles.title}>⛔ Cuenta Bloqueada</h1>
                        
                        <div style={styles.messageBox}>
                            <p style={styles.message}>
                                Su cuenta ha sido suspendida temporalmente. Por favor contacte al administrador.
                            </p>
                            
                            <div style={styles.contactBox}>
                                <h3 style={styles.contactTitle}>Información de contacto:</h3>
                                <ul style={styles.contactList}>
                                    <li style={styles.contactItem}>📧 Email: {contactEmail}</li>
                                    <li style={styles.contactItem}>📞 Teléfono: {contactPhone}</li>
                                    <li style={styles.contactItem}>⏰ Horario: {contactHorario}</li>
                                </ul>
                            </div>
                        </div>

                        <div style={styles.footer}>
                            <p style={styles.countdown}>
                                Redireccionando en <span style={styles.countdownNumber}>{seconds}</span> segundos...
                            </p>
                            <button 
                                style={styles.returnButton}
                                onClick={handleReturnNow}
                            >
                                <FaArrowLeft style={{ marginRight: '8px' }} />
                                Volver ahora
                            </button>
                        </div>
                    </div>
                </div>
            );
        };

// Estilos mejorados
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'rgb(174, 174, 174)',
        padding: '20px'
    },
    card: {
        backgroundColor: 'rgb(199, 199, 199)',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        borderTop: '5px solid #ff4757'
    },
    title: {
        color: '#ff4757',
        fontSize: '2rem',
        marginBottom: '1.5rem'
    },
    messageBox: {
        marginBottom: '2rem',
        textAlign: 'left'
    },
    message: {
        fontSize: '1.1rem',
        color: '#495057',
        lineHeight: '1.6',
        marginBottom: '1.5rem'
    },
    contactBox: {
        backgroundColor:  'rgb(210, 210, 210)',
        padding: '1.5rem',
        borderRadius: '8px',
        marginTop: '1.5rem'
    },
    contactTitle: {
        fontSize: '1rem',
        color: '#495057',
        marginBottom: '1rem',
        fontWeight: '600'
    },
    contactList: {
        listStyle: 'none',
        padding: '0',
        margin: '0'
    },
    contactItem: {
        padding: '0.5rem 0',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.95rem'
    },
    footer: {
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #eee'
    },
    countdown: {
        fontSize: '1rem',
        color: '#6c757d',
        marginBottom: '1.5rem'
    },
    countdownNumber: {
        fontWeight: 'bold',
        color: '#ff4757',
        fontSize: '1.1rem'
    },
    returnButton: {
        backgroundColor: '#ff4757',
        color: 'white',
        border: 'none',
        padding: '0.75rem 1.5rem',
        borderRadius: '6px',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        width: '100%',
        maxWidth: '200px',
        ':hover': {
            backgroundColor: '#ff6b81',
            transform: 'translateY(-2px)'
        }
    }
};
export default AccountBlocked;