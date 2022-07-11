import { NextApiRequest, NextApiResponse } from "next";
import { fauna } from '../../services/fauna'
import { query as q } from 'faunadb'
import mail from '@sendgrid/mail'
import secretKey from 'secret-key'
import { authenticated } from "./login";



export default authenticated (async (request: NextApiRequest, response: NextApiResponse) => {

    
    
    if(request.method === 'POST'){

        

        mail.setApiKey(process.env.SENDGRID_API_KEY)

        const {data:company, cnpj, responsable_name, email, phone, hours} = request.body

        const {secret: companySecretKey} = secretKey.create(cnpj)

        const message = `Hello, dear ${responsable_name} <br> <br> <br> Secret key: ${companySecretKey} <br> <br> <br> Now, you are the only one who have access to this secret key, and you must foward only to the employes that need schedule the speedways. <br> <br> 1º Step: The employee has to sign in.  <br> <br> 2º Step: Paste the generated secret key which only you know inside the platform. <br> <br> 3º Step: Schedule the speedway. <br> <br> <br> Congrats, good luck!`

        const emailData = {
            to: email,
            from: 'services@rafael.network',
            subject: 'Authorization',
            text: message,
            html: message.replace(/\r\n/g, '<br>')
        }


        console.log("heyyyy, I am at createCompany api" + company, cnpj, responsable_name, email, companySecretKey)

        
        
        try{

            const createdAt = new Date().toLocaleDateString('EN-US', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })


            await fauna.query(
                q.Create(
                    q.Collection('companies'),
                    { data: {company, cnpj, responsable_name, email, phone, avaiableHours: hours, companySecretKey, createdAt} }
                )
            )

            mail.send(emailData)

            return response.status(200).json({message: 'Company created'})
        }catch(err){
            console.log('error when creating company', err)
            return response.status(400).json({message: 'Something went wrong'})
        }
        

    }else{
        response.setHeader('Allow', 'POST')
        response.status(405).end('Method not allowed')
    }
})
    