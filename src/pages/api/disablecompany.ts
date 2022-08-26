import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated, isAdministrator } from "./login";
import mail from "@sendgrid/mail";

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

      mail.setApiKey(process.env.SENDGRID_API_KEY);

      try {
        const updatedData = await fauna.query(
          q.Update(q.Ref(q.Collection("companies"), id), {
            data: {
              status: "disabled",
            },
          })
        );

        const { data } = await fauna.query<UserDataProps>(
          q.Map(
            q.Paginate(q.Match(q.Index("all_users"))),
            q.Lambda((x) => q.Get(x))
          )
        );

        const companyUsers = [];

        data.forEach((user) => {
          if (user.data.companyRef == id) {
            fauna.query(
              q.Update(q.Ref(q.Collection("users"), user.ref.id), {
                data: {
                  companyRef: "",
                  companyName: "",
                  permissions: [""],
                },
              })
            );
          }
        });

        const message = `Hello, dear ${responsable_name} <br> <br> <br> Your company was disabled. If it an error please contact us. <br> <br> <br> We hope to see you soon testing your vehicles. Good luck!`;
  
          const emailData = {
            to: email,
            from: "services@rafael.network",
            subject: "Company disabled.",
            text: message,
            html: message.replace(/\r\n/g, "<br>"),
          };
  
          mail.send(emailData);

        return response.status(200).json({ message: "Company disabled" });
      } catch (err) {
        console.log("Error when desabling company", err);
        return response.status(400).json({ message: "Something went wrong" });
      }
    } else {
      response.setHeader("Allow", "PUT");
      response.status(405).end("Method not allowed");
    }
  }
);
