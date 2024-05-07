import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { fromData } = req.body;
        const { data: Empleados } = await api.post(`/empleados/editEmpleados`, fromData);
        res.statusCode = 200;
        res.json(Empleados);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
