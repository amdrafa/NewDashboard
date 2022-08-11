import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { authenticated } from "./login";

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
  }
  ts: string;
  data: UserProps[];
}

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "PUT") {
      const {
        id,
      } = request.body;


      try {
        const updatedData = await fauna.query(
          q.Update(q.Ref(q.Collection("companies"), id), {data: {
            status: 'disabled'
          }})
        );
        

        const { data } = await fauna.query<UserDataProps>(
          q.Map(
            q.Paginate(q.Match(q.Index("all_users"))),
            q.Lambda((x) => q.Get(x))
          )
        );

        const companyUsers = []

        data.forEach(user => {
          if(user.data.companyRef == id){
             fauna.query(
              q.Update(q.Ref(q.Collection("users"), user.ref.id), {data: {
                companyRef: '',
                companyName: '',
                permissions: [""]
              }})
            );

          }
        })


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
