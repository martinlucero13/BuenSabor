import { useContext } from "react"
import { useEffect, useState } from "react"
import UtilityContext from "../../Context/utilityContext"


export default function MarcasLatetal({ marcaUnica, loading }) {
    const { marca, setMarca } = useContext(UtilityContext)
    const { retiro, setRetiro } = useContext(UtilityContext)
    const [color, setColor] = useState('')

    useEffect(() => {
        if (marca === marcaUnica.id) {
            setColor('red')
        } else {
            setColor('')
        }
    }, [marca])

    function handleSetMarca() {
        if (marcaUnica.id === 'promocion') {
            setRetiro({ ...retiro, tipPed: 'SB' })
            setMarca(marcaUnica.id)
        } else {
            setRetiro({ ...retiro, tipPed: 'SO' })
            setMarca(marcaUnica.id)
        }
    }

    return (
        <>
            <button
                defaultValue={marcaUnica.nombre}
                onClick={handleSetMarca}
                style={{ color: `${color}` }}
                disabled={loading}
            >
                {marcaUnica.nombre}
            </button>
            <style jsx>{`
                button{
                    text-transform: uppercase;
                    font-size: 12px;
                    border: none;
                    background: none;
                    text-align: start;
                    margin: 2px;
                    padding: 0;
                }
                button:hover{
                    text-decoration: underline;
                    color: rgb(138, 13, 111);
                    cursor: pointer;
                }
                @media screen and (max-height: 680px){
                    p{
                        margin: 5px 0;
                    }
                }
        `}</style>
        </>
    )
}
