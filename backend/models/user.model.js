import { Schema, model } from "mongoose";
import { type } from "os";

const userSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true , unique : true },
  password: { type: String, required: true },
});

const User = model("user", userSchema)

export default User