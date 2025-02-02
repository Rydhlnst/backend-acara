import mongoose from "mongoose";

export interface User {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    role: string;
    profilePicture: string;
    isActive: boolean;
    activationCode: string;
}

const Schema = mongoose.Schema;

// Schema untuk user
const userSchema = new Schema<User>({
     fullName: {
        type: Schema.Types.String,
        required: true
     },
     userName: {
        type: Schema.Types.String,
        required: true
     },
     email: {
        type: Schema.Types.String,
        required: true
     },
     password: {
        type: Schema.Types.String,
        required: true
     },
     role: {
      type: Schema.Types.String,
      enum: ["admin", "user"],
      default: "user",
     },
     profilePicture: {
      type: Schema.Types.String,
      default: "user.jpg"
     },
     isActive: {
      type: Schema.Types.Boolean,
      default: false,
     },
     activationCode: {
      type: Schema.Types.String,
     }
}, {
   // Mengetahui kapan data dibuat
   timestamps: true});


// Nama untuk tabel datanya "User"   
const userModel = mongoose.model("User", userSchema);

export default userModel;