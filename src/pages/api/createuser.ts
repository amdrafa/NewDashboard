/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { hash } from "bcrypt";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    const {
      data: email,
      password,
      name,
      cpf,
      phone,
      register_number,
      driver_category,
      expires_at,
    } = request.body;



    hash(password, 10, async function (err, hash) {
      // Store hash in your password DB.

      try {
        const createdAt = new Date().toLocaleDateString("EN-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        console.log('AAAAAAAAAAAAAAAAAAASDASDASD')

        await fauna.query(
          q.If(
            q.Not(
              q.Exists(q.Match(q.Index("user_by_email"), q.Casefold(email)))
            ),
            q.Create(q.Collection("users"), {
              data: {
                name,
                cpf,
                phone,
                email,
                password: hash,
                createdAt,
                register_number,
                driver_category,
                expires_at,
                companyRef: "",
                roles: ["USER"],
                permissions: [""],
              },
            }),
            q.Abort("Email already exists")
          )
        );

        return response.status(201).json({ message: "User created" });
      } catch (err) {
        console.log("Error when adding user to database", err);
        return response.status(400).json({ err });
      }
    });
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method not allowed");
  }
};

