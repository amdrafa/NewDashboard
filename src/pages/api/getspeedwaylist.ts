import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from '../../services/fauna'
import { query as q } from 'faunadb'
import { useState } from "react";
import { authenticated } from "./login";



interface speedwayProps{
    speedway: string;
    vehicles_limit: number;
    description: string;
    createdAt: string;
}


interface speedwayDataProps {
    ref: string;
    ts: string;
    data: speedwayProps[]
  }

export default authenticated (async (request: NextApiRequest, response: NextApiResponse) => {
    
    if(request.method === 'GET'){


        console.log("TEST SPEEDWAY LIST")

        
        
        try{

            

            const {data:speedways} = await fauna.query<speedwayDataProps>(
                q.Map(
                    q.Paginate(
                        q.Match(q.Index('all_speedways'))
                    ),
                    q.Lambda(x => q.Get(x))
                )
            )

            
            
            return response.status(200).json({speedways})
        }catch(err){
            console.log('error when getting speedway list', err)
            
            return false
        }
        

    }else{
        response.setHeader('Allow', 'GET')
        response.status(405).end('Method not allowed')
    }
})
    