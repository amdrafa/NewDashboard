import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from '../../../services/fauna'
import { query as q } from 'faunadb'
import { authenticated } from "../login";




export default authenticated (async (request: NextApiRequest, response: NextApiResponse) => {
    
    if(request.method === 'POST'){

        const { id } = request.query;

        
        try{

            const userData = await fauna.query(
                  q.Update(q.Ref(q.Collection("speedways"), id), {
                    data: {status: "disabled"},
                  })
              );

            return response.status(200).json({message: 'Speedway disabled'})
        }catch(err){
            console.log('Error when desabling speedway', err)
            return response.status(400).json({message: 'Something went wrong'})
        }
        
    }else{
        response.setHeader('Allow', 'POST')
        response.status(405).end('Method not allowed')
    }
})
    