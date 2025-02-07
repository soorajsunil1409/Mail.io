import { oauth2Client, refresh_access_token } from "@/lib/auth";
import { connect_DB } from "@/lib/DB";
import { User } from "@/models/User";
import { google } from "googleapis";
import { NextRequest } from "next/server";
import { simpleParser, Source } from "mailparser";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const user_id = searchParams.get("user_id");

  await connect_DB();
  const user = await User.findOne({ google_id: user_id });
  if (!user) {
    return Response.json({ success: false, message: "User not found" });
  }
  if (!user?.access_token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  await refresh_access_token(user);
  const listResponse = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages",
    {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    }
  );
  const data = await listResponse.json();
  console.log("List Response:", data);

  // Fetch full content for each message concurrently.
  oauth2Client.setCredentials({
    access_token: user.access_token,
  });
  const emails = await Promise.all(
    data.messages.map((message: { id: string }) => getParsedEmail(message.id))
  );

  return Response.json({
    success: true,
    messages: emails, // your array of email contents
  });
}

async function getMessageContent(messageId: string) {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  try {
    const msg_res = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    });
    // const attach_res = await gmail.users.messages.attachments.get({
    //   userId: "me",
    //   messageId: messageId,
    // });
    // console.log(attach_res);
    console.log("Email Data:", msg_res.data);

    const payload = msg_res.data.payload;
    let bodyData = "";
    if (payload) {
      if (payload.parts) {
        for (const part of payload.parts) {
          if (part.mimeType === "text/plain" && part.body && part.body.data) {
            bodyData = Buffer.from(part.body.data, "base64").toString("utf-8");
            break;
          }
        }
      } else if (payload.body && payload.body.data) {
        bodyData = Buffer.from(payload.body.data, "base64").toString("utf-8");
      }
    }
    // console.log("Decoded Email Body:", bodyData);
    return { id: messageId, body: bodyData };
  } catch (error) {
    console.error("Error fetching email:", error);
    return { id: messageId, error: error.message };
  }
}
async function getMessageWithAttachments(messageId: string) {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  try {
    // Get full message details
    const res = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    });

    const payload = res.data.payload;
    const parsed = await simpleParser(payload as Source);
    console.log(parsed);
    const attachments = [];

    // Check if the message is multipart
    if (payload) {
      if (payload.parts) {
        for (const part of payload.parts) {
          // Look for parts with a filename (indicating an attachment)
          if (
            part.filename &&
            part.filename.length > 0 &&
            part.body?.attachmentId
          ) {
            const attachmentId = part.body.attachmentId;
            // Fetch the attachment data
            const attachmentRes = await gmail.users.messages.attachments.get({
              userId: "me",
              messageId: messageId,
              id: attachmentId,
            });
            // Decode the attachment content from base64url
            const attachmentData = Buffer.from(
              attachmentRes.data.data,
              "base64"
            ).toString("binary");
            attachments.push({
              filename: part.filename,
              mimeType: part.mimeType,
              data: attachmentData,
            });
          }
        }
      }
    }

    // You can also extract the email body here as needed.
    return { message: res.data, attachments };
  } catch (error) {
    console.error("Error fetching message with attachments:", error);
    throw error;
  }
}

async function getParsedEmail(messageId: string) {
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  try {
    // Request the raw format
    const res = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "raw",
    });

    // Decode the raw email (base64url encoded string)
    const rawMessage = res.data.raw;
    const decodedMessage = Buffer.from(rawMessage, "base64");

    // Parse the email using simpleParser
    const parsed = await simpleParser(decodedMessage);
    console.log("Parsed Email:", parsed);
    return parsed;
  } catch (error) {
    console.error("Error fetching and parsing email:", error);
    throw error;
  }
}
