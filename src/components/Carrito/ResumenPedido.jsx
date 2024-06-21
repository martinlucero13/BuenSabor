import { useContext, useEffect, useState } from "react";
import PedidoContext from "../../Context/pedidoContext";
import UserContext from "../../context/userContext";
import apiFeco from "../../Services/apiServices";
import dayjs from "dayjs";
import UtilityContext from "../../Context/utilityContext";
import { Modal, Form, Button } from "react-bootstrap";
import Loading from "../Loading/Loading";
import Cookies from "js-cookie";
import Image from "next/image";

const INITIAL_STATE = {
  calle: null,
  numero: null,
  localidad: null,
};

export default function ResumenPedido() {
  const { user } = useContext(UserContext);
  const { articulos, setArticulos } = useContext(PedidoContext);
  const { setRetiro, retiro } = useContext(UtilityContext);
  const [totalNETO, setTotalNETO] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tokenMercadoPago, setTokenMercadoPago] = useState([]);
  const [transition, setTransition] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showConfirm, setShowConfirm] = useState(false);
  //console.log(user);

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
    //Cookies.set("retiro", JSON.stringify(retiro), { expires: 1 / 2 });
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
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  function totales() {
    let totalesNETO = 0;
    articulos.forEach((articulo) => {
      totalesNETO += articulo.precioVenta * articulo.cantidad;
    });
    //setTotalIVA(totalesIVA.toFixed(2))
    setTotalNETO(totalesNETO.toFixed(2));
  }

  useEffect(async () => {
    handleLoad();
  }, []);

  useEffect(() => {
    totales();
  }, [articulos]);

  async function handlePagaClick(e) {
    e.preventDefault();
    setShowConfirm(true); // Show the confirmation modal
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setOpen(true);
    const dataPedidoRegalo = [...articulos];
    const legajo = String(user.USNROLEG);
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
        totalNETO: Number(totalNETO),
        legajo: legajo,
        formaPago: 1,
        fecha,
        hora,
      };
    });
    /* console.log(dataPedido) */
    try {
      const { data: pedido } = await apiFeco.post("vinos/guardarPedido", {
        dataPedido,
      });
      if (pedido.data === 1) {
        alert("Su pedido fue realizado");
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
      setLoading(true);
      setOpen(true);
      const dataPedidoRegalo = [...articulos];
      const legajo = String(user.USNROLEG);
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
          totalNETO: Number(totalNETO),
          formaPago: 2,
          legajo: legajo,
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
            unit_price: parseFloat(totalNETO),
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
      <form onSubmit={handleSubmit}>
        <h5>Resumen del pedido</h5>
        <Form id="form-entrega">
          <div id="form-retiro-local">
            <Form.Check
              type="radio"
              id="retiro-local"
              name="forma-entrega"
              label="Retiro Local"
              value="1"
              checked={retiro.retiro == 1 ? true : false}
              onChange={handleRetiro}
            />
          </div>
          <div id="form-retiro-dom">
            <Form.Check
              type="radio"
              id="domicilio"
              name="forma-entrega"
              label="Recibir en Domicilio"
              value="2"
              checked={retiro.retiro == 2 ? true : false}
              onChange={handleRetiro}
            />
          </div>
        </Form>
        <p>
          TOTAL: <span>${totalNETO} ARS </span>
        </p>

        {(
          <>
            <button
              id="mercadoPago"
              onClick={handlePagaClick}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#00b1ea",
                border: "none",
                padding: "10px",
                borderRadius: "20px",
                cursor: "pointer",
                justifyContent: "center",
              }}
            >
              <Image
                src={"/mercado-pago.png"}
                alt="Mercado Pago"
                width={25}
                height={20}
                style={{ marginRight: "10px" }}
              />
              <span style={{ color: "white", fontWeight: "bold" }}>
                Mercado Pago
              </span>
            </button>
            {retiro.retiro === "1" ? (
              <button >Finalizar Pedido</button>
            ) : null}
          </>
        )}

        {retiro.retiro === "2" ? (
          <>
            <h5>Datos Domicilio</h5>
            <section className={transition ? "element-hidden" : "element"}>
              <label>Calle</label>
              <input
                required
                placeholder="calle"
                maxLength={200}
                onChange={handleChangeForm}
                value={formData.calle}
                type="text"
                name="nombre"
              />
            </section>
            <section className={transition ? "element-hidden" : "element"}>
              <label>N° Calle</label>
              <input
                required
                placeholder="n° calle"
                maxLength={200}
                onChange={handleChangeForm}
                value={formData.numero}
                type="number"
                min={1}
                name="nombre"
              />
            </section>
            <section className={transition ? "element-hidden" : "element"}>
              <label>Localidad</label>
              <input
                required
                placeholder="localidad"
                maxLength={200}
                onChange={handleChangeForm}
                value={formData.localidad}
                type="text"
                name="nombre"
              />
            </section>
          </>
        ) : null}
      </form>
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro de que desea continuar con el pago ?</p>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handlePagarMercadoPagoClick}>
            Confirmar
          </Button>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
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
          text-align: center;
          margin-bottom: 30px;
        }
        form button {
          margin-top: 50px;
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
        #mercadoPago {
          background-color: #00b1ea;
        }
      `}</style>
    </>
  );
}
