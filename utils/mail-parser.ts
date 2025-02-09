import { oauth2Client } from "@/lib/auth";
import { google } from "googleapis";

interface FilteredEmail {
  snippet: string;
  headers: {
    recieved: [string];
    date: string;
    subject: string;
    from: string;
    to: string;
  };
  body: string;
  attachments: { filname: string; attachmentId: string }[];
}

export async function getParsedEmail(
  messageId: string
): Promise<FilteredEmail> {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  try {
    const res = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
      fields:
        "snippet,payload(headers(name,value),mimeType,body(attachmentId,data),parts(partId, mimeType, filename, body(attachmentId,data)))",
    });

    const messageData = res.data;
    const snippet = messageData.snippet || "";

    //Get Headers
    const headersArray =
      (messageData.payload && messageData.payload.headers) || [];
    const filteredHeaders = extractDesiredHeaders(headersArray);

    // Get Body and Attachments
    const { bodyText, attachments } = await processPayload(messageData.payload);
    const filteredEmail = {
      snippet,
      headers: filteredHeaders,
      body: bodyText,
      attachments,
    };
    return filteredEmail;
  } catch (error) {
    console.log("Error while parsing Email:", error);
    return error;
  }
}

export function extractDesiredHeaders(headersArray) {
  const desired = ["received", "from", "date", "subject", "to", "mailing-list"];
  const result = {};
  for (const header of headersArray) {
    const name = header.name.toLowerCase();
    if (desired.includes(name)) {
      if (result[name]) {
        if (!Array.isArray(result[name])) {
          result[name] = [result[name]];
        }
        result[name].push(header.value);
      } else {
        result[name] = header.value;
      }
    }
  }
  return result;
}

export async function processPayload(payload) {
  let bodyText = "";
  let attachments = [];

  if (payload.parts && payload.parts.length) {
    for (const part of payload.parts) {
      if (part.mimeType && part.mimeType.startsWith("multipart/")) {
        const nested = await processPayload(part);
        bodyText += nested.bodyText;
        attachments = attachments.concat(nested.attachments);
      } else if (part.mimeType === "text/plain") {
        if (part.body && part.body.data) {
          const text = Buffer.from(part.body.data, "base64").toString("utf8");
          bodyText += text + "\n";
        }
      } else {
        if (part.body && part.body.attachmentId) {
          attachments.push({
            filename: part.filename || "",
            attachmentId: part.body.attachmentId,
          });
        }
      }
    }
  } else {
    if (
      payload.mimeType === "text/plain" &&
      payload.body &&
      payload.body.data
    ) {
      bodyText = Buffer.from(payload.body.data, "base64").toString("utf8");
    }
  }
  return { bodyText, attachments };
}
