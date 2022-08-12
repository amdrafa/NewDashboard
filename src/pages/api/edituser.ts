import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated } from "./login";

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "PUT") {
      const {
        email,
        name,
        cpf,
        phone,
        register_number,
        driver_category,
        expires_at,
        userId,
      } = request.body;

      try {
        const updatedData = await fauna.query(
          q.Update(q.Ref(q.Collection("users"), userId), {
            data: {
              email,
              name,
              cpf,
              phone,
              register_number,
              driver_category,
              expires_at,
            },
          })
        );

        return response.status(200).json({ message: "User updated" });
      } catch (err) {
        console.log("Error when editing user", err);
        return response.status(400).json({ message: "Something went wrong" });
      }
    } else {
      response.setHeader("Allow", "PUT");
      response.status(405).end("Method not allowed");
    }
  }
);
