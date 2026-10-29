import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
const response=await fetch('https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.14.zip',{signal:AbortSignal.timeout(180000)});
if(!response.ok)throw new Error('MongoDB test binary download failed.');
await pipeline(Readable.fromWeb(response.body),createWriteStream('C:/Users/irahm/Documents/Codex/2026-10-28/o/mongodb-test.zip'));
console.info('Isolated MongoDB test binary downloaded.');
