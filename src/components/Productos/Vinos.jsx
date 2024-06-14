import { useContext, useEffect, useState } from "react";
import TipoVino from "./TipoVino";
import UtilityContext from "../../Context/utilityContext";
import Loading from "../Loading/Loading";
import apiFeco from "../../Services/apiServices";
import ListaMarcaVinos from "./ListaMarcaVinos";
import { Modal } from "react-bootstrap";
import Lupa from "./Lupa";

export default function Vinos({ marcas }) {
    const [vinos, setVinos] = useState([])
    const [vinosFilter, setVinosFilter] = useState([])
    const { marca, setMarca, retiro } = useContext(UtilityContext)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [filter, setFilter] = useState('')
    const [precioOrden, setPrecioOrden] = useState('')

    useEffect(() => {
        handleSubmit()
        setFilter('')
        setPrecioOrden('')
    }, [marca])

    async function handleSubmit() {
        setLoading(true)
        const retira = retiro.retiro
        const { data: vinos } = await apiFeco.post('vinos', { marca, retira })
        /* console.log(vinos.data) */
        if (vinos.data) {
            setVinos(vinos.data)
            setVinosFilter(vinos.data)
        } else {
            setVinos([])
            setVinosFilter([])
        }
        setLoading(false)
    }

    function handleFilter(e) {
        const { value } = e.target
        setFilter(value)
        const vinosSearch = vinosFilter.filter(vino => vino.denominacion.includes(value.toUpperCase()))
        setVinos(vinosSearch)
    }

    function filterPrecio(e) {
        const { value } = e.target
        setPrecioOrden(value)
        let valor = ''
        /* console.log(marca) */
        marca === 'promocion' ? valor = 'PRECIODESCUENTO' : valor = 'precioVenta'
        if (value === 'menor') {
            const vinosFiltro = vinosFilter.sort((a, b) => {
                return Math.trunc(a[valor]) - Math.trunc(b[valor])
            })
            setFilter('')
            setVinos(vinosFiltro)
            setLoading(false)
            window.scrollTo(0, 0)
            return
        }
        if (value === 'mayor') {
            const vinosFiltro = vinosFilter.sort((a, b) => {
                return Math.trunc(b[valor]) - Math.trunc(a[valor])
            })
            setFilter('')
            setVinos(vinosFiltro)
            setLoading(false)
            window.scrollTo(0, 0)
            return
        }
        if (value === 'todos') {
            setFilter('')
            setVinos(vinosFilter)
            setLoading(false)
            window.scrollTo(0, 0)
            return
        }
    }

    return (
        <>
            <main>
                <ListaMarcaVinos
                    handleFilter={handleFilter}
                    setMarca={setMarca}
                    marcas={marcas}
                    filter={filter}
                    filterPrecio={filterPrecio}
                    precioOrden={precioOrden}
                    loading={loading}
                />
                {
                    loading
                        ? <div style={{ padding: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Loading message='Buscando...' fontSize={22} />
                        </div>
                        : <div>
                            {
                                vinos.length > 0
                                    ? vinos.map((vino, index) => (
                                        <TipoVino
                                            vino={vino}
                                            key={index}
                                            filter={filter}
                                            precioOrden={precioOrden}
                                            setOpen={setOpen}
                                        />
                                    ))
                                    : <section>
                                        <Lupa width={200} height={200} />
                                        <h2 style={{ marginTop: '5px', fontWeight: 'bold', color: '#E11919' }}>No hay productos.</h2>
                                    </section>
                            }
                        </div>
                }
            </main>
            {/*<Modal show={open}>
                <Modal.Body>
                    <article style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }}>
                        <strong>No se pueden mezclar productos en promocion con los demas productos en un mismo pedido.</strong>
                        <button onClick={() => setOpen(false)}>CERRAR</button>
                    </article>
                </Modal.Body>
            </Modal>*/}
            <style jsx>{`
            main{
                display: flex;
                flex-direction: row;
            }
            div{
                display: grid;
                grid-template-columns: repeat(4, 300px);
                padding: 10px;
                margin: 50px;
                margin-left: 300px;
                align-items: center;
                justify-content: center;
            }
            section{
                margin-left: 350px;
                padding: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
            }
            button{
                background-color: rgb(182, 27, 182);
                color: white;
                max-width: 210px;
                border:none;
                border-radius: 10px;
                padding: 10px;
                margin-top: 10px;
            }
            button:hover{
                background-color: rgb(189, 15, 151);
                color: black;
            }
            strong{
                text-transform:uppercase;
            }

            @media screen and (max-width: 1400px){
                div{
                    grid-template-columns: repeat(3, 300px);
                    margin-left: 300px;
                }
            }

            @media screen and (max-width: 1230px){
                div{
                    margin-left: 300px;
                    grid-template-columns: repeat(2, 350px);
                }
            }

            @media screen and (max-width: 1130px){
                div{
                    margin-left: 300px;
                    grid-template-columns: repeat(2, 350px);
                }
            }

            @media screen and (max-width: 930px){
                div{
                    grid-template-columns: repeat(1, 300px);
                }
            }

            @media screen and (max-width: 650px){
                div{
                    grid-template-columns: repeat(1, 300px);
                    margin-left: 50px;
                }
                main{
                    display: flex;
                    flex-direction: column;
                    align-items:center;
                }
                section{
                    margin-left: 30px;
                    padding: 0;
                    width: 90%;
                    height: 90%;
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                }
            }
            `}</style>
        </>
    )
}
