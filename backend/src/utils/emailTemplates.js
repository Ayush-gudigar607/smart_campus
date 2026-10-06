import { env } from '../config/env.js';
export const requestEmail = ({title,message,requestCode}) => ({ subject:title, text:`${message}\n${env.FRONTEND_URL}/requests/${requestCode}`, html:`<p>${message}</p><p><a href="${env.FRONTEND_URL}/requests/${requestCode}">View request ${requestCode}</a></p>` });
