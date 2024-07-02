import { useContext, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import { Trash3, PencilSquare, X, Check } from "react-bootstrap-icons";
import ClientesEdit from "../Clientes/ClientesEdit";
import UserContext from "../../context/userContext";
import api from "../../Services/apiServices";
import Loading from "../Loading/Loading";

export default function TablaPerfil() {
    const { user } = useContext(UserContext);
    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (Object.keys(user).length) {
            handleLoad();
        }
    }, [user]);

    async function handleLoad() {
        setLoading(true);
        try {
            const { data: getPerfil } = await api.post("clientes/getPerfil", {
                idUsuario: user.USNROLEG,
            });
            setData(getPerfil.data);
        } catch (error) {
            setData([]);
        } finally {
            setLoading(false);
        }
    }

    function handleShow() {
        setShow(!show);
        if (show) {
            handleLoad();
        }
    }

    const noData = (
        <strong style={{ color: "red", textAlign: "center" }}>
            No se encontraron reintegros
        </strong>
    );

    return (
        <>
            {show ? (
                <ClientesEdit handleShow={handleShow} datoRow={data[0]} />
            ) : (
                <>
                    <div className="titulo">
                        <header>
                            <h1>Mi Perfil</h1>
                            <button onClick={handleShow}><PencilSquare /> Editar</button>
                        </header>
                    </div>
                    <div className="main">
                        <div className="datos">
                            <div><h3>Usuario: </h3><h5>{data.length > 0 ? data[0].usuario : ''}</h5></div>
                            <div><h3>Nombre: </h3><h5>{data.length > 0 ? data[0].nombre : ''}</h5></div>
                            <div><h3>Apellido: </h3><h5>{data.length > 0 ? data[0].apellido : ''}</h5></div>
                            <div><h3>Telefono: </h3><h5>{data.length > 0 ? data[0].telefono : ''}</h5></div>
                            <div><h3>Email: </h3><h5>{data.length > 0 ? data[0].email : ''}</h5></div>
                            <div><h3>Calle: </h3><h5>{data.length > 0 ? data[0].calle : ''}</h5></div>
                            <div><h3>Numero: </h3><h5>{data.length > 0 ? data[0].numero : ''}</h5></div>
                            <div><h3>Localidad: </h3><h5>{data.length > 0 ? data[0].localidad : ''}</h5></div>
                        </div>
                    </div>
                </>
            )}
            <style jsx>{`
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                font-family: 'Roboto', sans-serif;
            }

            header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 10px 10px 0 0;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }

            .main {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }

            .titulo {
                width: 100%;
                max-width: 800px;
                margin: 50px auto;
                border-radius: 10px;
                background-color: #ffffff;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                overflow: hidden;
            }

            .datos {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                width: 100%;
                max-width: 800px;
                border-top: 1px solid #e9ecef;
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }

            .datos div {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                width: 100%;
            }

            .datos h3 {
                flex: 1;
                margin-right: 10px;
                color: #495057;
            }

            .datos h5 {
                flex: 2;
                color: #212529;
            }

            button {
                background-color: #E11919;
                color: white;
                border: none;
                border-radius: 20px;
                font-size: 17px;
                transition: 0.3s;
                padding: 10px 20px;
                cursor: pointer;
            }

            button:hover {
                color: black;
                background-color: #FF0000;
            }

            h1 {
                font-size: 24px;
                font-weight: 700;
                color: #212529;
            }

            @media (max-width: 400px) {
                .titulo, .datos {
                    padding: 15px;
                }

                .datos div {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .datos h3, .datos h5 {
                    margin: 5px 0;
                }
            }
        `}</style>
        </>
    );
}
