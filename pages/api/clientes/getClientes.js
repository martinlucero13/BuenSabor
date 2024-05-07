import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { data: getClientes } = await api.get(`/clientes/getClientes`);
        res.statusCode = 200;
        res.json(getClientes);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
