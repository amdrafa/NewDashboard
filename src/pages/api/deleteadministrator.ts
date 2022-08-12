import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated } from "./login";

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "DELETE") {
      const { id } = request.body;

      try {
        const updatedData = await fauna.query(
          q.Delete(q.Ref(q.Collection("users"), id))
        );

        return response.status(200).json({ message: "Administrator deleted" });
      } catch (err) {
        console.log("Error when deleting administrator", err);
        return response.status(400).json({ message: "Something went wrong" });
      }
    } else {
      response.setHeader("Allow", "DELETE");
      response.status(405).end("Method not allowed");
    }
  }
);
