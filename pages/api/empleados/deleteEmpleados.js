import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { idUsuario } = req.body;
        const { data: Empleados } = await api.put(`/empleados/deleteEmpleados?idUsuario=${idUsuario}`);
        res.statusCode = 200;
        res.json(Empleados);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
