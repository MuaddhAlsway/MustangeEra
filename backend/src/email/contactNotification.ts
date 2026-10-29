import { Resend } from 'resend';
import { z } from 'zod';
import { renderReplyEmail } from './replyTemplate.js';

export type ContactNotification={id:string;name:string;email:string;subject:string;message:string;carId?:number};
export type NotificationResult={status:'Accepted'|'Failed'|'Unavailable'|'Unconfirmed';providerId?:string;error?:string};
export type ContactNotifier=(inquiry:ContactNotification)=>Promise<NotificationResult>;

export function notificationEmail(inquiry:ContactNotification,recipient:string,from:string) {
  const subject=`New garage inquiry / ${inquiry.subject}`;
  const text=[`New contact inquiry from ${inquiry.name}`,`Visitor email: ${inquiry.email}`,`Subject: ${inquiry.subject}`,...(inquiry.carId?[`Machine file: ${inquiry.carId}`]:[]),'',inquiry.message,'',`Inquiry ID: ${inquiry.id}`,'This inquiry is also saved in Admin > Inbox. Reply to this email to contact the visitor.'].join('\n');
  return {from,to:z.email().parse(recipient),replyTo:inquiry.email,subject,text,html:renderReplyEmail(subject,text,'notification')};
}

export const sendContactNotification:ContactNotifier=async(inquiry)=>{
  const {RESEND_API_KEY,RESEND_FROM_EMAIL,CONTACT_NOTIFICATION_EMAIL}=process.env;
  if(!RESEND_API_KEY||!RESEND_FROM_EMAIL||!CONTACT_NOTIFICATION_EMAIL)return {status:'Unavailable',error:'Contact email notifications are not configured. The inquiry is saved in the admin inbox.'};
  const recipient=z.email().safeParse(CONTACT_NOTIFICATION_EMAIL.trim());
  if(!recipient.success)return {status:'Unavailable',error:'The notification recipient configuration is invalid. The inquiry is saved in the admin inbox.'};
  try {
    // Recipient is server-configured; the visitor cannot choose where notifications are sent.
    const result=await new Resend(RESEND_API_KEY).emails.send(notificationEmail(inquiry,recipient.data,RESEND_FROM_EMAIL),{idempotencyKey:`contact-notification:${inquiry.id}`,signal:AbortSignal.timeout(12000)});
    if(result.error||!result.data)return {status:'Failed',error:'Resend did not accept the contact notification. Review provider logs; the inquiry is saved in the admin inbox.'};
    return {status:'Accepted',providerId:result.data.id};
  }catch{
    return {status:'Unconfirmed',error:'Notification delivery could not be confirmed. Review provider logs before retrying; the inquiry is saved in the admin inbox.'};
  }
};
