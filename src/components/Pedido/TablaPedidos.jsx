import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import DataTable from "react-data-table-component";
import { ExpandedComponent, paginationOptions, noData } from "./columns";
import Loading from "../Loading/Loading";
import apiFeco from "../../Services/apiServices";
import UserContext from "../../context/userContext";
import Cookies from "js-cookie";
import { getDataFormat } from "./Helpers";
import dayjs from "dayjs";
import { Trash } from "react-bootstrap-icons";
import Image from "next/image";

export default function TablaPedidos() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [dataTable, setDataTable] = useState([]);
  const navigate = useRouter();

  useEffect(async () => {
    handleLoad();
  }, []);

  async function takeNROLEG() {
    const token = Cookies.get("tokenColaboradores");
    const { data } = await apiFeco.post("user", { token });
    console.log(data);
    return data.USNROLEG ? data.USNROLEG : null;
  }

  async function handlePagarMercadoPagoClick(e, totalCosto, idPedido) {
    e.preventDefault();
    if (window.confirm("¿Desea pagar el pedido?")) {
      const NROLEG = await takeNROLEG();

      const { data: data } = await apiFeco.post(
        "configuracion/getTokenMercadoPago",
        { NROLEG }
      );
      if (data === null) {
      } else {
        var tokenMercadoPago = data.data[0].tokenMercadoPago;

        const preferenceData = {
          items: [
            {
              title: "Mi Pedido",
              unit_price: parseFloat(totalCosto),
              quantity: 1,
            },
          ],

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
          })
          .catch((error) => {
            // Manejar el error en caso de fallo en la creación de la preferencia
            console.error(error);
          });
      }
    }
  }

  async function handleLoad() {
    setLoading(true);
    try {
      const NROLEG = await takeNROLEG();
      const { data: pedidos } = await apiFeco.post("vinos/tomarPedido", {
        NROLEG,
      });
      console.log(pedidos.data);
      const dataFormat = getDataFormat(pedidos.data);
      console.log(dataFormat);
      setDataTable(dataFormat);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  async function handleCancel(row) {
    const idPedido = row.idPedido;
    const NROLEG = await takeNROLEG();
    if (window.confirm("¿Desea cancelar el pedido?")) {
      const { data: cancelar } = await apiFeco.post("vinos/cancelarPedido", {
        NROLEG,
        idPedido,
      });
      handleLoad();
    }
  }

  const columnsTable = [
    {
      name: "N° Pedido",
      selector: (row) => row.idPedido,
      center: true,
      grow: 0.5,
      sortable: true,
    },
    {
      name: "N° Factura",
      selector: (row) => row.nrofac,
      center: true,
      grow: 0.5,
      sortable: true,
    },
    {
      name: "Fecha Pedido ",
      selector: (row) => row.FECHA,
      center: true,
      grow: 0.5,
      sortable: true,
      format: (row) => {
        const fecha = dayjs(row.FECHA).format("DD/MM/YYYY");
        return fecha;
      },
    },
    {
      name: "Hora Fin",
      selector: (row) => row.HORAFIN,
      center: true,
      grow: 0.5,
      sortable: true,
    },
    {
      name: "Lugar Retiro",
      selector: (row) => row.RETIRO,
      center: true,
      format: (row) => {
        if (row.RETIRO === 1) {
          return "Retiro Por Sucursal";
        }
        if (row.RETIRO === 2) {
          return "Llevar a Domicilio";
        }
      },
    },
    {
      name: "Forma de Pago",
      selector: (row) => row.FORMAPAGO,
      center: true,
      grow: 0.6,
      format: (row) => {
        if (row.FORMAPAGO === "1") {
          return "Efectivo";
        }
        if (row.FORMAPAGO === "2") {
          return "Mercado Pago";
        }
      },
    },
    {
      name: "Importe Facturado",
      selector: (row) => row.TOTALPEDIDO,
      center: true,
      format: (row) => {
        const TOTALPEDIDO = row.TOTALPEDIDO;
        return "$" + TOTALPEDIDO.toFixed(2);
      },
    },
    {
      name: "Estado",
      selector: (row) => row.ESTADO,
      center: true,
      grow: 0.8,
      format: (row) => {
        if (row.ESTADO === 0) {
          return (
            <>
              Pendiente
              {row.FORMAPAGO === "2" &&
                row.ESTADO !== 3 &&
                row.PAGADO === 0 && (
                  <>
                    <strong> (No Pagado)</strong>
                  </>
                )}
            </>
          );
        }
        if (row.ESTADO === 1) {
          return "Confirmado/En Preparacion";
        }
        if (row.ESTADO === 2) {
          return "Finalizado";
        }
        if (row.ESTADO === 3) {
          return "Cancelado";
        }
        if (row.ESTADO === 4) {
          return "Entregado";
        }
      },
    },
    {
      name: "Acciones",
      selector: (row) => row.ESTADO,
      grow: 1,
      center: true,
      format: (row) => {
        return (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {row.FORMAPAGO === "2" &&
                row.ESTADO !== 3 &&
                row.PAGADO === 0 && (
                  <button
                    id="mercadoPago"
                    onClick={(e) =>
                      handlePagarMercadoPagoClick(
                        e,
                        row.TOTALPEDIDO,
                        row.idPedido
                      )
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#00b1ea",
                      border: "none",
                      padding: "10px",
                      borderRadius: "20px",
                      cursor: "pointer",
                      justifyContent: "center",
                      marginRight: "10px",
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
                )}
              {(row.ESTADO === 0 && row.FORMAPAGO === "1") ||
              (row.FORMAPAGO === "2" &&
                row.PAGADO === 0 &&
                row.ESTADO !== 3) ? (
                <div onClick={() => handleCancel(row)}>
                  <Trash
                    style={{
                      color: "red",
                      width: "25px",
                      height: "25px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              ) : null}
            </div>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div>
        <DataTable
          data={dataTable}
          columns={columnsTable}
          noDataComponent={noData}
          expandableRows
          expandableRowsComponent={ExpandedComponent}
          pagination
          paginationComponentOptions={paginationOptions}
          defaultSortFieldId={3}
          defaultSortAsc={false}
          progressPending={loading}
          progressComponent={
            <Loading message="Cargando pedidos..." fontSize="20" />
          }
        />
      </div>
      <style jsx>{`
        div {
          margin: 40px 15px 5px 15px;
          box-shadow: 1px 1px 4px black;
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;
        }
      `}</style>
    </>
  );
}
