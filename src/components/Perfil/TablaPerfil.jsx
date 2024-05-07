import { useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import dayjs from "dayjs"
import { Trash3, PencilSquare, X, Check } from "react-bootstrap-icons"
import ClientesEdit from "../Clientes/ClientesEdit"
import UserContext from "../../context/userContext"
import api from "../../Services/apiServices"
import Loading from "../Loading/Loading"


export default function TablaPerfil() {
    const { user } = useContext(UserContext)
    const [data, setData] = useState([])
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (Object.keys(user).length) {
            handleLoad()
        }
    }, [user])

    async function handleLoad() {
        setLoading(true)
        try {
            const { data: getPerfil } = await api.post('clientes/getPerfil', { idUsuario: user.USNROLEG })
            setData(getPerfil.data)
        } catch (error) {
            setData([])
        } finally {
            setLoading(false)
        }
    }

    function handleShow() {
        setShow(!show)
        if (show) {
            handleLoad()
        }
    }

    const noData = <strong style={{ color: 'red', textAlign: 'center' }}>No se encontraron reintegros</strong>

    return (
        <>
            {
                show
                    ? <ClientesEdit
                        handleShow={handleShow}
                        datoRow={data[0]}
                    /> : <>
                        <div className="titulo">
                            <header>
                                <h1>Mi Perfil</h1>
                                <button onClick={handleShow}><PencilSquare></PencilSquare> Editar</button>
                            </header>
                        </div>
                        <div className="main">
                            <div className="datos">
                                <div><h3>Usuario: </h3><h5>{data.length > 0 ? data[0].usuario : ''}</h5></div>
                                <div><h3>Nombre: </h3><h5>{data.length > 0 ? data[0].nombre : ''}</h5></div>
                                <div><h3>Apellido: </h3><h5>{data.length > 0 ? data[0].apellido : ''}</h5></div>
                                <div><h3>telefono: </h3><h5>{data.length > 0 ? data[0].telefono : ''}</h5></div>
                                <div><h3>email: </h3><h5>{data.length > 0 ? data[0].email : ''}</h5></div>
                                <div><h3>calle: </h3><h5>{data.length > 0 ? data[0].calle : ''}</h5></div>
                                <div><h3>numero: </h3><h5>{data.length > 0 ? data[0].numero : ''}</h5></div>
                                <div><h3>localidad: </h3><h5>{data.length > 0 ? data[0].localidad : ''}</h5></div>
                            </div>
                        </div>
                    </>
            }
            <style jsx>{`
                header {
                    display:flex;
                    justify-content: space-between;
                }
                .main{
                    display: flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items: center;
                    padding:20px;
                }
                .titulo {
                    border: 2px solid #cecaca;
                    border-radius: 10px;
                    background-color: #fff;
                    margin: 50px 10px 0 10px;
                    box-shadow: 1px 2px 1px grey;
                }
                .datos{
                    display: flex;
                    flex-direction:column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    border: 2px solid #cecaca;
                    border-radius: 10px;
                    background-color: #fff;
                    max-width: 450px;
                    padding: 10px;
                    transition: 0.5 ease;
                    width: 90vw;
                }
                .datos div {
                    display: flex;
                    align-items: center;
                    margin-bottom: 5px; 
                }
                
                .datos h3 {
                    margin-right: 10px;
                }
                
                .datos h5 {
                    margin: 0; 
                }
                button {
                    margin: 15px;
                    background-color: rgb(138, 13, 111);
                    color: white;
                    border-radius: 20px;
                    font-size: 17px;
                    transition: 0.5s;
                    padding: 5px;
                    border: none;
                    width: 150px;
                    text-transform:uppercase;
                }
                button:hover {
                    color: black;
                    background-color: rgb(182, 27, 182);
                }
                h1 {
                    margin:15px;
                }
            `}</style>
        </>
    )
}
