import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated } from "./login";

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "PUT") {
      const {
        data: speedway,
        vehicles_limit,
        description,
        speedwayId,
      } = request.body;

      try {
        const updatedData = await fauna.query(
          q.Update(q.Ref(q.Collection("speedways"), speedwayId), {
            data: { speedway, vehicles_limit, description },
          })
        );

        return response.status(200).json({ message: "Test track updated" });
      } catch (err) {
        console.log("Error when editing test track", err);
        return response.status(400).json({ message: "Something went wrong" });
      }
    } else {
      response.setHeader("Allow", "PUT");
      response.status(405).end("Method not allowed");
    }
  }
);
