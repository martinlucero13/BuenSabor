import { useEffect, useState } from "react";
import { Trash } from "react-bootstrap-icons";
import apiFeco from "../../Services/apiServices";

export default function Pedido({
  articulo,
  deleteArticulo,
  modificarCantidad,
}) {
  const [cantidad, setCantidad] = useState(0);
  const [cantidadDisponible, setCantidadDisponible] = useState(0);
  const [loading, setLoading] = useState(true);

  const url = `/${articulo.imagen}.jpg`;

  async function handleLoad() {
    setLoading(true);
    try {
      console.log(articulo);

      const { data: getCantidadDisponible } = await apiFeco.post(
        "stockProductos/getCantidadDisponibleProducto",
        { idArticuloManufacturado: articulo.idArticuloManufacturado }
      );
      setCantidadDisponible(getCantidadDisponible.data.cantidadDisponible);
      console.log(getCantidadDisponible.data.cantidadDisponible);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    handleLoad();

    setCantidad(articulo.cantidad);
  }, [articulo]);

  return (
    <>
      <main>
        <img
          src={url}
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = "./error.jpg";
          }}
        />

        <article>
          <h4>{articulo.denominacion}</h4>
          <strong>${articulo.precioVenta} ARS </strong>
          {/*<p>disponible: {Math.trunc(articulo.disponible)} unidades</p>*/}
        </article>
        <div
          style={{
            display: "inline",
            marginRight: "10%",
          }}
        >
          <div className="subtotal">
            <button
              onClick={() =>
                modificarCantidad(articulo.id, -1, cantidadDisponible)
              }
            >
              -
            </button>
            <p>{cantidad}</p>
            <button
              onClick={() =>
                modificarCantidad(articulo.id, 1, cantidadDisponible)
              }
            >
              +
            </button>
          </div>{" "}
          <div>
            <strong>Disponible: {cantidadDisponible}</strong>
          </div>
        </div>

        <div>
          <strong>${articulo.precioVenta * cantidad} ARS</strong>
        </div>
        <section>
          <Trash
            style={{
              color: "red",
              width: "25px",
              height: "25px",
            }}
            onClick={() => deleteArticulo(articulo.id)}
          />
        </section>
      </main>{" "}
      <style jsx>{`
        .button-volver {
        }
        .subtotal {
          margin: 3%;
          width: 5.5rem;
          height: 1.7rem;
          border: 1px solid gray;
          border-radius: 4rem;
        }
        .subtotal button {
          margin: 0px !important;
          border: 0px !important;
        }
        .subtotal p {
          margin: 0px !important;
          color: black !important;
          padding-left: 5px !important;
          padding-right: 5px !important;
        }
        main {
          width: 800px;
          height: 100px;
          display: flex;
          flex-direction: row;
          align-items: center;
          border: 2px solid #cecaca;
          border-radius: 10px;
          background-color: #fff;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        main img {
          width: 80px;
          height: 90%;
          margin: 15px;
          padding: 0;
          border-radius: 10px;
        }
        main article {
          flex-direction: column;
          text-transform: uppercase;
          padding: 10px;
          margin-top: 15px;
          width: 43%;
        }
        main article h4 {
          font-weight: normal;
          font-size: 16px;
          max-width: 420px;
          width: 420px;
        }
        main article p {
          margin-top: 3px;
        }
        main div {
          display: flex;
          flex-direction: row;
          justify-content: center;
        }
        main div button {
          margin: 5px;
          padding: 0;
          border-radius: 9999px;
          width: 25px;
          height: 25px;
          background: none;
          color: #000;
          border: 2px solid #000;
          font-weight: bold;
          transition: 0.3s;
        }
        main div button:hover {
          background-color: #e6e6e6;
        }
        main div p {
          margin: 3px;
          padding: 0;
          font-size: 20px;
          color: rgb(182, 27, 182);
        }
        main section {
          height: 30px;
          width: 30px;
          margin-top: 5px;
          margin-left: 40px;
          cursor: pointer;
        }

        @media screen (max-width: 800px) {
          main {
            display: flex;
            width: 330px;
            height: 350px;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          main section {
            margin-top: 10px;
            margin-left: 10px;
            height: 30px;
            width: 30px;
          }
          main article {
            flex-direction: row;
            text-transform: uppercase;
            max-width: 100%;
            padding: 0px;
            margin-top: 15px;
          }
          main article {
            text-align: center;
          }
          main article h4 {
            max-width: 100%;
          }
          main img {
            width: 80px;
            height: 30%;
          }
        }
      `}</style>
    </>
  );
}
