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
    ref: {
        id: string;
    }
    ts: string;
    data: speedwayProps[]
  }

export default authenticated (async (request: NextApiRequest, response: NextApiResponse) => {
    
    if(request.method === 'GET'){


        console.log("TEST GETTING ALL speedways")

        
        
        try{

            

            const speeds = await fauna.query<speedwayDataProps>(
                q.Map(
                    q.Paginate(
                        q.Match(q.Index('all_speedways'))
                    ),
                    q.Lambda(x => q.Get(x))
                )
            )
            
            let totalcount = speeds.data.length
            let page = request.url.substr(26, 1)
            
            const per_page = 6
            
            
            const slicedData = () => {
                const pageStart = (Number(page) - 1)*(per_page)
                const pageEnd = pageStart + per_page
                const mySlicedData = speeds.data.slice(pageStart,pageEnd)
                
                return mySlicedData
            }
           
            
            const PaginateData = slicedData()
    
            return response.status(200).json({PaginateData, totalcount})
        }catch(err){
            console.log('error when getting all speedways', err)
            
            return false
        }
        

    }else{
        response.setHeader('Allow', 'GET')
        response.status(405).end('Method not allowed')
    }
})
    