import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { fromData } = req.body;
        const { data: empleados } = await api.post(`/empleados/createEmpleados`, fromData);
        res.statusCode = 200;
        res.json(empleados);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
