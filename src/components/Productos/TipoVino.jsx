import { useContext, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import CompraContext from "../../Context/pedidoContext";
import Alert from "./Alert";
import UtilityContext from "../../Context/utilityContext";
import { Modal, Button, Card } from "react-bootstrap";
import apiFeco from "../../Services/apiServices";

export default function TipoVino({ vino, filter, precioOrden, setOpen }) {
  const { articulos, setArticulos } = useContext(CompraContext);
  const { retiro } = useContext(UtilityContext);
  const [cantidad, setCantidad] = useState(1);
  const [show, setShow] = useState(false);
  const [disabledAdd, setDisabledAdd] = useState(false);
  const [url, setUrl] = useState(`/${vino.imagen}.jpg`);
  const [openModal, setOpenModal] = useState(false);
  const [descripcionVino, setDescripcionVino] = useState("");
  const [denominacionVino, setDenominacionVino] = useState("");
  console.log(vino);

  async function handleLoad() {
    try {
      const { data: getCantidadDisponible } = await apiFeco.post(
        "stockProductos/getCantidadDisponibleProducto",
        { idArticuloManufacturado: vino.idArticuloManufacturado }
      );

      setDisabledAdd(
        getCantidadDisponible.data.cantidadDisponible > 0 ? false : true
      );
      console.log(getCantidadDisponible.data.cantidadDisponible);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleLoad();
  }, []);

  useEffect(() => {
    if (cantidad < 1) {
      setCantidad(1);
    } else {
      if (cantidad > vino.EXISTENCIAFISICA) {
        setDisabledAdd(true);
      } else {
        setDisabledAdd(false);
      }
    }
    setUrl(`/${vino.imagen}.jpg`);
  }, [cantidad, filter, precioOrden]);

  function handleVerifiy(e) {
    e.preventDefault();
    if (disabledAdd == true) {
      return;
    }
    if (articulos.length === 0) {
      handleAdd();
      return;
    } else {
      handleAdd();
    }
  }

  function handleAdd() {
    let verificarDuplicidad = 0;
    const articulosCantidad = articulos.map((articulo) => {
      let cantidadMaxima = 0;
      if (articulo.id === vino.idArticuloManufacturado) {
        verificarDuplicidad++;
        const cantidadVerificar = articulo.cantidad + cantidad;
        if (cantidadVerificar > vino.EXISTENCIAFISICA) {
          cantidadMaxima = vino.EXISTENCIAFISICA;
        } else {
          cantidadMaxima = cantidadVerificar;
        }
        return {
          ...articulo,
          cantidad: cantidadMaxima,
        };
      } else {
        return articulo;
      }
    });
    if (verificarDuplicidad > 0) {
      setArticulos(articulosCantidad);
    } else {
      const articulo = {
        ...vino,
        precio: Number(vino.precioVenta.toFixed(2)),
        descripcion: vino.DESCRIPCION,
        cantidad,
        id: vino.idArticuloManufacturado,
        tiempoEstimadoCocina: vino.tiempoEstimadoCocina,
        denominacion: vino.denominacion,
        precioVenta: vino.precioVenta,
        imagen: vino.imagen,
        descripcion: vino.descripcion,
        idRubro: vino.idRubro,
        receta: vino.receta,
        nomrub: vino.nomrub,
        //tipPed: retiro.tipPed
      };
      /* console.log(articulo) */
      setArticulos([...articulos, articulo]);
    }
    setShow(true);
    setCantidad(1);
  }

  function handleModal(type, descripcion, denominacion) {
    setOpenModal(type);
    setDescripcionVino(descripcion);
    setDenominacionVino(denominacion);
  }

  return (
    <>
      <Modal
        show={openModal}
        onHide={() => handleModal(false, "", "")}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {" "}
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body style={{ alignItems: "center" }}>
          {" "}
          <Card.Img
            variant="top"
            src={url}
            alt=""
            /*style={{
                textAlign: "-webkit-center",
                borderRadius: "20px",
                marginTop: "2px",
                cursor: "pointer",
              }}*/
            //onError={handleError}
            /*width={220}
              height={230}*/
          />
          <h2>{vino.denominacion}</h2>
          <h4>${vino.precioVenta} ARS</h4>
          <p style={{ color: "rgb(88, 80, 101)" }}>{descripcionVino}</p>
          {/*<Button
            onClick={() => handleModal(false, "", "")}
            style={{ backgroundColor: "#E11919" }}
          >
            Cerrar
            </Button>*/}
        </Modal.Body>
      </Modal>
      {
        <div>
          <form onSubmit={handleVerifiy}>
            <div
              style={{
                height: "230px",
                marginBottom: "5px",
                display: "inline-block",
                position: "relative",
              }}
              id="ContenedorImg"
            >
              <Image
                onClick={() =>
                  handleModal(true, vino.descripcion, vino.denominacion)
                }
                src={url}
                alt=""
                style={{
                  borderRadius: "20px",
                  marginTop: "2px",
                  cursor: "pointer",
                }}
                //onError={handleError}
                width={220}
                height={230}
              />
            </div>
            <article>
              <p>{vino.denominacion}</p>
            </article>
            <strong>{vino.precioVenta} ARS</strong>
            <div>
              <div
                onClick={() =>
                  disabledAdd == false ? setCantidad(cantidad - 1) : null
                }
              >
                -
              </div>
              <p>{cantidad}</p>
              <div
                onClick={
                  disabledAdd == false
                    ? cantidad < 20
                      ? () => setCantidad(cantidad + 1)
                      : null
                    : null
                }
              >
                +
              </div>
            </div>
            <button
              className={disabledAdd ? "disabledButton" : "buttonAdd"}
              disabled={disabledAdd}
            >
              {disabledAdd ? "No disponible" : "Agregar"}
            </button>
          </form>
          <Alert show={show} setShow={setShow} />
        </div>
      }
      <style jsx>{`
        #contenerModal {
          align-items: center;
        }
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 250px;
          background-color: #cecaca;
          border-radius: 15px;
          margin: 20px;
          padding: 2px;
        }
        form {
          width: 98%;
          height: 98%;
          align-items: center;
          text-align: center;
          background-color: #fff;
          border-radius: 15px;
        }
        form img {
          width: 100%;
          height: 230px;
          /* transition: transform .4s;  */
        }
        /* form img:hover{
                transform: scale(1.1); 
            } */
        #ContenedorImg {
          transition: transform 0.3s ease;
        }
        #ContenedorImg:hover {
          transform: scale(1.05);
        }
        .buttonAdd {
          margin: 20px 0;
          padding: 5px;
          border-radius: 50px;
          width: 180px;
          color: #fff;
          background-color: #e11919;
          border: none;
          transition: 0.3s;
        }
        .buttonAdd:hover {
          color: black;
          background-color: #ff0000;
        }
        .disabledButton {
          margin: 20px 0;
          padding: 5px;
          border-radius: 50px;
          width: 180px;
          color: #fff;
          background-color: grey;
          border: none;
          transition: 0.3s;
        }
        .disabledButton:hover {
          color: black;
        }
        form div {
          display: flex;
          flex-direction: row;
          justify-content: center;
          width: 100%;
          height: 20px;
          background-color: #fff;
          margin: 0;
        }
        form div div {
          margin: 5px;
          padding: 0;
          border-radius: 9999px;
          width: 30px;
          height: 30px;
          background: none;
          color: #000;
          border: 2px solid #000;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }
        form div div:hover {
          background-color: #e6e6e6;
        }
        div form div p {
          margin: 5px;
        }
        div form div span {
          position: absolute;
          left: 10%;
          bottom: 10%;
          background: #cccccc;
          padding: 3px;
          text-transform: uppercase;
          font-weight: bold;
          color: #464646;
        }
        div form article p {
          margin: 5px;
          height: 45px;
        }
      `}</style>
    </>
  );
}

/* width * height */
