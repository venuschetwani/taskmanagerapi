const nodemailer = require("nodemailer");

const  sendWelcomemail=async(email,name)=>{
   const mailoptions = {
   from: "shubhangih.mobio@gmail.com",
   to: email,
   subject: "Thanks for joining!",
   text: `welcome to the app,${name}. let me know how you get along withe the app`,
   };


   let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    service: "gmail",
    secure: false,
    auth: {
      user: "shubhangihingu@gmail.com",
      pass: "iossrpmwotsdsdcg",
    },
  });

  let info = await transporter.sendMail(mailoptions);

  if (info.rejected == null) {
    console.log("email not send");
  } else {
    console.log(info);
  }
}




const  cancelationmail=async(email,name)=>{
    const mailoptions = {
    from: "shubhangih.mobio@gmail.com",
    to: email,
    subject: "Sorry to see u go!",
    text: `Goodbye ${name}, hope to see u again`,
    };
 
 
    let transporter = nodemailer.createTransport({
     host: "smtp.ethereal.email",
     port: 587,
     service: "gmail",
     secure: false,
     auth: {
       user: "shubhangihingu@gmail.com",
       pass: "iossrpmwotsdsdcg",
     },
   });
 
   let info = await transporter.sendMail(mailoptions);
 
   if (info.rejected == null) {
     console.log("email not send");
   } else {
     console.log(info);
   }
 }

//sendWelcomemail("shubhangih.mobio@gmail.com",'shubhangih');

module.exports={
    sendWelcomemail,
    cancelationmail
}
