import { useContext, useState, useEffect } from "react";
import Marcas from "../src/components/Marcas/Marcas";
import Vinos from "../src/components/Productos/Vinos";
import UtilityContext from "../src/Context/utilityContext";
import useUser from "../src/Hooks/useUser";
import UserContext from "../src/context/userContext";
import { useRouter } from "next/router";
import { Modal } from "react-bootstrap";
import Cookies from "js-cookie";
//import { marcas } from '../src/data'
import api from "../src/Services/apiServices";

export default function Productos() {
  const { marca, setMarca, setRetiro, retiro } = useContext(UtilityContext);
  const { checkSession } = useUser();
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [marcas, setMarcas] = useState([]);
  const navigate = useRouter();

  /*useEffect(() => {
        checkSession()
    }, [user])*/

  useEffect(() => {
    if (user?.USMARCA1 === null) {
      navigate.push("/home");
    }
  }, [user]);

  useEffect(() => {
    verificarArticulos();
    handleLoad();
  }, []);

  function verificarArticulos() {
    const articulos = Cookies.get("articulos");
    if (articulos) {
      const articulosparse = JSON.parse(articulos);
      if (articulosparse.length === 0) {
        setOpen(true);
        setMarca("");
      }
    }
  }

  async function handleLoad() {
    const todos = {
      imagen: "todos",
      id: "all",
      nombre: "todos",
    };
    try {
      const { data: getRubroProductosMenu } = await api.post(
        "rubroProductos/getRubroProductosMenu"
      );
      setMarcas([...getRubroProductosMenu.data, todos]);
    } catch (error) {
      setMarcas();
    }
  }

  function handleRetiro(e) {
    const retiro = { retiro: e.target.value };
    setRetiro(retiro);
    setDisabled(false);
    Cookies.set("retiro", JSON.stringify(retiro), { expires: 1 / 2 });
  }

  return (
    <>
      {/*<Modal
        show={open}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <div>
            <h4>Tipo Pedido:</h4>
            <select onChange={handleRetiro} defaultValue="">
              <option value="" disabled>
                Seleccione lugar de retiro
              </option>
              <option value="1">Retiro Por Sucursal</option>
              <option value="2">Llevar a Domicilio</option>
            </select>
            <button
              disabled={disabled}
              className={disabled ? "disabledButton" : "buttonRetira"}
              onClick={() => setOpen(false)}
            >
              Seleccionar
            </button>
          </div>
        </Modal.Body>
      </Modal>*/}
      {marca ? <Vinos marcas={marcas} /> : <Marcas marcas={marcas} />}
      <style jsx>{`
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 20px;
        }
        div select {
          border: solid 2px #cecaca;
          border-radius: 10px;
          padding: 5px;
          text-transform: uppercase;
        }
        div select:focus {
          outline: none;
        }
        div h5 {
          border-bottom: 2px dotted black;
          padding-bottom: 10px;
          text-align: center;
          margin-bottom: 10px;
        }
        .buttonRetira {
          margin-top: 10px;
          height: 35px;
          width: 50%;
          background-color: #e11919;
          color: #fff;
          border: none;
          border-radius: 20px;
          transition: 0.3s;
        }
        .buttonRetira:hover {
          color: black;
          background-color: #ff0000;
        }
        .disabledButton {
          margin-top: 10px;
          height: 35px;
          width: 50%;
          background-color: grey;
          color: #fff;
          border: none;
          border-radius: 20px;
          transition: 0.3s;
        }
        .disabledButton:hover {
          color: black;
        }
      `}</style>
    </>
  );
}
