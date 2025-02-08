import { google } from "googleapis";
import { oauth2Client } from "../../../../lib/auth";

export async function GET(request: Request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const message_id = searchParams.get("message_id");
    const attachment_id = searchParams.get("attachment_id");

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const attachmentRes = await gmail.users.messages.attachments.get({
      userId: "me",
      messageId: message_id, // The ID of the email containing the attachment
      id: attachment_id, // The attachmentId from the email's payload part
    });
  } catch (error) {
    console.log("Error while Fetching User Categories");
  }
}
