import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated } from "./login";

interface companyProps {
  ref: string;
  ts:number;
  data: {
    avaiableHours: number;
  }
}

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "PUT") {
      const { id, companyRef, selectedSlots } = request.body;

      try {

        const companyData = await fauna.query<companyProps>(
          q.Get(q.Ref(q.Collection("companies"), companyRef))
        );


        const updatedData = await fauna.query(
          q.Update(q.Ref(q.Collection("schedules"), id), {
            data: {
              status: "rejected",
            },
          })
        );

        const updatedCompany = await fauna.query(
          q.Update(q.Ref(q.Collection("companies"), companyRef), {
            data: {
              avaiableHours: companyData.data.avaiableHours + selectedSlots
            },
          })
        );

        return response.status(200).json({ message: "Appointment rejected" });
      } catch (err) {
        console.log("Error when rejecting appointment", err);
        return response.status(400).json({ message: "Something went wrong" });
      }
    } else {
      response.setHeader("Allow", "PUT");
      response.status(405).end("Method not allowed");
    }
  }
);
