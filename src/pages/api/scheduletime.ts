import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated } from "./login";
import mail from "@sendgrid/mail";
import dayjs from "dayjs";

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
  userName: string;
  userEmail: string;
}

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {
      mail.setApiKey(process.env.SENDGRID_API_KEY);

      const {
        selectedSlots,
        speedway,
        vehicle,
        userId,
        companyName,
        companyRef,
        userEmail,
        userName
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
              companyRef,
              vehicle,
              userId,
              status: "pending",
            },
          })
        );

        let emailSlots = "|";

        selectedSlots.forEach((slot) => {
          const data = `${dayjs(slot).format("H")}:00 to ${
            Number(dayjs(slot).format("H")) + 1
          }:00`;

          emailSlots = emailSlots + ` ${data} |`;
        });

        const message = `Hello, dear ${userName} <br> <br> <br> Your appointment on ${dayjs(selectedSlots[0]).format('DD/MM/YYYY')} is confirmed! Selected slots:  <br> <br> ${emailSlots}  <br> <br> <br> We hope you enjoy the tests. Good luck!`;
  
  
          const companyResponsableEmail = companyData.data.email
  
          const emailData = {
            to: userEmail,
            cc: companyResponsableEmail,
            from: "services@rafael.network",
            subject: "Appointment confirmed.",
            text: message,
            html: message.replace(/\r\n/g, "<br>"),
          };
  
          mail.send(emailData);

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
