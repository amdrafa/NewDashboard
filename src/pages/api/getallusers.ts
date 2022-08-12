import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { useState } from "react";
import { authenticated } from "./login";
import { Console } from "console";

interface UserProps {
  ref: string;
  ts: string;
  data: {
    name: string;
    email: string;
    companyRef: string;
    roles: string[];
  };
}

interface UserDataProps {
  ref: string;
  ts: string;
  data: UserProps[];
}

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "GET") {
      try {
        const { data } = await fauna.query<UserDataProps>(
          q.Map(
            q.Paginate(q.Match(q.Index("all_users"))),
            q.Lambda((x) => q.Get(x))
          )
        );

        const necessaryRoles = ["USER"];

        let filteredData = [];

        data.forEach((user) => {
          const isUser = user.data.roles.includes("USER");

          if (isUser) {
            filteredData.push(user);
          }
        });

        let totalcount = filteredData.length;

        const { page, limit } = request.query;
        const per_page = Number(limit);

        const slicedData = () => {
          const pageStart = (Number(page) - 1) * per_page;
          const pageEnd = pageStart + per_page;
          const mySlicedData = filteredData.slice(pageStart, pageEnd);

          return mySlicedData;
        };

        const PaginateData = slicedData();

        return response.status(200).json({ PaginateData, totalcount });
      } catch (err) {
        console.log("Error when getting all users", err);

        return false;
      }
    } else {
      response.setHeader("Allow", "GET");

      response.status(405).end("Method not allowed");
    }
  }
);
