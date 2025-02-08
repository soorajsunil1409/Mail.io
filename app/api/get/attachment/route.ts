export async function GET(request: Request) {
  try {
  } catch (error) {
    console.log("Error while fetching Attachment: ", error);
    return Response.json({
      success: false,
      error: "Error While getting Attachment",
    });
  }
}
