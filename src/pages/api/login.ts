import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import cookie from 'cookie';

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
}

export const authenticated =
  (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    verify(
      req.headers.authorization!,
      "supersecretkey",
      async function (err, decoded) {
        if (!err && decoded) {
          return await fn(req, res);
        }

        res.status(401).json({ message: "Sorry, you are not authenticated." });
      }
    );
  };

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    const { data: email, password } = request.body;

    console.log("Login starting...", email, password);

    try {
      const userData: DataProps = await fauna.query(
        q.If(
          q.Not(q.Exists(q.Match(q.Index("user_by_email"), q.Casefold(email)))),
          q.Abort(`E-mail doesn't exist.`),
          q.Get(q.Match(q.Index("user_by_email"), email))
        )
      );

      console.log(userData.ref.id)

      compare(password, userData.data.password, function (err, result) {
        if (!err && result) {
          const claims = {
            sub: userData.data.email,
            name: userData.data.name,
            roles: userData.data.roles,
            userId: userData.ref.id
          };

          const jwt = sign(claims, "supersecretkey", { expiresIn: "1h" });
          response.setHeader('Set-Cookie', cookie.serialize('auth', jwt, {
              httpOnly: false,
              secure: process.env.NODE_ENV !== 'development',
              sameSite: 'strict',
              maxAge: 3600,
              path: '/'
          }))
          
          return response.status(200).json({ message: "Welcome, correct password" });
        } else {
          return response.status(400).json({ message: "Incorrect password" });
        }
      });
    } catch (err) {
      console.log("error when adding user to database", err);
      return response.status(400).json({});
    }
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method not allowed");
  }
};
