import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { hash } from "bcrypt";
import { authenticated } from "./login";
import mail from "@sendgrid/mail";

export default authenticated (async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    const { name, email, cpf, workRole, createdBy  } = request.body;

    mail.setApiKey(process.env.SENDGRID_API_KEY)

    hash(email.substring(1,5) as string, 10, function(errPass, hashPass) {
        // A strong password is generated by the user email.
    

    hash(hashPass, 10, async function (err, hash) {
      // Store hash in your password DB.

      console.log("Heyy, trying to register an adm", email, name, hashPass);


      const message = `Hello, dear ${name} <br> <br> <br> Your temporary password is ${hashPass}  <br> <br> <br> Congrats, good luck!`

        const emailData = {
            to: email,
            from: 'services@rafael.network',
            subject: 'Authorization',
            text: message,
            html: message.replace(/\r\n/g, '<br>')
        }


      try {
        const createdAt = new Date().toLocaleDateString("EN-US", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        await fauna.query(
          q.If(
            q.Not(
              q.Exists(q.Match(q.Index("user_by_email"), q.Casefold(email)))
            ),
            q.Create(q.Collection("users"), {
              data: { name, email, password: hash, createdAt, createdBy, workRole, cpf, roles: ["ADMINISTRATOR"], permissions: ["EDIT", "CREATE", "SCHEDULE"] },
            }),
            q.Abort("Email already exists")
          )
        );

        mail.send(emailData)

        return response.status(200).json({message: "Adm registered"});
      } catch (err) {
        console.log("error when adding user to database", err);
        return response.status(400).json({err});
      }
    })
});
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method not allowed");
  }
});
