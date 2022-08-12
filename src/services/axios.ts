import axios from 'axios'
import { parseCookies } from 'nookies'

let {auth} = parseCookies()

export const api = axios.create({
    baseURL: 'http://ctvi-test.vercel.app/api',
    headers: {
        authorization: (auth? auth : '')
    }
})