import mongoose from "mongoose";
import { encrypt } from "../utils/encryption";
import { renderMailHtml, sendMail } from "../utils/mail/mail"
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../utils/env";

export interface User {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    role: string;
    profilePicture: string;
    isActive: boolean;
    activationCode: string;
    createdAt?: string;
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

// Middleware
// Sebelum disave akan "PRE" dan akan mengencrypt password
userSchema.pre("save", function(next) {
   const user = this;
   user.password = encrypt(user.password);
   next();
})

userSchema.post("save", async function (doc, next) {
   try {
      const user = doc;
   
      console.log("Send Email to:", user.email);

      const contentMail = await renderMailHtml("registrationSuccess.ejs", {
         userName: user.userName,
         fullName: user.fullName,
         email: user.email,
         createdAt: user.createdAt,
         activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
      });

      await sendMail({
         from: EMAIL_SMTP_USER,
         to: user.email,
         subject: "Account Activation",
         html: contentMail,
      });
   } catch (error) {
      console.log("error > ", error);
   } finally {
         // Memastikan jika sudah semua proses dilakukan
      next();
   }
})

// Menghilangkan password di JSON tetapi tetap bisa login
userSchema.methods.toJSON = function() {
   const user = this.toObject();
   delete user.password;
   return user;
}

// Nama untuk tabel datanya "User"  
const userModel = mongoose.model("User", userSchema);

export default userModel;