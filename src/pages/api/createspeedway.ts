import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from '../../services/fauna'
import { query as q } from 'faunadb'
import { authenticated } from "./login";




export default authenticated (async (request: NextApiRequest, response: NextApiResponse) => {

    
    
    if(request.method === 'POST'){

        const {data:speedway, vehicles_limit, description} = request.body


        console.log("heyyyy, I am at createSpeedway api" + speedway, vehicles_limit, description)

        
        try{

            const createdAt = new Date().toLocaleDateString('EN-US', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })

            await fauna.query(
                q.Create(
                    q.Collection('speedways'),
                    { data: {speedway, vehicles_limit, description, createdAt, status: 'active'} }
                )
            )

            return response.status(200).json({message: 'Company created'})
        }catch(err){
            console.log('error when creating speedway', err)
            return response.status(400).json({message: 'Something went wrong'})
        }
        

    }else{
        response.setHeader('Allow', 'POST')
        response.status(405).end('Method not allowed')
    }
})
    