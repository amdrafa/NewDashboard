import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated } from "./login";
import mail from "@sendgrid/mail";
import dayjs from "dayjs";

interface companyProps {
  ref: string;
  ts:number;
  data: {
    avaiableHours: number;
    email: string;
  }
}

interface userProps {
  ref: string;
  ts:number;
  data: {
    email: string;
    name: string;
  }
}

interface requestProps {
  id: string;
  selectedSlots: number;
  companyRef: string;
  userId: string;
  selectedSlotsData: string[]
}


export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "PUT") {
      const { id, selectedSlots, companyRef, userId, selectedSlotsData }:requestProps = request.body;

      mail.setApiKey(process.env.SENDGRID_API_KEY);

      try {

        const companyData = await fauna.query<companyProps>(
          q.Get(q.Ref(q.Collection("companies"), companyRef))
        );

        const updatedData = await fauna.query(
          q.Update(q.Ref(q.Collection("schedules"), id), {
            data: {
              status: "canceled",
              // avaiableHours: companyData.data.avaiableHours + selectedSlots
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

        if(selectedSlotsData){
          const userData = await fauna.query<userProps>(
            q.Get(q.Ref(q.Collection("users"), userId))
          );
  
  
          let emailSlots = '|';
  
          selectedSlotsData.forEach(slot => {
            
            const data = `${dayjs(slot).format("H")}:00 to ${Number(dayjs(slot).format("H")) + 1}:00`
  
            emailSlots = emailSlots + ` ${data} |`
            
          })
  
          const message = `Hello, dear ${userData.data.name} <br> <br> <br> Your appointment on ${dayjs(selectedSlotsData[0]).format('DD/MM/YYYY')} was canceled. Selected slots:  <br> <br> ${emailSlots}  <br> <br> <br> We hope you find a better day to test your vehicles. Good luck!`;
  
          const userEmail = userData.data.email
  
          const companyResponsableEmail = companyData.data.email
  
          const emailData = {
            to: userEmail,
            cc: companyResponsableEmail,
            from: "services@rafael.network",
            subject: "Appointment canceled.",
            text: message,
            html: message.replace(/\r\n/g, "<br>"),
          };
  
          mail.send(emailData);
        }

        

        

        return response.status(200).json({ message: "Appointment canceled" });
      } catch (err) {
        console.log("Error when canceling appointment", err);
        return response.status(400).json({ message: "Something went wrong" });
      }
    } else {
      response.setHeader("Allow", "PUT");
      response.status(405).end("Method not allowed");
    }
  }
);
