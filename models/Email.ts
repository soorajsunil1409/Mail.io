import mongoose, { Document, Schema } from "mongoose";

export interface IEmail extends Document {
  user_id: Schema.Types.ObjectId;
  subject: string;
  body: string;
  sender: string;
  dateRecieved: Date;
  category: "Event" | "Important" | "Acheivement";
  parsedData: object;
}

const EmailSchema = new Schema<IEmail>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: String,
  body: String,
  sender: String,
  dateRecieved: Date,
  category: {
    type: String,
    enum: ["Event", "Important", "Acheivement"],
    required: true,
  },
  parsedData: Object,
});

export const Email =
  mongoose.models.Email || mongoose.model<IEmail>("Email", EmailSchema);
