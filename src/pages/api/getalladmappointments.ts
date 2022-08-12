import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { useState } from "react";
import { authenticated } from "./login";

interface appointmentProps {
  data: {
    selectedSlots: string[];
    speedway: string;
    companyName: string;
    vehicle: string;
    userId: string;
    status: string;
  };
}

interface appointmentsDataProps {
  ref: string;
  ts: string;
  data: appointmentProps[];
}

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "GET") {

      try {
        const { data } = await fauna.query<appointmentsDataProps>(
          q.Map(
            q.Paginate(q.Match(q.Index("all_schedules"))),
            q.Lambda((x) => q.Get(x))
          )
        );

        const filteredData = [];

        data.map((appointment) => {
          if (appointment.data.status != "pending") {
            filteredData.unshift(appointment);
          }
        });

        let totalcount = filteredData.length;

        const { page, limit } = request.query;
        const per_page = Number(limit);

        const slicedData = () => {
          const pageStart = (Number(page) - 1) * Number(per_page);
          const pageEnd = pageStart + Number(per_page);
          const mySlicedData = filteredData.slice(pageStart, pageEnd);

          return mySlicedData;
        };

        const PaginateData = slicedData();

        return response.status(200).json({ PaginateData, totalcount });
      } catch (err) {
        console.log("Error when getting all adm appointments", err);
        return response.status(400).json({err});;
      }
    } else {
      response.setHeader("Allow", "GET");
      response.status(405).end("Method not allowed");
    }
  }
);
