import { google } from "googleapis";
<<<<<<< HEAD
import { oauth2Client } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const message_id = searchParams.get("message_id");
    const attachment_id = searchParams.get("attachment_id");

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const attachmentRes = gmail.users.messages.attachments.get({
=======
import { NextRequest } from "next/server";
import { oauth2Client, refresh_access_token } from "@/lib/auth";
import { connect_DB } from "@/utils/DB";
import { IUser, User } from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const searchUrlParams = request.nextUrl.searchParams;
    const user_id = searchUrlParams.get("user_id");
    const message_id = searchUrlParams.get("message_id");
    const attachment_id = searchUrlParams.get("attachment_id");

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    await connect_DB();
    const user = await User.findOne<IUser>({ google_id: user_id });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not Found",
        },
        {
          status: 404,
        }
      );
    }
    await refresh_access_token(user);
    oauth2Client.setCredentials({
      access_token: user.access_token,
    });
    const attachmentRes = await gmail.users.messages.attachments.get({
>>>>>>> f73d75c4754c28cd5975b1effa79da5d990dc3ed
      userId: "me",
      messageId: message_id,
      id: attachment_id,
    });
<<<<<<< HEAD
    console.log(attachmentRes);
=======
    const base64Data = attachmentRes.data.data;
    const fileBuffer = Buffer.from(base64Data, "base64");
    const contentType =
      attachmentRes.headers["content-type"] || "application/octet-stream";
    return Response.json({
      fileBuffer,
      contentType,
    });
  } catch (error) {
    console.log("Error while fetching Attachment: ", error);
>>>>>>> f73d75c4754c28cd5975b1effa79da5d990dc3ed
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
