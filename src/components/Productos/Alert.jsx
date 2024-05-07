import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';

export default function Alert({ show, setShow }) {

    return (
        <>
            <div>
                <Row>
                    <Col xs={10}>
                        <Toast onClose={() => setShow(false)} show={show} delay={1000} autohide>
                            <Toast.Header>
                                <strong className="me-auto">BUEN SABOR</strong>
                            </Toast.Header>
                            <Toast.Body>
                                <p> Se agrego el producto al carrito. </p>
                            </Toast.Body>
                        </Toast>
                    </Col>
                </Row>
            </div>
            <style jsx>{`
                div{
                    display:flex;
                    align-items: center;
                    flex-direction: row;
                    position: fixed;
                    top:0;
                    right: 95px;
                    margin-top: 100px;
                    width: 200px;
                    z-index: 1055;
                }
                p{
                    text-transform: uppercase;
                    font-size: 14px;
                }
            `}</style>
        </>
    );
}
