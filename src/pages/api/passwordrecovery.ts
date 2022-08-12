import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated } from "./login";
import { hash } from "bcrypt";
import mail from "@sendgrid/mail";

interface DataProps {
  ref: {
    id: number;
  };
  ts: number;
  data: UserDataProps;
}

interface UserDataProps {
  name: string;
  email: string;
  password: string;
  createdAt: string;
  companyRef: string;
  roles: string[];
  permissions: string[];
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    mail.setApiKey(process.env.SENDGRID_API_KEY);

    const { forgot_email } = request.body;

    try {
      const userData: DataProps = await fauna.query(
        q.If(
          q.Not(
            q.Exists(
              q.Match(q.Index("user_by_email"), q.Casefold(forgot_email))
            )
          ),
          q.Abort(`E-mail doesn't exist.`),
          q.Get(q.Match(q.Index("user_by_email"), forgot_email))
        )
      );

      hash("123456", 10, async function (err, hash) {
        // Store hash in your password DB.
        if (!err) {
          const updatedData = await fauna.query(
            q.Update(q.Ref(q.Collection("users"), userData.ref.id), {
              data: {
                password: hash,
              },
            })
          );
        }

        const message = `Hello, dear. <br> <br> <br>Temporary password: "123456" <br> <br> Login in the platform and change your password. <br> <br> <br> See you!`;

        const emailData = {
          to: forgot_email,
          from: "services@rafael.network",
          subject: "Password recovery",
          text: message,
          html: message.replace(/\r\n/g, "<br>"),
        };

        mail.send(emailData);
      });

      return response.status(200).json({ message: "Password updated" });
    } catch (err) {
      console.log("Error when updating password", err);
      return response.status(400).json({ message: "Something went wrong" });
    }
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method not allowed");
  }
};
