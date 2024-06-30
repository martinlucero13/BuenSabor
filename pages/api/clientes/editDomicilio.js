import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { fromData } = req.body;
        const { data: domicilio } = await api.post(`/clientes/editDomicilio`, fromData);
        res.statusCode = 200;
        res.json(domicilio);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
