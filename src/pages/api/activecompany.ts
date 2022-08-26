import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated, isAdministrator } from "./login";
import mail from "@sendgrid/mail";
import secretKey from "secret-key";

interface UserProps {
  ref: {
    id: number;
  };
  ts: string;
  data: {
    name: string;
    email: string;
    companyRef: string;
    roles: string[];
  };
}

interface UserDataProps {
  ref: {
    id: number;
  };
  ts: string;
  data: UserProps[];
}

export default isAdministrator(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "PUT") {

      mail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const { id, email, responsable_name } = request.body;

      const { secret: companySecretKey } = secretKey.create(
        String(id).substring(0, 6)
      );

      
      try {

        const message = `Hello, dear ${responsable_name} <br> <br> <br> Your new secret key is: <br> <br> ${companySecretKey} <br> <br> Your company is active again. Remember to forward this e-mail for those who will schedule the future appointments. <br> <br> <br> We hope to see you soon testing your vehicles. Good luck!`;

      const emailData = {
        to: email,
        from: "services@rafael.network",
        subject: "New secret key",
        text: message,
        html: message.replace(/\r\n/g, "<br>"),
      };


        const updatedData = await fauna.query(
          q.Update(q.Ref(q.Collection("companies"), id), {
            data: {
              status: "active",
              companySecretKey: companySecretKey,
            },
          })
        );

        mail.send(emailData);

        return response.status(200).json({ message: "Company enabled" });
      } catch (err) {
        console.log("Error when enabling company", err);
        return response.status(400).json({ message: "Something went wrong" });
      }
    } else {
      response.setHeader("Allow", "PUT");
      response.status(405).end("Method not allowed");
    }
  }
);
