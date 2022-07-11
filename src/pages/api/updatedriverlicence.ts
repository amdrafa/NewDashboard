import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { useState } from "react";
import { decode } from "jsonwebtoken";
import { authenticated } from "./login";
import { compare, hash } from "bcrypt";


export type DecodedToken = {
  sub: string;
  iat: number;
  exp: number;
  userId: string;
};


interface DataProps {
  ref: {
    id: number;
  };
  ts: number;
  data: UserDataProps;
}

interface UserDataProps {
  name: string;
  email: string;
  password: string;
  createdAt: string;
  companyRef: string;
  roles: string[];
  userId: string;
  register_number: string;
  driver_category: string;
  expires_at: string;
}

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {
        
      console.log("Updating driver licence informations");

      const {
        register_number,
        driver_category,
        expires_at,
        email: current_email,
        userId
      } = request.body;

      console.log(register_number, driver_category, expires_at, current_email);

      try {
        const userData: DataProps = await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index("user_by_email"), q.Casefold(current_email))
              )
            ),
            q.Abort(`E-mail doesn't exist.`),
            q.Get(q.Match(q.Index("user_by_email"), current_email))
          )
        );


        const updatedData: UserDataProps = await fauna.query(
            q.If(
              q.Not(
                q.Exists(
                  q.Match(q.Index("user_by_email"), q.Casefold(current_email))
                )
              ),
              q.Abort(`E-mail is not registered.`),
              q.Update(q.Ref(q.Collection("users"), userId), {
                data: {register_number: register_number, driver_category: driver_category, expires_at: expires_at},
              })
            )
          );

        return response.status(200).json({ message: "Driver licence updated." });
      } catch (error) {
        console.log(error + "Driver licence not working");
        response.status(400).json({ message: "Driver licence not working" });
      }
    } else {
      response.setHeader("Allow", "POST");
      response.status(405).end("Method not allowed");
    }
  }
);
