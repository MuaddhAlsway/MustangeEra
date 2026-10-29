import './environment.js';
import mongoose from 'mongoose';
import { createClerkClient } from '@clerk/express';
import { Resend } from 'resend';
const flags={database:false,clerk:false,resend:false,adminAllowlist:Boolean(process.env.ADMIN_EMAILS)};
try{await mongoose.connect(process.env.MONGODB_URI!,{serverSelectionTimeoutMS:10000});await mongoose.connection.db!.admin().ping();flags.database=true;}catch{}finally{await mongoose.disconnect();}
try{const clerk=createClerkClient({secretKey:process.env.CLERK_SECRET_KEY});await clerk.users.getUserList({limit:1});flags.clerk=true;}catch{}
try{const result=await new Resend(process.env.RESEND_API_KEY).domains.list();flags.resend=!result.error;}catch{}
console.info('Read-only service checks:',flags);
