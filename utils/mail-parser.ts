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
