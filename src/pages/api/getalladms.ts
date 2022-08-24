import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { useState } from "react";
import { authenticated, isAdministrator } from "./login";

interface AdmProps {
  ref: string;
  ts: number;
  data: {
    name: string;
    email: string;
    companyRef: string;
    workRole: string;
    roles: string[];
  };
}

interface AdmDataProps {
  ref: string;
  ts: number;
  data: AdmProps[];
}

export default isAdministrator(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "GET") {
      try {
        const adms = await fauna.query<AdmDataProps>(
          q.Map(
            q.Paginate(q.Match(q.Index("all_users"))),
            q.Lambda((x) => q.Get(x))
          )
        );

        let allAdms = [];

        const { data } = adms;

        data.forEach((adm) => {
          if (adm.data.roles.includes("ADMINISTRATOR")) {
            allAdms.push(adm);
          }
        });

        let totalcount = allAdms.length;

        const { page, limit } = request.query;
        const per_page = Number(limit);

        const slicedData = () => {
          const pageStart = (Number(page) - 1) * per_page;
          const pageEnd = pageStart + per_page;
          const mySlicedData = allAdms.slice(pageStart, pageEnd);

          return mySlicedData;
        };

        const PaginateData = slicedData();

        return response.status(200).json({ PaginateData, totalcount });
      } catch (err) {
        console.log("Error when getting all administrators", err);

        return response.status(400).json({ err });
      }
    } else {
      response.setHeader("Allow", "GET");

      response.status(405).end("Method not allowed");
    }
  }
);
