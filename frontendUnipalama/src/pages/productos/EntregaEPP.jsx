import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import FirmaDigital from '../../components/FirmaDigital';
import useAuth from "../../hooks/useAuth.jsx";

const EntregaEPP = () => {
    const navigate = useNavigate();
    const [cedula, setCedula] = useState('');
    const [trabajador, setTrabajador] = useState(null);
    const [eppEntregado, setEppEntregado] = useState('');
    const [referencia_tipo, setReferencia_tipo] = useState('');
    const [unidadesEntregadas, setUnidadesEntregadas] = useState('');
    const [nombreEntrega, setNombreEntrega] = useState('');
    const [tareaLabor, setTareaLabor] = useState('');
    const [firma, setFirma] = useState('');
    const [showOpcionesEnvio, setShowOpcionesEnvio] = useState(false);
    const [codigoInvalido, setCodigoInvalido] = useState(false);

    // Lista de referencias de EPP
    const [listaReferencias] = useState({
      '70601226': 'BATA ANTIFLUIDO MANGA LARGA',
  '70602544': 'CABEZAL CARETA ESMERILAR CON RATCHET',
  '70602553': 'CARETA PARA SOLDAR INTELIGENTE ELITE',
  '70602104': 'CARTUCHO 3M VAPORES ORGANICOS -6001',
  '70602475': 'CASCO ECO STEELPRO TIPO 1, CLASE 2 CON RATCHET (Amarillo)',
  '70602277': 'CASCO MOUNTAIN STEELPRO TIPO 2 CLASE E',
  '70602146': 'CHAPULIN EXTRALARGO TIPO JEAN',
  '70602226': 'CHAQUETA LARGA EN BAQUETA GABAN TALLA XL',
  '70602022': 'CINTA SENALIZACION PELIGRO 4" X 500 M',
  '70602423': 'FILTRO MATERIAL PARTICULADO 2097',
  '70602457': 'GAFAS DE SEGURIDAD LENTE OSCURO STEELPRO',
  '70602340': 'GAFAS JACKSON SAFETY KIMBERLY ELEMENT',
  '70602546': 'GAFAS SIERRA ELITE CLARO ANTIEMP 2803250',
  '70602038': 'GUANTE DE CARNAZA NRO 12',
  '70602110': 'GUANTE DE NITRILO N-DEX CAJA X 50 UNIDADES TALLA M',
  '70602075': 'GUANTE EN NITRILO SOLVEX 37145 TALLA 9',
  '70602418': 'GUANTE EN NITRILO SOLVEX TALLA 10',
  '70602421': 'GUANTE G40 OILS Y GREASE TALLA 10',
  '70602420': 'GUANTE G40 OILS Y GREASE TALLA 9',
  '70602145': 'GUANTE NITRILO N-DEX AZUL T.L CJ.X50',
  '70602431': 'GUANTE SOLDADOR KODIAK MCR',
  '70602288': 'GUANTE TIPO INGENIERO REFORZADO TALLA L',
  '70602289': 'GUANTE TIPO INGENIERO REFORZADO TLL. XL',
  '70602043': 'GUANTE TIPO INGENIERO SENCILLO',
  '70602474': 'MALLAMETALICA(VISOR)REPUESTO CARETA GUAD',
  '70602555': 'MANGA ANTIFLUIDO EXTRA LARGA TALLA M',
  '70602554': 'MANGA ANTIFLUIDO EXTRA LARGA TALLA S',
  '70602190': 'MONOGAFAS LENTE CLARO ANTI-IMPACTO',
  '70602494': 'OVEROL ENTERIZO ANTIFLUIDO TALLA XS',
  '70602389': 'OVEROL ENTERIZO ANTIFLUIDO TALLA L',
  '70602388': 'OVEROL ENTERIZO ANTIFLUIDO TALLA M',
  '70602387': 'OVEROL ENTERIZO ANTIFLUIDO TALLA S',
  '70602390': 'OVEROL ENTERIZO ANTIFLUIDO TALLA XL',
  '70602507': 'OVEROL ENTERIZO ANTIFLUIDO TALLA XXL',
  '70602053': 'PETO IND.PVC AMARILLO C.18 DE 80 X 1.15',
  '70602175': 'PETO SOLDADOREN CARNAZA CRUDA CAL 18',
  '70602057': 'PROTECTOR AUDITIVO CON CORDEL 9-092',
  '70602383': 'PROTECTOR AUDITIVO ISERSION SIN CORDON',
  '70602257': 'RESPIRADOR MEDIA CARA 116R6200-3M',
  '70602476': 'TAFILETE PARA CASCO ECO CON RATCHET',
  '70602079': 'VISOR PARA CARETA EN ACETATO DE CELULOSA',
  '70602283': 'VISOR POLICARBO IR 5.0 ROCKER 10VV500566',
  '70602035': 'GUANTE VAQUETA REFORZADO. TIPO PALMERO',
  '70602128': 'RESPIRADOR NOSTH N95 REF. 1835',
  '70602274': 'CANILLERA ALTA MARCA ARSEG',
  '51203033': 'CHALECO SALVAVIDAS',
  '70602493': 'ADAPTADOR SOPORTE DE VISOR PARA CASCO',
  '70602271': 'GAFA NEMESIS CLARA ANTIEMP.AF JACKSCJ144',
  '70602477': 'BARBUQUEJO 4 PUNTOS PARA CASCOS TIPO 1',
  '70602508': 'CAPUCHA TIPO PASAMONTAÑA ALGODÓN CON LOG',
  '70602461': 'OVEROL APICULTURA, TRAJE APÍCOLA',
  '51115011': 'OVEROL DRIL CON REFLECTIVOS T. L',
  '70602568': 'ARNES 4 ARG POLIUR DIELE INSAFE 8009ML-P',
  '70602563': 'ARNES CABEZA 6897 PARA FFACE SERIE 6800',
  '70602564': 'COPA PIEZA BUCONASAL 6894 FFACE SERIE 6800',
  '70602565': 'ESLINGA EN Y DIELEC CON ABSORBEDOR',
  '70602407': 'CABEZAL AJUSTABLE CARETA SOLDADOR FIBRA',
  '70602385': 'PROTECTOR AUDIT T.COPA STEELPRO-FONO CM-',
  '70602567': 'GUANTE EN NITRILO SOLVEX 37185 TALLA 10',
  '70602569': 'GUANTES BLACK JACK MCR 6944',
  '70602116': 'CARETA PARA ESMERILAR',
  '70602543': 'CASQUETE ROCKET CON RATCHET STEELPRO',
  '70602129': 'CHALECO REFLECTIVO PARA BRIGADAS',
  '70602559': 'COFIA EN TELA ANTIFLUIDO TALLA L',
  '70602558': 'COFIA EN TELA ANTIFLUIDO TALLA M',
  '70602408': 'GUANTE.VAQT ING REF.Z.EXTER.LG 14" T. L',
  '70602556': 'MANGA ANTIFLUIDO EXTRA LARGA TALLA L',
  '70602140': 'MASCARA FULL FACE OPTIL- FIT',
  '70602158': 'CARETA SOLDADOR TERMOPLÁSTEELPRO',
  '70602278': 'RESPIRADOR ZUBIOLA REF 11887610',
  '70602422': 'GAFA UVEX TIRADE TRANSP REF S4040',
  '70602511': 'CARETA MALLA METALIC+REFUERZO AJUST RATCHET',
  '70602526': 'PAVA PROTECCION EN DRIL PARA CASCO',
  '50302150': 'ESLINGA POSICIONAMIENTO REGULABLE DIELECTRICA',
  '70602545': 'GUANTE CRUSADER FLEX ANSELL 42474',
  '70602092': 'RESPIRADOR CONTRA POLVO 9010 (N95) 3M',
  '70602151': 'GUANTE DE NITRILO N-DEX AZUL T.S CJ X 50',
  '70602256': 'GUANTE TIPO INGENIERO REFORZADO',
  '70602438': 'CAMISA ROYALCONDOR REF. CMS PRTC ANTIFLU',
  '70602439': 'PANTALÓN ROYALCONDOR REF. PNT PRTC ANTIF',
  '70602041': 'GUANTE HILAZA RECUBIERT.PEPAS PVC 1 CARA'
    });
    
    const firmaDigitalRef = useRef(null);
    const { auth } = useAuth();

    useEffect(() => {
        const nombreUsuario = auth.usuario?.nombre || 'HS No Identificado';
        if (nombreUsuario) {
            setNombreEntrega(nombreUsuario);
        }
    }, [auth]);

    const handleBuscarTrabajador = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/epp/buscar-trabajador/${cedula}`);
            const data = await response.json();
            if (data.success) {
                setTrabajador(data.trabajador);
            } else {
                Swal.fire('Error', 'Trabajador no encontrado', 'error');
            }
        } catch (error) {
            console.error('Error al buscar el trabajador:', error);
            Swal.fire('Error', 'Hubo un problema al buscar el trabajador', 'error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!trabajador) {
            Swal.fire('Error', 'Debes buscar un trabajador primero', 'error');
            return;
        }

        if (!listaReferencias[eppEntregado]) {
            Swal.fire('Error', 'Código de EPP inválido', 'error');
            return;
        }

        const entrega = {
            trabajador_id: trabajador._id,
            fecha_entrega: new Date().toISOString(),
            epp_entregado: eppEntregado,
            unidades_entregadas: Number(unidadesEntregadas),
            referencia_tipo: referencia_tipo,
            nombre_hs_entrega: nombreEntrega,
            tarea_labor: tareaLabor,
            firma: firma,
        };

        try {
            const response = await fetch('http://localhost:4000/api/epp/registrar-entrega-epp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(entrega),
            });

            if (!response.ok) {
                throw new Error('Error al registrar la entrega de EPP');
            }

            setShowOpcionesEnvio(true);
        } catch (error) {
            console.error('Error al registrar la entrega de EPP:', error);
            Swal.fire('Error', error.message || 'Hubo un problema al registrar la entrega de EPP', 'error');
        }
    };

    const handleNuevaEntrega = async () => {
        try {
            if (firmaDigitalRef.current) {
                await firmaDigitalRef.current.limpiarFirmaCompleta();
            }
            
            setCedula('');
            setTrabajador(null);
            setEppEntregado('');
            setReferencia_tipo('');
            setUnidadesEntregadas('');
            setTareaLabor('');
            setFirma('');
            setShowOpcionesEnvio(false);
            setCodigoInvalido(false);
            
            if (firmaDigitalRef.current?.wacomRef?.current?.checkConnected()) {
                await firmaDigitalRef.current.wacomRef.current.clearScreen();
            }
        } catch (error) {
            console.error('Error al limpiar para nueva entrega:', error);
            Swal.fire('Error', 'No se pudo limpiar la firma', 'error');
        }
    };

    const handleVolverInicio = () => {
        navigate('/homeHs');
    };

    const handleCancelar = () => {
        navigate('/homeHs');
    };

    return (
        <div className="body-epp">
            <nav className="nav-registro">
                <ul className="menu">
                    <li><Link to="/homeHs" className="nav-link-registro">Inicio</Link></li>
                    <li><Link to="/" className="nav-link-registro">Cerrar Sesión</Link></li>
                </ul>
            </nav>

            <div className="epp-container">
                <h1 className="epp-title">Entrega de Elementos</h1>

                <div className="epp-search">
                    <input
                        type="text"
                        className="epp-input"
                        placeholder="Ingrese la cédula"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                    />
                    <button className="epp-button" onClick={handleBuscarTrabajador}>
                        Buscar
                    </button>
                </div>

                {trabajador && (
                    <div className="epp-datos">
                        <div className="epp-dato"><strong>Nombre:</strong> {trabajador.nombre}</div>
                        <div className="epp-dato"><strong>Apellido:</strong> {trabajador.apellido}</div>
                        <div className="epp-dato"><strong>Cédula:</strong> {trabajador.cedula}</div>
                    </div>
                )}

                <form className="epp-form" onSubmit={handleSubmit}>
                    <div className="epp-form-group">
                        <label>Referencia (Código):</label>
                        <input
                            type="text"
                            className="epp-input"
                            value={eppEntregado}
                            onChange={(e) => {
                                const codigo = e.target.value;
                                setEppEntregado(codigo);
                                if (listaReferencias[codigo]) {
                                    setReferencia_tipo(listaReferencias[codigo]);
                                    setCodigoInvalido(false);
                                } else {
                                    setReferencia_tipo('');
                                    setCodigoInvalido(true);
                                }
                            }}
                            required
                        />
                        <small className="input-hint">Ejemplo: 201513</small>
                        {codigoInvalido && <span className="error-message">Código no reconocido</span>}
                    </div>

                    <div className="epp-form-group">
                        <label>Elemento Entregado:</label>
                        <input
                            type="text"
                            className="epp-input"
                            value={referencia_tipo}
                            readOnly
                            placeholder="Ingrese un código válido para ver la referencia"
                        />
                    </div>

                    <div className="epp-form-group">
                        <label>Cantidad:</label>
                        <input
                            type="number"
                            className="epp-input"
                            value={unidadesEntregadas}
                            onChange={(e) => setUnidadesEntregadas(e.target.value)}
                            required
                        />
                    </div>

                    <div className="epp-form-group">
                        <label>Labor:</label>
                        <input
                            type="text"
                            className="epp-input"
                            value={tareaLabor}
                            onChange={(e) => setTareaLabor(e.target.value)}
                            required
                        />
                    </div>

                    <div className="epp-form-group">
                        <label>Firma Digital:</label>
                        <FirmaDigital 
                            ref={firmaDigitalRef}
                            onFirmaGuardada={setFirma} 
                            required 
                        />
                    </div>

                    <div className="epp-buttons">
                        <button
                            type="button"
                            className="epp-button epp-button-cancel"
                            onClick={handleCancelar}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="epp-button epp-button-add">
                            Agregar
                        </button>
                    </div>
                </form>

                {showOpcionesEnvio && (
                    <div className="opciones-envio-modal-overlay">
                        <div className="opciones-envio-modal-content">
                            <h3>¡Entrega registrada con éxito!</h3>
                            <p>¿Qué deseas hacer ahora?</p>
                            <div className="opciones-envio-botones">
                                <button 
                                    type="button" 
                                    onClick={handleNuevaEntrega}
                                    className="opcion-button nueva-entrega"
                                >
                                    Nueva Entrega
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleVolverInicio}
                                    className="opcion-button volver-inicio"
                                >
                                    Volver al Inicio
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EntregaEPP;