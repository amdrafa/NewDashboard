import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from '../../services/fauna'
import { query as q } from 'faunadb'
import { useState } from "react";
import { authenticated } from "./login";
import { decode } from "jsonwebtoken";

export type DecodedToken = {
    sub: string;
    iat: number;
    exp: number;
    userId: number;
    
}

interface appointmentProps{
    ref: string;
    ts: string;
    data: {
        startDate: string;
        endDate: string;
        speedway: string;
        vehicle: string;
        userId: string;
    }
    
}


interface appointmentsDataProps {
    ref: string;
    ts: string;
    data: appointmentProps[]
  }

export default authenticated (async (request: NextApiRequest, response: NextApiResponse) => {
    
    if(request.method === 'GET'){


        console.log("TEST GETTING ALL USER APPOINTMENTS")

        
        
        try{

            const auth = request.headers.authorization;
                
            const decoded = decode(auth as string) as DecodedToken;

            const userId = decoded.userId;

            

            const users = await fauna.query<appointmentsDataProps>(
                q.Map(
                    q.Paginate(
                        q.Match(q.Index('all_schedules'))
                    ),
                    q.Lambda(x => q.Get(x))
                )
            )

            let allUserSchedules = []

            const {data} = users

            

            data.forEach(schedule => {
                if(Number(schedule.data.userId) == userId){
                    allUserSchedules.push(schedule)
                }
            })

            


            let totalcount = allUserSchedules.length

            console.log(totalcount)

            let page = request.url.substr(33, 1)
            console.log(page)
            const per_page = 6
            
            const slicedData = () => {
                const pageStart = (Number(page) - 1)*(per_page)
                const pageEnd = pageStart + per_page
                const mySlicedData = allUserSchedules.slice(pageStart,pageEnd)
                
                
                return mySlicedData
            }
           
            
            const PaginateData = slicedData()
            
            
            return response.status(200).json({PaginateData, totalcount})
        }catch(err){
            console.log('error when getting all user appointments', err)
            return response.status(400).json({message: "Get all user appointments failured"})
        }
        

    }else{
        response.setHeader('Allow', 'GET')
        response.status(405).end('Method not allowed')
    }
});
    