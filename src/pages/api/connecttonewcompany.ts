import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated } from "./login";
import { decode, sign } from "jsonwebtoken";
import cookie from "cookie";

type DecodedToken = {
  sub: string;
  name: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
  userId: string;
};

type DataProps = {
  ref: {
    id: string;
  };
  data: {
    company: string;
  };
};

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {
      
      const { secret_key, userId, email } = request.body;

      try {
        const auth = request.headers.authorization;
        const decoded = decode(auth as string) as DecodedToken;

        const company = await fauna.query<DataProps>(
          q.If(
            q.Exists(q.Match(q.Index("company_by_code"), secret_key)),

            q.Get(q.Match(q.Index("company_by_code"), secret_key)),
            q.Abort("Company not found")
          )
        );

        await fauna.query(
          q.Update(q.Ref(q.Collection("users"), userId), {
            data: {
              companyRef: company.ref.id,
              companyName: company.data.company,
              permissions: ["SCHEDULE"],
            },
          })
        );

        const claims = {
          sub: decoded.sub,
          name: decoded.name,
          roles: decoded.roles,
          permissions: ["SCHEDULE"],
          userId: decoded.userId,
        };

        const jwt = sign(claims, "supersecretkey", { expiresIn: "1h" });

        response.setHeader(
          "Set-Cookie",
          cookie.serialize("auth", jwt, {
            httpOnly: false,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 3600,
            path: "/",
          })
        );

        return response.status(200).json({ message: "User company updated" });
      } catch (err) {
        console.log("error when connecting user to company", err);
        return response
          .status(400)
          .json({ message: "User company not updated" });
      }
    } else {
      response.setHeader("Allow", "POST");
      response.status(405).end("Method not allowed");
    }
  }
);
