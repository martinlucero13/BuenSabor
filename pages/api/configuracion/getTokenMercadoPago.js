import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { data: getTokenMercadoPago } = await api.get(`/configuracion/getTokenMercadoPago`);
        res.statusCode = 200;
        res.json(getTokenMercadoPago);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
