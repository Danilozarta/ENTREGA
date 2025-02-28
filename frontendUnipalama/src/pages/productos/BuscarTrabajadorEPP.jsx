import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { format } from "date-fns";

const BuscarTrabajadorEPP = () => {
    const [cedula, setCedula] = useState("");
    const [trabajador, setTrabajador] = useState(null);
    const [entregas, setEntregas] = useState([]);

    // Función para buscar al trabajador y sus entregas
    const handleBuscarTrabajador = async () => {
        try {
            // Buscar al trabajador por cédula
            const responseTrabajador = await fetch(
                `http://localhost:4000/api/epp/buscar-trabajador/${cedula}`
            );
            const dataTrabajador = await responseTrabajador.json();
            console.log("Datos del trabajador:", dataTrabajador); // Depuración

            if (dataTrabajador.success) {
                setTrabajador(dataTrabajador.trabajador);

                // Buscar las entregas relacionadas al trabajador
                const responseEntregas = await fetch(
                    `http://localhost:4000/api/epp/entregas-por-trabajador/${dataTrabajador.trabajador._id}`
                );
                const dataEntregas = await responseEntregas.json();

                if (dataEntregas.success) {
                    setEntregas(dataEntregas.entregas);
                } else {
                    Swal.fire("Error", "No se encontraron entregas para este trabajador", "error");
                }
            } else {
                Swal.fire("Error", "Trabajador no encontrado", "error");
            }
        } catch (error) {
            console.error("Error al buscar el trabajador:", error);
            Swal.fire("Error", "Hubo un problema al buscar el trabajador", "error");
        }
        console.log("Datos de las entregas:", entregas);
    };

    return (
        <div className="body-epp">
            {/* Menú de navegación */}
            <nav className="nav-registro">
                <div className="hamburger-registro" id="hamburger-registro">
                    <div className="line line1"></div>
                    <div className="line line2"></div>
                </div>
                <ul id="menu" className="menu">
                    <li>
                        <Link to="/home" className="nav-link-registro">
                            Inicio
                        </Link>
                    </li>
                    <li>
                        <Link to="/" className="nav-link-registro">
                            Cerrar Sesión
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Contenedor principal */}
            <div className="epp-container">
                <h1 className="epp-title">Buscar Trabajador y Entregas de EPP</h1>

                {/* Búsqueda por cédula */}
                <div className="epp-search">
                    <input
                        type="text"
                        id="epp-cedula"
                        className="epp-input"
                        placeholder="Ingrese la cédula"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                    />
                    <button id="epp-buscar" className="epp-button" onClick={handleBuscarTrabajador}>
                        Buscar
                    </button>
                </div>

                {/* Información del trabajador */}
                {trabajador && (
                    <div id="epp-datos-trabajador" className="epp-datos">
                        <div className="epp-dato">
                            <strong>Nombre:</strong> <span id="epp-nombre">{trabajador.nombre}</span>
                        </div>
                        <div className="epp-dato">
                            <strong>Apellido:</strong>{" "}
                            <span id="epp-apellido">{trabajador.apellido}</span>
                        </div>
                        <div className="epp-dato">
                            <strong>Cédula:</strong>{" "}
                            <span id="epp-cedula-trabajador">{trabajador.cedula}</span>
                        </div>
                        <div className="epp-dato">
                            <strong>Área:</strong> <span id="epp-area">{trabajador.area}</span>
                        </div>
                        <div className="epp-dato">
                            <strong>Labor:</strong>{" "}
                            <span id="epp-labor-trabajador">{trabajador.labor}</span>
                        </div>
                    </div>
                )}

                {/* Tabla de entregas */}
                {entregas.length > 0 && (
                    <table className="epp-table epp-delivery-table">
                        <thead>
                            <tr>
                                <th className="epp-th">ITEM</th>
                                <th className="epp-th">FECHA</th>
                                <th className="epp-th">EPP ENTREGADO</th>
                                <th className="epp-th">REFERENCIA/TIPO</th>
                                <th className="epp-th">NOMBRE QUIEN ENTREGA</th>
                                <th className="epp-th">TAREA/LABOR</th>
                                <th className="epp-th">HUELLA DIGITAL</th>
                            </tr>
                        </thead>
                        <tbody>
                        {entregas.map((entrega, index) => {
                                // Validar que la fecha sea válida
                                const fechaValida = new Date(entrega.fecha_entrega);
                                const fechaFormateada = isNaN(fechaValida) ? "Fecha inválida" : format(fechaValida, "dd/MM/yyyy");

                                return (
                                    <tr key={entrega._id}>
                                        <td className="epp-td">{index + 1}</td>
                                        <td className="epp-td">
                                            <input
                                                type="text"
                                                value={fechaFormateada} // Usar la fecha validada
                                                className="epp-input"
                                                readOnly
                                            />
                                        </td>
                                        <td className="epp-td">
                                            <input
                                                type="text"
                                                value={entrega.epp_entregado}
                                                className="epp-input"
                                                readOnly
                                            />
                                        </td>
                                        <td className="epp-td">
                                            <input
                                                type="text"
                                                value={entrega.referencia_tipo}
                                                className="epp-input"
                                                readOnly
                                            />
                                        </td>
                                        <td className="epp-td">
                                            <input
                                                type="text"
                                                value={entrega.nombre_hs_entrega}
                                                className="epp-input"
                                                readOnly
                                            />
                                        </td>
                                        <td className="epp-td">
                                            <input
                                                type="text"
                                                value={entrega.tarea_labor}
                                                className="epp-input"
                                                readOnly
                                            />
                                        </td>
                                        <td className="epp-td">
                                            <div className="fingerprint-container">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="fingerprint-input"
                                                    id={`fingerprint-${index}`}
                                                />
                                                <label
                                                    htmlFor={`fingerprint-${index}`}
                                                    className="fingerprint-label"
                                                >
                                                    <img
                                                        src="placeholder-fingerprint.png"
                                                        alt="Subir huella"
                                                        className="fingerprint-image"
                                                    />
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default BuscarTrabajadorEPP;