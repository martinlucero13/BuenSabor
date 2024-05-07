import Axios from "axios";

let urls = {
    test: process.env.NEXT_DEVELOPMENT_API_URL || 'http://localhost:4000/api',
    development: process.env.NEXT_TEST_API_URL || 'http://localhost:4000/api',
    production: process.env.NEXT_PRODUCTION_API_URL || 'https://buen.sabor.com/api'
}

const api = Axios.create({
    baseURL: urls[process.env.NODE_ENV],
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        maxContentLength: 100000000,
        maxBodyLength: 1000000000
    }
});

export default api;