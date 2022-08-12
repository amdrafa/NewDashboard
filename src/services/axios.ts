import axios from 'axios'
import { parseCookies } from 'nookies'

let {auth} = parseCookies()

export const api = axios.create({
    baseURL: 'http://ctvi-test.vercel.app//apiapi',
    headers: {
        authorization: (auth? auth : '')
    }
})