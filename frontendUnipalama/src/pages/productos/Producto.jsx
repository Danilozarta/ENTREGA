import { NavLink } from "react-router-dom";
import useVenta from '../../hooks/useVenta'
import { formatearCantidad } from "../../helpers/formatearCantidad";


const Producto = ({producto} ) => {
     const { _id, nombre, precio, stock, image } = producto;
    //console.log(producto);
     const { añadirProducto } = useVenta();

    return (
        <div className="container-product-flex">
            <div className="container-product-logo">
                <NavLink to={`detalle-producto/${_id}`}>
                    <img src={image.url} alt={nombre} className="h-56 w-96 border-b" />
                </NavLink>
            </div>
            
            <NavLink
                id={_id}
                to={`detalle-producto/${_id}`}
                className="p-2 flex flex-col justify-between"
            >
                <div>
                    <p className="font-bold capitalize my-3 text-2xl">{nombre}</p>
                </div>
                <div className="my-3">
                    <p className="font-bold text-lg text-ellipsis overflow-hidden">
                        Precio : <span className="font-normal block">{formatearCantidad(precio)}</span>{" "}
                    </p>
                    <p className="font-bold text-lg">
                        Stock : <span className="font-normal">{stock}</span>{" "}
                    </p>
                </div>
            </NavLink>
            {/* <button
                type="button"
                className='bg-sky-500 text-white p-2  uppercase  font-medium w-full hover:bg-sky-700 transition-colors'
                onClick={e => añadirProducto(_id)}
            >
                 Añadir al Carrito
            </button> */}
        </div>
    );
};
export default Producto;