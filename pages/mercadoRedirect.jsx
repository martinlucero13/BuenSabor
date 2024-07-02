import { useEffect, useState, useRef } from "react";
import { useHistory, useRouter } from "next/router";
import api from "../src/Services/apiServices";
import Image from "next/image";
import { Button } from "react-bootstrap";

export default function MercadoRedirect() {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [finish, setFinish] = useState(false);
  const [urlParams, setUrlParams] = useState(null);

  const [error, setError] = useState(false);
  const navigate = useRouter();
  const hasSubmitted = useRef(false); // Ref to prevent multiple submissions

  async function handleSubmit(paymentDetails) {
    if (hasSubmitted.current) return; // Prevent double submission
    hasSubmitted.current = true; // Mark as submitted

    try {
      //Guardar Datos de mercado pago
      const { data: createMercadoPagoDatos } = await api.post(
        "mercadoPagoDatos/createMercadoPagoDatos",
        { fromData: paymentDetails }
      );
      if (createMercadoPagoDatos.statusCode === 200) {
        //Cambiar estado del pedido
        /*await api.post("vinos/cambiarEstado", {
          idPedido: paymentDetails.idPedido,
          estado: 1,
        });*/
        //Cambiar a pagado de la factura
        await api.post("vinos/pedidoPagado", {
          idPedido: paymentDetails.idPedido,
        });
        setFinish(true);

        // Reset form data or handle success state here
      } else {
        throw new Error("Error in API response");
      }
    } catch (error) {
      setError(true); // should be true instead of false
      console.error(error);
    } finally {
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.size != 0) {
      setUrlParams(urlParams);
    }
    window.history.pushState({}, document.title, window.location.pathname);
    const paymentId = urlParams.get("payment_id");
    const idPedido = urlParams.get("idPedido");
    window.history.replaceState(null, "", "pedidos");
    if (paymentId != null) {
      fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer TEST-3978001185920550-051420-300fa742a1c5302f9cfc57811891f3d0-1813914850`, // Replace with your access token
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const paymentDateCreated = data.date_created;
          const paymentDateApproved = data.date_approved;

          const paymentMethod = data.payment_method_id;
          const paymentType = data.payment_type_id;
          const paymentId = data.id;
          const cardNumber = data.card ? data.card.last_four_digits : null;
          const paymentStatus = data.status;

          const statusTranslation = {
            approved: "Aprobado",
            pending: "Pendiente",
            rejected: "Rechazado",
          };

          const methodTranslation = {
            visa: "Visa",
            master: "Mastercard",
            amex: "American Express",
            paypal: "PayPal",
            pagofacil: "Pago Fácil",
            account_money: "Dinero en Cuenta",
          };

          const typeTranslation = {
            credit_card: "Tarjeta de Crédito",
            debit_card: "Tarjeta de Débito",
            account_money: "Dinero en Cuenta",
            ticket: "Boleto",
            bank_transfer: "Transferencia Bancaria",
            atm: "Cajero Automático",
          };

          const paymentDetails = {
            identificadorPago: paymentId,
            fechaCreacion: paymentDateCreated,
            fechaAprobacion: paymentDateApproved,
            formaPago: typeTranslation[paymentType] || paymentType,
            metodoPago: methodTranslation[paymentMethod] || paymentMethod,
            nroTarjeta: cardNumber,
            estado: statusTranslation[paymentStatus] || paymentStatus,
            idPedido: parseInt(idPedido),
          };
          setPaymentDetails(paymentDetails);
          handleSubmit(paymentDetails); // Ensure this is called only once

          // Remove URL parameters
          navigate(window.location.pathname, { replace: true });
        })
        .catch((error) => {
          console.error("Error fetching payment details:", error);
          setError(true);
          setFinish(true);
        });
    } else {
      setError(true);
      setFinish(true);
    }
  }, [navigate]);

  return (
    <>
      <div>
        <br></br>
        <Image
          src={"/mercado-pago.png"}
          alt="Pagar con Mercado Pago"
          width={120}
          height={100}
          style={{ marginRight: "10px" }}
        />
        {urlParams == null ? (
          <h1>No hubo pedidos...</h1>
        ) : (
          <>
            {finish == false ? (
              <h1>Cargando...</h1>
            ) : (
              <>
                {paymentDetails ? (
                  <>
                    <h1>Muchas gracias por la compra de su pedido</h1>
                    <h1>Pedido #{paymentDetails.idPedido}</h1>
                  </>
                ) : (
                  <>
                    <h1>La transacción ha fallado....</h1>
                    <h1>Su pedido sigue pendiente de pago</h1>
                  </>
                )}
                <br />
                <br />

                <Button
                  style={{ fontSize: "30px" }}
                  variant="danger"
                  size="lg"
                  onClick={() => navigate.push("/pedidos")}
                >
                  Ver Pedido
                </Button>
              </>
            )}
          </>
        )}
      </div>
      <style jsx>
        {`
          div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          div section {
            width: 700px;
            height: 520px;
            margin: 0;
            padding: 0;
          }
          h1 {
            font-size: 60px;
          }
          @media and (max-width: 875px) {
            div section {
              width: 500px;
              height: 400px;
            }
            h1 {
              font-size: 40px;
            }
          }
          @media and (max-width: 620px) {
            div section {
              max-width: 300px;
              max-height: 240px;
            }
            h1 {
              font-size: 30px;
            }
          }
          @media and (max-width: 620px) {
            h1 {
              font-size: 30px;
            }
          }
          @media and (max-width: 620px) {
            h1 {
              font-size: 25px;
            }
          }
        `}
      </style>
    </>
  );
}
