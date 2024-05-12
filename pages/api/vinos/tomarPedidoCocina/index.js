import api from "../../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { data: pedidos } = await api.get(`/Productos/tomarPedidoCocina`);
        res.statusCode = 200;
        res.json(pedidos);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}