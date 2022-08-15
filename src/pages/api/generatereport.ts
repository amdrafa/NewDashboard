import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";
import { useState } from "react";
import { decode } from "jsonwebtoken";
import { authenticated } from "./login";
import excelJS from 'exceljs';
import * as path from 'path';

interface BusySlotsProps {
    ref: string;
    ts: number;
    data: {
      selectedSlots: string[];
      speedway: string;
      vehicle: string;
      userId: string;
      status: string;
      companyName: string;
    };
  }
  
  interface BusySlotsDataProps {
    ref: string;
    ts: string;
    data: BusySlotsProps[];
  }

export default authenticated(
  async (request: NextApiRequest, response: NextApiResponse) => {
    if (request.method === "POST") {

      const {
        cnpj,
        company,
        responsable_name,
        email,
        phone,
        avaiableHours,
        companyId,
        // month, 
        // year
      } = request.body;

      try {

          const { data } = await fauna.query<BusySlotsDataProps>(
            q.Map(
              q.Paginate(q.Match(q.Index("all_busy_slots"))),
              q.Lambda((x) => q.Get(x))
            )
          );
          
           const workbook = new excelJS.Workbook();

           const sheet = workbook.addWorksheet('primeira aba')

           sheet.columns = [
            {header: "Nome", key: "nome"},
            {header: "E-mail", key: "email"},
            {header: "telefone", key: "telefone"},
            {header: "genero", key: "genero"},
            {header: "funcao", key: "funcao"},
           ]

           for(let i = 0; i<50 ; i++){
            sheet.addRow({
                nome: "test" + i.toString(),
                email: "test" + i.toString(),
                telefone: "test" + i.toString(),
                genero: "test" + i.toString(),
                funcao: "test" + i.toString(),
            })
           }

           sheet.getRow(1).font = {
            bold:true,
            color: {argb: 'FFCCCCCC'}
           }

           sheet.getRow(1).fill = {
            type: 'pattern',
            pattern:'solid',
            bgColor: {argb: 'FF000000'}
           }
            
           sheet.workbook.xlsx.writeFile('test.xlsx')

           
           


        return response.status(200).json({ sheet: sheet.workbook.xlsx.writeFile('test.xlsx') });
      } catch (err) {
        console.log("Error when generating company report. ");
        return response.status(400).json({ error: err });
      }
    } else {
      response.setHeader("Allow", "POST");
      response.status(405).end("Method not allowed");
    }
  }
);
