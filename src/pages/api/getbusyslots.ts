import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from '../../services/fauna'
import { query as q } from 'faunadb'
import { useState } from "react";
import { authenticated } from "./login";



interface BusySlotsProps{
    ref: string;
    ts:number;
    data: {
        selectedSlots: string[];
        speedway: string;
        vehicle: string;
        userId: string;
    }
    
}


interface BusySlotsDataProps {
    ref: string;
    ts: string;
    data: BusySlotsProps[];
  }

export default authenticated (async (request: NextApiRequest, response: NextApiResponse) => {
    
    if(request.method === 'GET'){


        console.log("TEST GETTING ALL BUSY APPOINTMENTS")

        
        
        try{

            const busySlots = []

            const {data} = await fauna.query<BusySlotsDataProps>(
                q.Map(
                    q.Paginate(
                        q.Match(q.Index('all_busy_slots'))
                    ),
                    q.Lambda(x => q.Get(x))
                )
            )

            data.forEach(slot => {
                slot.data.selectedSlots.map(selectedSlot => {
                    busySlots.push(selectedSlot)
                })
            })
            
            return response.status(200).json({busySlots})
        }catch(err){
            console.log('error when getting all busy slots', err)
            return response.status(400).json({message: 'something went wrong'})
        }
        

    }else{
        response.setHeader('Allow', 'GET')
        response.status(405).end('Method not allowed')
    }
});
    