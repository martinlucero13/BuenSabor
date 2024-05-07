import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { data: getEmpleados } = await api.get(`/empleados/getEmpleados`);
        res.statusCode = 200;
        res.json(getEmpleados);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
