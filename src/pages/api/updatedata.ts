import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { useState } from "react";
import { decode } from "jsonwebtoken";
import { authenticated } from "./login";
import { compare, hash } from "bcrypt";

interface UserProps {
  name: string;
  email: string;
  password: string;
  createdAt: string;
  companyRef: string;
  roles: string[];
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
  userId: string;
};

type User = {
  userId: string;
  name: string;
  email: string;
  roles: string[];
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
}

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {
      console.log("Updating user informations");

      const { new_password, old_password, new_email, current_email, name: new_name, phone: new_phone, cpf: new_cpf } = request.body;

      console.log(new_cpf);

      try{
        
        const userData: DataProps = await fauna.query(
          q.If(
            q.Not(
              q.Exists(q.Match(q.Index("user_by_email"), q.Casefold(current_email)))
            ),
            q.Abort(`E-mail doesn't exist.`),
            q.Get(q.Match(q.Index("user_by_email"), current_email))
          )
        );

        
        compare(old_password, userData.data.password, function (err, result) {
        

          if (!err && result) {
            
            console.log('passwords are the same')
            hash(new_password? new_password : old_password, 10, async function (err, hash) {
              // Store hash in your password DB.

              const auth = request.headers.authorization;
              const decoded = decode(auth as string) as DecodedToken;
              const userId = decoded.userId;

              if (decoded.exp > new Date().getTime()) {
                return response
                  .status(401)
                  .json({ message: "Token expired. Please login again." });
              }

              const userData: UserDataProps = await fauna.query(
                q.If(
                  q.Not(
                    q.Exists(
                      q.Match(q.Index("user_by_email"), q.Casefold(current_email))
                    )
                  ),
                  q.Abort(`E-mail is not registered.`),
                  q.Update(q.Ref(q.Collection("users"), userId), {
                    data: {email: new_email, password: hash, name: new_name, cpf: new_cpf, phone: new_phone },
                  })
                )
              );
            });
            return response
              .status(200)
              .json({ message: "Informations updated." });
          }else{
            return response.status(400).json({ message: "Incorrect password" });
          }
        });
    }catch(error){
        response.status(400).json({message: 'didnt work'});
    }
    } else {
      response.setHeader("Allow", "POST");
      response.status(405).end("Method not allowed");
    }
  }
);
