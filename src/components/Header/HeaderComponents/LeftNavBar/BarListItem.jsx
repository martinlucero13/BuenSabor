import ButtonAndIcon from './ButtonAndIcon';

export default function BarListItem({ title, iconData, show, handleShow }) {

    return <>
        <ul>
            <h5>{title}</h5>
            {iconData.map(icon => (
                <li onClick={handleShow} key={icon.name}>
                    <ButtonAndIcon
                        handleShow={handleShow}
                        link={icon.link}
                        name={icon.name}
                        IconName={icon.IconName}
                    />
                </li>
            ))}
        </ul>
        <style jsx>{`
                ul{
                    display: ${show ? 'flex' : 'none'};
                    list-style: none;
                    flex-direction: column;
                    align-items: start;
                    padding: 10px;
                    width:100%;
                    position:relative;
                }
                li{
                    width: 100%;
                    display:flex;
                    flex-direction:column;
                    margin: 2px;
                    padding: 7px;
                    border-radius: 10px;
                    transition: all .5s
                }
                ul::after{
                    display:flex;
                    align-items:start;
                    justify-content:flex-start;
                    content: "";
                    width: 100%;
                    height: 2px;
                    border-radius: 10px;
                    background-color:grey;
                    position:absolute;
                    bottom:0;
                    left:0;
                }
                li article{
                    display:flex;
                    flex-direction: row;
                    align-items: center;
                }
                li:hover{
                    color:black;
                    background-color: rgb(182, 27, 182);
                    cursor:pointer;
                }
                p{
                    margin:0 0 0 12px;
                    padding:0;
                }
                h5{
                    margin-left: 2px;
                }
            `}</style>
    </>
}
