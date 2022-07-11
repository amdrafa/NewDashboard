import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from '../../services/fauna'
import { query as q } from 'faunadb'
import { useState } from "react";
import { authenticated } from "./login";



interface appointmentProps{
    company: string;
    cnpj: string;
    responsable_name: string;
    email: string;
    companySecretKey: string;
}


interface appointmentsDataProps {
    ref: string;
    ts: string;
    data: appointmentProps[]
  }

export default authenticated (async (request: NextApiRequest, response: NextApiResponse) => {
    
    if(request.method === 'GET'){


        console.log("TEST GETTING ALL COMPANIES")

        
        
        try{

            

            const {data} = await fauna.query<appointmentsDataProps>(
                q.Map(
                    q.Paginate(
                        q.Match(q.Index('all_schedules'))
                    ),
                    q.Lambda(x => q.Get(x))
                )
            )

            let totalcount = data.length

            console.log(totalcount)

            let page = request.url.substr(33, 1)
            console.log(page)
            const per_page = 6
            
            const slicedData = () => {
                const pageStart = (Number(page) - 1)*(Number(per_page))
                const pageEnd = pageStart + Number(per_page)
                const mySlicedData = data.slice(pageStart,pageEnd)
                
                
                return mySlicedData
            }
           
            
            const PaginateData = slicedData()
            
            
            return response.status(200).json({PaginateData, totalcount})
        }catch(err){
            console.log('error when getting all user appointments', err)
            return false
        }
        

    }else{
        response.setHeader('Allow', 'GET')
        response.status(405).end('Method not allowed')
    }
});
    