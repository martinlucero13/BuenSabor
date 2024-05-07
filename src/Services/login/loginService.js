import Cookies from "js-cookie";
import api from "../apiServices";

export default function LoginService() {

    async function logIn({ username, password }) {
        /* console.log('llegue login service') */
        try {
            const { data: token } = await api.post('login', { username, password });
            if (token.data) return token.data.token
        } catch (error) {
            console.error(error);
        }
    }

    async function takeAddresbook({ username }) {
        const { data: user } = await api.post('usersVen', { username });
        /* console.log('usuario datos = ',user) */
        const book = user?.data.addressbook.find(a => a.an8 === user.data.defaultan8);
        /*  console.log('addresbook datos = ', book) */
        if (book.authVen === 'Y') {
            return book;
        } else {
            return null;
        }
    }

    return {
        logIn,
        takeAddresbook
    }
}
