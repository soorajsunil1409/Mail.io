// Helper: Extract header value by name.
function getHeader(headers, name) {
  const header = headers.find(
    (h) => h.name.toLowerCase() === name.toLowerCase()
  );
  return header ? header.value : null;
}

// Assume emailData is the JSON response from gmail.users.messages.get() with format 'full'
function parseEmail(emailData) {
  const headers = emailData.payload.headers;
  const subject = getHeader(headers, "Subject") || "";
  const from = getHeader(headers, "From") || "";
  let body = "";

  // If multipart, look for the 'text/plain' part.
  if (emailData.payload.parts) {
    for (const part of emailData.payload.parts) {
      if (part.mimeType === "text/plain" && part.body && part.body.data) {
        body = Buffer.from(part.body.data, "base64").toString("utf-8");
        break;
      }
    }
  } else if (emailData.payload.body && emailData.payload.body.data) {
    body = Buffer.from(emailData.payload.body.data, "base64").toString("utf-8");
  }

  // Attachments: iterate over parts to collect attachments if filename exists.
  const attachments = [];
  if (emailData.payload.parts) {
    for (const part of emailData.payload.parts) {
      if (part.filename && part.filename.length > 0 && part.body.attachmentId) {
        attachments.push({
          filename: part.filename,
          mimeType: part.mimeType,
          attachmentId: part.body.attachmentId,
        });
      }
    }
  }

  return { subject, from, body, attachments };
}
