import { useContext, useEffect, useState } from "react";
import PedidoContext from "../../Context/pedidoContext";
import UserContext from "../../context/userContext";
import apiFeco from "../../Services/apiServices";
import dayjs from "dayjs";
import { useRouter } from "next/router";

import UtilityContext from "../../Context/utilityContext";
import { Modal, Form, Button } from "react-bootstrap";
import Loading from "../Loading/Loading";
import Cookies from "js-cookie";
import Image from "next/image";

const INITIAL_STATE = {
  idDomicilio: null,
  calle: "",
  numero: "",
  localidad: "",
};

export default function ResumenPedido() {
  const { user } = useContext(UserContext);
  const { articulos, setArticulos } = useContext(PedidoContext);
  const [retiro, setRetiro] = useState(0);
  const [formaPago, setFormaPago] = useState(0);
  const [totalIVA, setTotalIVA] = useState(0);
  const [totalNETO, setTotalNETO] = useState(0);
  const [descuento, setDescuento] = useState(0);
  const [finalizarPedido, setFinalizarPedido] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenMercadoPago, setTokenMercadoPago] = useState([]);
  const [transition, setTransition] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useRouter();

  function handleChangeForm(event) {
    const { name, value } = event.target;
    if (name === "type") {
      setTransition(true);
      setFormData({ ...INITIAL_STATE, [name]: value });
      return;
    }
    setFormData({ ...formData, [name]: value });
  }
  async function takeNROLEG() {
    const token = Cookies.get("tokenColaboradores");
    const { data } = await apiFeco.post("user", { token });
    return data.USNROLEG ? data.USNROLEG : null;
  }
  function handleRetiro(e) {
    const retiro = { retiro: e.target.value };
    setRetiro(retiro);
    if (e.target.value == 1) {
      handleCalcularDescuento();
    } else {
      setFormaPago(2);

      setDescuento(0);
    }
    //Cookies.set("retiro", JSON.stringify(retiro), { expires: 1 / 2 });
  }

  function handleFormaPago(e) {
    const formaPago2 = e.target.value;
    setFormaPago(formaPago2);
  }

  async function handleLoad() {
    setLoading(true);
    try {
      const NROLEG = await takeNROLEG();
      const { data: tokenMercadoPago } = await apiFeco.post(
        "configuracion/getTokenMercadoPago",
        { NROLEG }
      );
      setTokenMercadoPago(tokenMercadoPago.data[0].tokenMercadoPago);
      const { data: getDomicilio } = await apiFeco.post(
        "clientes/getDomicilio",
        {
          idUsuario: user.USNROLEG,
        }
      );
      console.log(getDomicilio.data[0]);
      setFormData(getDomicilio.data[0]);
      console.log(formData);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  function totales() {
    let totalesIVA = 0;
    let totalesNETO = 0;
    /*articulos.forEach(articulo => {
            totalesIVA += articulo.precioVenta * articulo.cantidad
        })*/
    articulos.forEach((articulo) => {
      totalesNETO += articulo.precioVenta * articulo.cantidad;
    });
    //setTotalIVA(totalesIVA.toFixed(2))
    setTotalNETO(totalesNETO.toFixed(2));
  }

  function handleCalcularDescuento() {
    setDescuento(((totalNETO * 10) / 100).toFixed(2));
  }

  useEffect(async () => {
    handleLoad();
  }, []);

  useEffect(() => {
    totales();
  }, [articulos]);

  useEffect(() => {
    if (retiro.retiro === "1") {
      handleCalcularDescuento();
    }
  }, [totalNETO]);

  useEffect(() => {
    if (totalIVA > user.credito) {
      setFinalizarPedido(false);
    } else {
      setFinalizarPedido(true);
    }
  }, [totalIVA]);

  async function handlePagaClick(e) {
    e.preventDefault();
    setShowConfirm(true); // Show the confirmation modal
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setShowConfirm(false);

    setLoading(true);
    setOpen(true);
    const dataPedidoRegalo = [...articulos];
    const legajo = String(user.USNROLEG);
    //const CONDICIONPAGO = verCondicion(articulos[0])
    //const tipPed = articulos[0].tipPed
    //const impuesto = totalNETO * 0.21
    const hora = dayjs().format("HHmmss");
    const fecha = dayjs().format("DDMMYYYY");
    const origen = selectOrigin();
    const dataFiltroRegalo = dataPedidoRegalo.filter((data) => data !== null);
    const dataPedido = dataFiltroRegalo.map((articulo) => {
      const equivalencia = equivalencias(articulo);
      return {
        ...articulo,
        cantidad: articulo.cantidad,
        retiro: retiro.retiro,
        //tipPed,
        //origen,
        //totalIVA: Number(totalIVA),
        subtotal: Number(totalNETO),
        descuento: Number(descuento),
        totalNETO: Number(totalNETO - descuento),
        legajo: legajo,
        formaPago: 1,
        //impuesto: Number(impuesto.toFixed(2)),
        fecha,
        hora,
        domicilio: retiro.retiro === "2" ? formData.idDomicilio : null,
        //CONDICIONPAGO,
        //EQUI_LIT: Math.round(equivalencia.EQUI_LIT),
        //EQUI_PESO: Math.round(equivalencia.EQUI_PESO),
        //EQUI_UN: Math.round(equivalencia.EQUI_UN),
      };
    });
    /* console.log(dataPedido) */
    try {
      const { data: pedido } = await apiFeco.post("vinos/guardarPedido", {
        dataPedido,
      });
      if (pedido.data === 1) {
        navigate.push("/pedidos");

        //alert("Su pedido fue realizado");
        setOpen(false);
        setArticulos([]);
      } else {
        alert("Error al realizar su pedido, intente de nuevo por favor");
        setLoading(false);
        setOpen(false);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Error al realizar su pedido, intente de nuevo en unos minutos");
      setOpen(false);
      setLoading(false);
    }
  }

  function verCondicion(articulo) {
    const date = dayjs().format("YYYY-MM-DD");
    if (articulo.tipPed === "SB") {
      /* return '060' */
      return "065";
    } else if (date <= "2022-12-30" && date >= "2022-11-18") {
      return "007";
    } else {
      return "003";
    }
  }

  function equivalencias(articulo) {
    let EQUI_LIT = 0;
    let EQUI_PESO = 0;
    let EQUI_UN = 0;
    if (articulo.OPE_LIT === "MUL") {
      EQUI_LIT = articulo.cantidad * articulo.EQUI_LIT * 10000;
    } else {
      EQUI_LIT = (articulo.cantidad / articulo.EQUI_LIT) * 10000;
    }

    if (articulo.OPE_PESO === "MUL") {
      EQUI_PESO = articulo.cantidad * articulo.EQUI_PESO * 10000;
    } else {
      EQUI_PESO = (articulo.cantidad / articulo.EQUI_PESO) * 10000;
    }

    if (articulo.OPE_UN === "MUL") {
      EQUI_UN = articulo.cantidad * articulo.EQUI_UN * 10000;
    } else {
      EQUI_UN = (articulo.cantidad / articulo.EQUI_UN) * 10000;
    }

    return { EQUI_LIT, EQUI_PESO, EQUI_UN };
  }

  function selectOrigin() {
    if (retiro.retiro === "1") {
      return "1";
    }
    if (retiro.retiro === "2") {
      return "2";
    }
  }

  async function handlePagarMercadoPagoClick(e) {
    e.preventDefault();
    if (retiro !== null) {
      setShowConfirm(false);

      setLoading(true);
      setOpen(true);
      if (retiro.retiro === "2") {
        const { data: saveReintegrate } = await api.post(
          "clientes/editDomicilio",
          { fromData: dataToSend }
        );
      }
      if (saveReintegrate.statusCode !== 200) {
        alert("Algo fallo en el cambio de domicilio");
        return;
      }
      const dataPedidoRegalo = [...articulos];
      const legajo = String(user.USNROLEG);
      //const CONDICIONPAGO = verCondicion(articulos[0])
      //const tipPed = articulos[0].tipPed
      //const impuesto = totalNETO * 0.21
      const hora = dayjs().format("HHmmss");
      const fecha = dayjs().format("DDMMYYYY");
      const origen = selectOrigin();
      const dataFiltroRegalo = dataPedidoRegalo.filter((data) => data !== null);
      const dataPedido = dataFiltroRegalo.map((articulo) => {
        const equivalencia = equivalencias(articulo);
        return {
          ...articulo,
          cantidad: articulo.cantidad,
          retiro: retiro.retiro,
          subtotal: Number(totalNETO),
          descuento: Number(descuento),
          totalNETO: Number(totalNETO - descuento),
          formaPago: 2,
          legajo: legajo,
          domicilio: retiro.retiro === "2" ? formData.idDomicilio : null,
          fecha,
          hora,
        };
      });
      try {
        const { data: pedido } = await apiFeco.post("vinos/guardarPedido", {
          dataPedido,
        });
        if (pedido.data === 1) {
          //setOpen(false);
          //idPedido
        } else {
          alert("Error al realizar su pedido, intente de nuevo por favor");
          setLoading(false);
          setOpen(false);
          return;
        }
        //setLoading(false);
      } catch (error) {
        console.error(error);
        alert("Error al realizar su pedido, intente de nuevo en unos minutos");
        setOpen(false);
        setLoading(false);
        return;
      }
      const { data: data } = await apiFeco.post("vinos/ultimoPedido", {});
      var idPedido = data.data[0].idPedido;
      console.log(idPedido);
      const preferenceData = {
        items: [
          {
            title: "Mi Pedido",
            unit_price: parseFloat((totalNETO - descuento).toFixed(2)),
            quantity: 1,
          },
        ],
        /*payment_methods: {
        excluded_payment_methods: [{ id: "visa" }],
        excluded_payment_types: [{ id: "atm" }],
      },*/
        back_urls: {
          success: `http://localhost:4000/mercadoRedirect?idPedido=${idPedido}`,
          failure: `http://localhost:4000/mercadoRedirect?idPedido=${idPedido}`,
          pending: `http://localhost:4000/mercadoRedirect?idPedido=${idPedido}`,
        },
        auto_return: "approved",
      };

      // Crear la preferencia de pago
      fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenMercadoPago,
        },

        body: JSON.stringify(preferenceData),
      })
        .then((response) => response.json())
        .then((data) => {
          const initPoint = data.init_point;

          window.location.href = initPoint;
          setArticulos([]);
        })
        .catch((error) => {
          // Manejar el error en caso de fallo en la creación de la preferencia
          console.error(error);
        });
    }
  }

  return (
    <>
      <div></div>
      <form onSubmit={handlePagaClick}>
        <p className="separator">
          SUBTOTAL: <span>${totalNETO} ARS </span>
        </p>
        <p className="separator">
          DESCUENTO:{" "}
          <span>{descuento != 0 ? "$" + descuento + " ARS" : "-"}</span>
        </p>
        <p className="separator">
          <span>TOTAL:</span>{" "}
          <span>${(totalNETO - descuento).toFixed(2)} ARS </span>
        </p>
        <hr className="straight-line" />
        <p>Seleccionar:</p>
        <div className="form-retiro">
          <Form.Check
            required
            type="radio"
            id="retiro-local"
            name="forma-entrega"
            label="Retiro Local 10% OFF"
            value="1"
            checked={retiro.retiro == 1 ? true : false}
            onChange={handleRetiro}
          />
        </div>
        <div className="form-retiro">
          <Form.Check
            required
            type="radio"
            id="domicilio"
            name="forma-entrega"
            label="Recibir en Domicilio"
            value="2"
            checked={retiro.retiro == 2 ? true : false}
            onChange={handleRetiro}
          />
        </div>
        {retiro.retiro == "2" ? (
          <>
            <br />
            <section className={transition ? "element-hidden" : "element"}>
              <label>Calle:</label>
              <input
                required
                placeholder="calle"
                maxLength={200}
                onChange={handleChangeForm}
                value={formData.calle}
                type="text"
                name="calle"
              />
            </section>
            <section className={transition ? "element-hidden" : "element"}>
              <label>N° Calle:</label>
              <input
                required
                placeholder="n° calle"
                maxLength={200}
                onChange={handleChangeForm}
                value={formData.numero}
                type="number"
                min={1}
                name="numero"
              />
            </section>
            <section className={transition ? "element-hidden" : "element"}>
              <label>Localidad:</label>
              <input
                required
                placeholder="localidad"
                maxLength={200}
                onChange={handleChangeForm}
                value={formData.localidad}
                type="text"
                name="localidad"
              />
            </section>
          </>
        ) : null}
        <hr className="straight-line" />
        <p>Forma de pago:</p>
        {retiro.retiro != "2" ? (
          <div className="form-retiro">
            <Form.Check
              required
              type="radio"
              label="Efectivo"
              id="efectivo"
              name="forma-pago"
              value="1"
              checked={formaPago == 1 ? true : false}
              onChange={handleFormaPago}
            />
          </div>
        ) : null}

        <div className="form-retiro">
          <Form.Check
            required
            type="radio"
            label="Mercado Pago"
            id="mercado-pago"
            name="forma-pago"
            value="2"
            checked={formaPago == 2 ? true : false}
            onChange={handleFormaPago}
          />
        </div>
        {articulos[0].tipPed === "SB" && (
          <p style={{ fontSize: "12px" }}>
            (SE REALIZARA UNA NOTA DE CREDITO POR LOS DESCUENTOS)
          </p>
        )}
        {!finalizarPedido ? (
          <strong>Crédito insuficiente para realizar el pedido</strong>
        ) : (
          <>
            <button>Confirmar Pedido</button>
          </>
        )}
      </form>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro de que desea continuar con el pago ?</p>
          <div>
            {formaPago == 1 ? (
              <Button variant="danger" onClick={handleSubmit}>
                Confirmar
              </Button>
            ) : (
              <>
                <button
                  id="mercadoPago"
                  onClick={handlePagarMercadoPagoClick}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#009EE3",
                    border: "none",
                    padding: "10px",
                    borderRadius: "0px",
                    cursor: "pointer",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={"/mercado-pago.png"}
                    alt="Pagar con Mercado Pago"
                    width={25}
                    height={20}
                    style={{ marginRight: "10px" }}
                  />
                  <span style={{ color: "white", fontWeight: "bold" }}>
                    Pagar con Mercado Pago
                  </span>
                </button>
                <span style={{ color: "#7E849B", fontSize: "14px" }}>
                  Pagá de forma segura
                </span>
              </>
            )}
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={open} centered>
        <Modal.Body>
          <div>
            {loading && (
              <Loading message="Guardando pedido..." marginLeft={-10} />
            )}
          </div>
        </Modal.Body>
      </Modal>
      <style jsx>{`
        .form-retiro {
          align-self: start;
        }
        .modal-buttons {
          display: flex;
          justify-content: center;
          gap: 10px; /* Espacio entre los botones */
          margin-top: 20px; /* Separación superior opcional */
        }
        section {
          margin-bottom: 10px;
        }
        .separator {
          display: flex;
          justify-content: space-between;
        }
        input {
          border-radius: 8px;
          width: 100%;
          border: 1px solid black;
        }
        form {
          display: flex;
          flex-direction: column;
          justify-content: center;
          background-color: #fff;
          min-width: 250px;
          width: 250px;
          padding: 20px;
          margin: 30px;
          border: solid 2px #cecaca;
          border-radius: 10px;
        }

        form p {
          margin: 0px;
        }

        form button {
          margin-top: 20px;
          height: 35px;
          width: 100%;
          background-color: #e11919;
          color: #fff;
          border: none;
          border-radius: 20px;
          transition: 0.3s;
        }
        form button:hover {
          color: black;
          background-color: #ff0000;
        }
        form span {
          font-weight: bold;
        }
        form strong {
          text-align: center;
          margin-top: 65px;
          color: red;
        }
        form h5 {
          border-bottom: 2px dotted black;
          padding-bottom: 10px;
          text-align: center;
          margin-bottom: 10px;
        }
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        div button {
          margin-top: 20px;
          height: 35px;
          width: 50%;
          background-color: rgb(138, 13, 111);
          color: #fff;
          border: none;
          border-radius: 20px;
          transition: 0.3s;
        }
      `}</style>
    </>
  );
}
