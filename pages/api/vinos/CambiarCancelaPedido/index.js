import api from "../../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { idPedido } = req.body;
        const { data: pedido } = await api.post(`/Productos/sumarStokIngredienteCancelado?idPedido=${idPedido}`);
        res.statusCode = 200;
        res.json(pedido);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}