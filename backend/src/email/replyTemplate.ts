function escapeHtml(value:string){
  return value.replace(/[&<>\"']/g,character=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '\"':'&quot;',
    "'":'&#39;',
  })[character]!);
}

export function renderReplyEmail(subject:string,message:string,kind:'reply'|'notification'='reply'){
  const safeSubject=escapeHtml(subject);
  const safeMessage=escapeHtml(message).split(/\r?\n/).map(line=>line||'&nbsp;').join('<br>');
  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><title>${safeSubject}</title></head>
  <body style="margin:0;padding:0;background-color:#eeece5;color:#22231e;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${kind==='notification'?'A new contact inquiry for the Mustang Garage team.':'A personal reply from the Mustang Garage team.'}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#eeece5;width:100%;">
      <tr><td align="center" style="padding:32px 14px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #d8d3c7;">
          <tr><td style="padding:28px 34px;background-color:#141510;border-bottom:3px solid #c74737;">
            <p style="margin:0;color:#e8dfcb;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.1;letter-spacing:1px;font-weight:bold;">MUSTANG GARAGE</p>
            <p style="margin:9px 0 0;color:#c9a780;font-size:10px;line-height:1.5;letter-spacing:2px;text-transform:uppercase;">${kind==='notification'?'A new message at the garage':'A personal note from the garage'}</p>
          </td></tr>
          <tr><td style="padding:34px;">
            <p style="margin:0 0 12px;color:#8a6046;font-size:10px;line-height:1.5;letter-spacing:2px;text-transform:uppercase;">${kind==='notification'?'CONTACT INQUIRY / ADMIN INBOX':'THE GARAGE REPLIES'}</p>
            <h1 style="margin:0 0 24px;color:#22231e;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;font-weight:normal;">${safeSubject}</h1>
            <div style="color:#34352e;font-size:15px;line-height:1.8;overflow-wrap:anywhere;">${safeMessage}</div>
          </td></tr>
          <tr><td style="padding:18px 34px;background-color:#f6f4ee;border-top:1px solid #e2ded4;">
            <p style="margin:0;color:#6c6a60;font-size:10px;line-height:1.7;letter-spacing:1px;text-transform:uppercase;">MUSTANG GARAGE <span style="color:#c74737;">/</span> BUILT FOR THE LONG ROAD</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
