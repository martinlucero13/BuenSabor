import { PersonCircle } from "react-bootstrap-icons"
import UserDropDown from "./UserDropDown"

export default function UserDataNavBar({ setCambioContraseña }) {
    return (
        <>
            <div className='dropdown'>
                <PersonCircle className='personCircle' width="45" height="45" />
                <div className='dropdown-content'>
                    <UserDropDown setCambioContraseña={setCambioContraseña} />
                </div>
            </div>
            <style jsx>{`
                .dropdown{
                    background-color: #E11919;
                    border: none;
                    cursor: pointer;
                    position: relative;
                    display: inline-block;
                    margin: 10px;
                    color:white;
                    margin: 0 20px 0 20px;
                    transition: all .5s;
                }
                .dropdown-content {
                    display: none;
                    position: absolute;
                    flex-direction: column;
                    align-items: center;
                    background-color: #E11919;
                    min-width: 200px;
                    right: 0;
                    padding: 10px;
                    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                    z-index: 1055;
                    transition: all .5s;
                }
                .dropdown:hover .dropdown-content {
                    display: block;
                }
            `}</style>
        </>
    )
}
