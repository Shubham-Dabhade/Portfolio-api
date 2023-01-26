const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
// server used to send send emails
const app = express();
const { google } =require("googleapis");
const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET)
OAuth2_client.setCredentials({refresh_token:process.env.REFRESH_TOKEN});


app.use(cors({credentials: true,crossorigin:"anonymous",allowedHeaders:"*",allowedOrigins:"*", origin: true}));
app.use(express.json());
app.use("/", router);
app.listen(5000, () => console.log("Server Running"));


const send_mail=(name,email,phone,message,res)=>{
    const accessToken = OAuth2_client.getAccessToken();


    const transport = nodemailer.createTransport({
        service:"gmail",
        auth:{
            type:"OAuth2",
            user:process.env.MAIL,
            clientId:process.env.CLIENT_ID,
            clientSecret:process.env.CLIENT_SECRET,
            refreshToken:process.env.REFRESH_TOKEN,
            accessToken:accessToken
        }
    });

    const mail_options = {
        from :name,
        to:process.env.MAIL,
        subject:"Contact Form Submission - Portfolio",
        html: `<p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>Message: ${message}</p>`
    }


    transport.sendMail(mail_options,function(error,result){
        if (error) {
            res.json(error);
          } else {
            res.json({ code: 200, status: "Message Sent" });
          }
        });
    transport.close();
}



router.post("/contact", (req, res) => {
  const name = req.body.firstName + req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;

  send_mail(name,email,phone,message,res);
});
