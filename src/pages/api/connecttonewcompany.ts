import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated } from "./login";

type DataProps = {
  ref: {
    id: string;
  }
  data: {
    company:string;
  }
};

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {
      const { secret_key, userId, email } = request.body;

      try {
        const company = await fauna.query<DataProps>(
          q.If(
            q.Exists(q.Match(q.Index("company_by_code"), secret_key)),

            q.Get(q.Match(q.Index("company_by_code"), secret_key)),
            q.Abort("Company not found")
          )
        );


        await fauna.query(
          q.Update(q.Ref(q.Collection("users"), userId), {
            data: { companyRef: company.ref.id, companyName: company.data.company },
          })
        );

        return response.status(200).json({ message: "User company updated" });
      } catch (err) {
        console.log("error when connecting user to company", err);
        return response.status(400).json({ message: "User company not updated" });
      }
    } else {
      response.setHeader("Allow", "POST");
      response.status(405).end("Method not allowed");
    }
  }
);
