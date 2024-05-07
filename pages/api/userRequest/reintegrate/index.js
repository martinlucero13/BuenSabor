import api from "../../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { fromData } = req.body;
        const { data: reintegrate } = await api.post(`/viaticosColaboradores/saveReintegrate`, fromData);
        res.statusCode = 200;
        res.json(reintegrate);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
