import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { useState } from "react";
import { authenticated } from "./login";

interface speedwayProps {
  speedway: string;
  vehicles_limit: number;
  description: string;
  createdAt: string;
}

interface speedwayDataProps {
  ref: {
    id: string;
  };
  ts: string;
  data: speedwayProps[];
}

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "GET") {
      try {
        const speeds = await fauna.query<speedwayDataProps>(
          q.Map(
            q.Paginate(q.Match(q.Index("all_speedways"))),
            q.Lambda((x) => q.Get(x))
          )
        );

        let totalcount = speeds.data.length;
        
        const { page, limit } = request.query;
        const per_page = Number(limit);

        const slicedData = () => {
          const pageStart = (Number(page) - 1) * per_page;
          const pageEnd = pageStart + per_page;
          const mySlicedData = speeds.data.slice(pageStart, pageEnd);

          return mySlicedData;
        };

        const PaginateData = slicedData();

        return response.status(200).json({ PaginateData, totalcount });
      } catch (err) {
        console.log("Error when getting all test tracks.", err);

        return false;
      }
    } else {
      response.setHeader("Allow", "GET");
      response.status(405).end("Method not allowed");
    }
  }
);
