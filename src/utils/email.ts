
import  * as nodemailer  from 'nodemailer';

export async function sendMail(options) {
    try {

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT),
            secure: false,
            auth:{
                user: process.env.MAIL_FROM,
                pass: process.env.MAIL_PASSWORD
            }
        })
        const result = await transporter.sendMail(options)
        console.log(result.messageId)
        return result
        
    } catch (error) {
        console.log("Error on email:",error)
        return null
        
    }
    
}