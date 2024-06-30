import { useContext } from "react";
import CompraContext from "../../Context/pedidoContext";
import UtilityContext from "../../Context/utilityContext";
import Pedido from "./Pedido";

export default function ListadoPedidos() {
  const { articulos, setArticulos } = useContext(CompraContext);
  function deleteArticulo(id) {
    setArticulos(articulos.filter((articulo) => articulo.id !== id));
  }

  function modificarCantidad(id, cantidadExtra, cantidadDisponible) {
    const articuloActualizado = articulos.map((articulo) => {
      let cantidad = 0;
      if (articulo.id === id) {
        const nuevaCantidad = articulo.cantidad + cantidadExtra;
        if (nuevaCantidad < 1) {
          cantidad = 1;
        } else if (nuevaCantidad > articulo.disponible) {
          cantidad = articulo.disponible;
        } else {
          if (nuevaCantidad <= cantidadDisponible) {
            cantidad = nuevaCantidad;
          } else {
            cantidad = articulo.cantidad;
          }
        }
        return {
          ...articulo,
          cantidad,
        };
      } else {
        return articulo;
      }
    });
    setArticulos(articuloActualizado);
  }

  return (
    <>
      {articulos.map((articulo, index) => (
        <Pedido
          key={index}
          articulo={articulo}
          deleteArticulo={deleteArticulo}
          modificarCantidad={modificarCantidad}
        />
      ))}
    </>
  );
}
