import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from '../../services/fauna'
import { query as q } from 'faunadb'
import { useState } from "react";
import { authenticated } from "./login";



interface companyProps{
    company: string;
    cnpj: string;
    responsable_name: string;
    email: string;
    companySecretKey: string;
}


interface companyDataProps {
    ref: string;
    ts: string;
    data: companyProps[]
  }

export default authenticated (async (request: NextApiRequest, response: NextApiResponse) => {
    
    if(request.method === 'GET'){


        console.log("TEST GETTING ALL COMPANIES")

        
        
        try{

            

            const {data} = await fauna.query<companyDataProps>(
                q.Map(
                    q.Paginate(
                        q.Match(q.Index('all_companies'))
                    ),
                    q.Lambda(x => q.Get(x))
                )
            )

            let totalcount = data.length

            console.log(totalcount)

            let page = request.url.substr(26, 1)
            const per_page = 6
            
            const slicedData = () => {
                const pageStart = (Number(page) - 1)*(per_page)
                const pageEnd = pageStart + per_page
                const mySlicedData = data.slice(pageStart,pageEnd)
                
                
                return mySlicedData
            }
           
            
            const PaginateData = slicedData()
            
            
            return response.status(200).json({PaginateData, totalcount})
        }catch(err){
            console.log('error when getting all companies', err)
            return false
        }
        

    }else{
        response.setHeader('Allow', 'GET')
        response.status(405).end('Method not allowed')
    }
});
    