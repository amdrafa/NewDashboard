import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated, isAdministrator } from "./login";

export default isAdministrator(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "DELETE") {
      const {
        id,
      } = request.body;


      try {
        const deleteData = await fauna.query(
          q.Delete(q.Ref(q.Collection("users"), id))
        );


        return response.status(200).json({ message: "User deleted" });
      } catch (err) {
        console.log("Error when deleting user", err);
        return response.status(400).json({ message: "Something went wrong" });
      }
    } else {
      response.setHeader("Allow", "DELETE");
      response.status(405).end("Method not allowed");
    }
  }
);
