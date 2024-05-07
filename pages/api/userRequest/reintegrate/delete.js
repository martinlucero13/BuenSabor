import api from "../../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { nroreint } = req.body;
        const { data: reintegrateList } = await api.put(`/viaticosColaboradores/deleteReintegrate?nroreint=${nroreint}`);
        res.statusCode = 200;
        res.json(reintegrateList);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
