import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { useState } from "react";
import { decode } from "jsonwebtoken";
import { authenticated } from "./login";

interface UserProps {
  name: string;
  email: string;
  password: string;
  createdAt: string;
  companyRef: string;
  roles: string[];
  expires_at?: string;
  cpf: string;
  phone: string;
}

type DataProps = {
  ref: {
    id: string;
  };
  data: {
    company: string;
    cnpj: string;
    responsable_name: string;
    email: string;
    phone: string;
  };
};

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "GET") {


      console.log("Getting company data");

      const companyRef = request.query["companyRef"];

      if(!companyRef){
        return response.status(200).json({ Message: "Waiting parameters" });
      }

      try {
        const companyData = await fauna.query<DataProps>(
          q.Get(q.Ref(q.Collection("companies"), companyRef))
        );

        return response
          .status(200)
          .json({
            responsable_name: companyData.data.responsable_name,
            email: companyData.data.email,
            company_name: companyData.data.responsable_name,
            cnpj: companyData.data.cnpj,
            phone: companyData.data.phone
          });
      } catch (err) {
        console.log("error when getting company data ");
        return response.status(400).json({ error: err });
      }
    } else {
      response.setHeader("Allow", "GET");
      response.status(405).end("Method not allowed");
    }
  }
);
