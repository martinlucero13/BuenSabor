import { useContext } from 'react'
import * as Icon from 'react-bootstrap-icons'
import Link from 'next/link'
import UtilityContext from '../../../../Context/utilityContext'

export default function ButtonAndIcon({ name, link, IconName }) {
    const { setMarca } = useContext(UtilityContext)

    const BootstrapIcon = Icon[IconName]

    function handleClick() {
        if (name === 'Marcas') {
            setMarca('')
        }
    }

    return <>
        <Link href={link} >
            <div onClick={handleClick} data-toggle="tooltip" data-placement="bottom" title={name}>
                <BootstrapIcon
                    width="30"
                    height="30"
                />
                <p>{name}</p>
            </div>
        </Link>
        <style jsx>{`
                div{
                    display:flex;
                    flex-direction: row;
                    align-items: center;
                }
                p{
                    margin:0 0 0 12px;
                    padding:0;
                }
            `}</style>
    </>
}
