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
      
      const { id, email, responsable_name } = request.body;

      const { secret: companySecretKey } = secretKey.create(
        String(id).substring(0, 6)
      );

      mail.setApiKey(process.env.SENDGRID_API_KEY);

      const message = `Hello, dear ${responsable_name} <br> <br> <br> Secret key: ${companySecretKey} <br> <br> <br> Now, you are the only one who have access to this secret key, and you must foward only to the employes that need schedule the speedways. <br> <br> 1º Step: The employee has to sign in.  <br> <br> 2º Step: Paste the generated secret key which only you know inside the platform. <br> <br> 3º Step: Schedule the speedway. <br> <br> <br> Congrats, good luck!`;

      const emailData = {
        to: email,
        from: "services@rafael.network",
        subject: "Authorization",
        text: message,
        html: message.replace(/\r\n/g, "<br>"),
      };

      try {
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
