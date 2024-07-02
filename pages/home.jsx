import { useContext, useEffect, useState } from "react";
import CarrouselTest from "../src/components/Home/CarrouselTest";
import Informativo from "../src/components/Home/Informativo";
import ModalCambioContraseña from "../src/components/Header/HeaderComponents/ModalCambioContraseña";
import UserContext from "../src/context/userContext";
import useUser from "../src/Hooks/useUser";
import Image from "next/image";
import { useRouter } from "next/router";
export default function Home() {
  const { user } = useContext(UserContext);
  const { checkSession } = useUser();
  const [show, setShow] = useState(false);
  const title =
    "Por motivos de seguridad, se solicita acada usuario que cambie la constraseña actual.";
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useRouter();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  useEffect(() => {
    checkSession();
  }, [user]);

  useEffect(() => {
    if (user?.USMARCA1 === null) {
      setShow(true);
    }
  }, [user]);

  function handleRedirect() {
    if (user.USROL == 1) {
      navigate.push("/productos");
    }
  }

  return (
    <>
      <main>
        <CarrouselTest />
        <Informativo />
      </main>{" "}
      <br />
      <br />
      <br />
      <div
        className="containerCarta"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ marginLeft: "20px" }}>
          <Image
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleRedirect}
            style={{
              marginLeft: "0px",
              width: "280px",
              height: "280px",
              transform: isHovered
                ? "translateY(-2px) scale(1.00)"
                : "translateY(0) scale(1)",
              filter: isHovered ? "brightness(1.2)" : "brightness(1)",

              transition:
                "transform 0.3s ease-in-out, filter 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            }}
            src={"/Carta.png"}
            alt="..."
            width={200}
            height={240}
          ></Image>{" "}
          <h1
            style={{
              fontFamily: "Caveat, cursive",
              color: "white",
              textAlign: "center",
              marginRight: "15px",
            }}
          >
            VER CARTA{" "}
            <Image src={"/Flecha.png"} alt="..." width={50} height={50}></Image>{" "}
          </h1>
        </div>
        <div style={{ textAlign: "center", flex: 1 }}>
          <h1 style={{ fontFamily: "Caveat, cursive", color: "white" }}>
            ARMA TU PEDIDO
          </h1>
          <h1 style={{ fontFamily: "Caveat, cursive", color: "white" }}>
            ¡¡ LOS MEJORES PRECIOS !!
          </h1>
          <br></br>
          <Image src={"/qr.png"} alt="..." width={150} height={150}></Image>
          <h1 style={{ fontFamily: "Caveat, cursive", color: "white" }}>
            Tel: 2667182795
          </h1>
        </div>
        <div style={{ marginRight: "20px" }}>
          <Image
            src={"/hotsale.png"}
            alt="..."
            width={300}
            height={300}
          ></Image>
        </div>
      </div>
      <ModalCambioContraseña show={show} setShow={setShow} title={title} />
      <style jsx>{`
        main {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
        }

        .containerCarta {
          height: 400px;
          background: #1e1818;
          width: 100%;
        }

        @media screen and (max-width: 1310px) {
          main {
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
