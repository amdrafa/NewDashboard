import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { useState } from "react";
import { decode } from "jsonwebtoken";
import { authenticated } from "./login";

interface UserProps {
  name: string;
  email: string;
  password: string;
  createdAt: string;
  companyRef?: string;
  companyName?: string;
  roles: string[];
  permissions: string[];
  expires_at?: string;
  cpf: string;
  phone: string;
}

interface UserDataProps {
  ref: {
    id: number;
  };
  ts: string;
  data: UserProps;
}

export type DecodedToken = {
  sub: string;
  iat: number;
  exp: number;
};

type User = {
  userId: string;
  name: string;
  email: string;
  roles: string[];
};

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "GET") {
      try {
        const auth = request.headers.authorization;

        const decoded = decode(auth as string) as DecodedToken;

        const email = decoded.sub;

        if (decoded.exp > new Date().getTime()) {
          return response
            .status(401)
            .json({ message: "Token expired. Please login again." });
        }

        const userData: UserDataProps = await fauna.query(
          q.If(
            q.Not(
              q.Exists(q.Match(q.Index("user_by_email"), q.Casefold(email)))
            ),
            q.Abort(`E-mail doesn't exist.`),
            q.Get(q.Match(q.Index("user_by_email"), email))
          )
        );

        if (!userData.data.expires_at) {
          userData.data.expires_at = null;
        }

        return response
          .status(200)
          .json({
            name: userData.data.name,
            email: userData.data.email,
            roles: userData.data.roles,
            permissions: userData.data.permissions,
            userId: userData.ref.id,
            driver_expiration: userData.data.expires_at,
            companyRef: userData.data.companyRef,
            companyName: userData.data.companyName,
            cpf: userData.data.cpf,
            phone: userData.data.phone,
          });
      } catch (err) {
        console.log('error when calling "me" route. ', err);
        return response.status(400).json({ error: err });
      }
    } else {
      response.setHeader("Allow", "GET");
      response.status(405).end("Method not allowed");
    }
  }
);
