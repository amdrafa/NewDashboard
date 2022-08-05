import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated } from "./login";

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "PUT") {
      const {
        company,
        cnpj,
        email,
        phone,
        hours,
        responsable_name,
        companyId,
      } = request.body;


      try {
        const updatedData = await fauna.query(
          q.Update(q.Ref(q.Collection("companies"), companyId), {
            data: {  
                company,
                cnpj,
                email,
                phone,
                avaiableHours: hours,
                responsable_name, 
            },
          })
        );

        return response.status(200).json({ message: "Company updated" });
      } catch (err) {
        console.log("Error when editing company", err);
        return response.status(400).json({ message: "Something went wrong" });
      }
    } else {
      response.setHeader("Allow", "PUT");
      response.status(405).end("Method not allowed");
    }
  }
);
