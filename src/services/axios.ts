import axios from 'axios'
import { parseCookies } from 'nookies'

let {auth} = parseCookies()

export const api = axios.create({
    // baseURL: 'https://localhost:3000/api',
    baseURL: 'https://ctvi.vercel.app/api',
    headers: {
        authorization: (auth? auth :- '')
    }
})