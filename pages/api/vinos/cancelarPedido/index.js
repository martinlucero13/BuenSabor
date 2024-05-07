import api from "../../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { NROLEG, idPedido } = req.body;
        const { data: pedido } = await api.get(`/Productos/cancelarPedido?NROLEG=${NROLEG}&idPedido=${idPedido}`);
        res.statusCode = 200;
        res.json(pedido);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}