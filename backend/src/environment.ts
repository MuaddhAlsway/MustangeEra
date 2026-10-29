import 'dotenv/config';
import dns from 'node:dns';
if(process.env.DNS_SERVERS)dns.setServers(process.env.DNS_SERVERS.split(',').map(v=>v.trim()));
