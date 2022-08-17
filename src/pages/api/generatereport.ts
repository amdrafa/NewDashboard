import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { useState } from "react";
import { decode } from "jsonwebtoken";
import { authenticated } from "./login";
import * as path from "path";

interface BusySlotsProps {
  ref: string;
  ts: number;
  data: {
    selectedSlots: string[];
    speedway: string;
    vehicle: string;
    userId: string;
    status: string;
    companyName: string;
  };
}

interface BusySlotsDataProps {
  ref: string;
  ts: string;
  data: BusySlotsProps[];
}

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    
    if (request.method === "POST") {
      const {
        company,
        companyId,
        selectedMonth,
        selectedYear
      } = request.body;

      try {

        const filteredData = [];

        const { data } = await fauna.query<BusySlotsDataProps>(
          q.Map(
            q.Paginate(q.Match(q.Index("all_busy_slots"))),
            q.Lambda((x) => q.Get(x))
          )
        );

        data.forEach(appointment => {
          if(appointment.data.companyName == company){
            filteredData.unshift(appointment)
          }
        })

       return response.status(200).json({filteredData})
      } catch (err) {
        console.log("Error when generating company report. ");
        return response.status(400).json({ error: err });
      }
    } else {
      response.setHeader("Allow", "POST");
      response.status(405).end("Method not allowed");
    }
  }
);