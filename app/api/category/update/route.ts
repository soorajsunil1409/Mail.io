import { IUser, User } from "@/models/User";
import { connect_DB } from "@/utils/DB";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, categories } = body;
    console.log(body);
    await connect_DB();
    const user = await User.findOne<IUser>({ google_id: user_id });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User Not Found",
        },
        {
          status: 404,
        }
      );
    }
    user.categories = categories;
    user.messages = user.messages.filter((msg) =>
      categories.some((category) => category.name === msg.category)
    );
    if (user.categories.length == 0) {
      user.categories.push({ name: "General", description: "All the Emails" });
    }
    await user.save();
    return Response.json({
      success: true,
      message: "User Categories Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        error,
      },
      { status: 500 }
    );
  }
}
