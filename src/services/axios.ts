import axios from 'axios'
import { parseCookies } from 'nookies'

let {auth} = parseCookies()

export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        authorization: (auth? auth : '')
    }
})