
import { sendEmail } from './sendEmail';
try{
(async () => {
    await sendEmail('Here you need to put the email address for send a message', 'בדיקה של הפונקציה');
})();}
catch (err){
console.log("Dont success to send email");
console.log(err);


}