import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated } from "./login";

type CompanyProps = {
  ref: {
    id: string;
  };
  data: {
    company: string;
    cnpj: string;
    responsable_name: string;
    email: string;
    phone: string;
    avaiableHours: number;
  };
};

interface bodyProps {
  selectedSlots: string[];
  speedway: string;
  vehicle: string;
  userId: number;
  companyName: string;
  companyRef: string;
}

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {
      const {
        selectedSlots,
        speedway,
        vehicle,
        userId,
        companyName,
        companyRef,
      }: bodyProps = request.body;

      try {
        const companyData = await fauna.query<CompanyProps>(
          q.Get(q.Ref(q.Collection("companies"), companyRef))
        );

        if (companyData.data.avaiableHours < selectedSlots.length) {
          return response
            .status(400)
            .json({ message: "User company doesn't have enough hours." });
        } else {
          await fauna.query(
            q.Update(q.Ref(q.Collection("companies"), companyRef), {
              data: {
                avaiableHours:
                  companyData.data.avaiableHours - selectedSlots.length,
              },
            })
          );
        }

        await fauna.query(
          q.Create(q.Collection("schedules"), {
            data: {
              selectedSlots,
              speedway,
              companyName,
              vehicle,
              userId,
              status: "pending",
            },
          })
        );

        return response.status(200).json({ Message: "Appointment scheduled" });
      } catch (err) {
        console.log("Error when creating appointment", err);
        return response.status(400).json({ err });
      }
    } else {
      response.setHeader("Allow", "POST");
      response.status(405).end("Method not allowed");
    }
  }
);
