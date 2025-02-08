import { google } from "googleapis";
import { oauth2Client } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const message_id = searchParams.get("message_id");
    const attachment_id = searchParams.get("attachment_id");

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const attachmentRes = gmail.users.messages.attachments.get({
      userId: "me",
      messageId: message_id,
      id: attachment_id,
    });
    console.log(attachmentRes);
    return Response.json({
      attachmentRes,
    });
  } catch (error) {
    console.log("Error while Fetching User Categories");
    return Response.json({
      error,
    });
  }
}
