import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

interface IUser extends Document {
    _id: string,
    name: string,
    email: string,
    password: string,
    photo: string,
    role: "admin" | "user",
    gender: "male" | "female",
    dob: Date,
    createdAt: Date,
    updatedAt: Date,

    // virtual attribute
    age: number,

    // method to check passowrd
    isPasswordCorrect(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please enter Name"],
    },
    email: {
      type: String,
      required: [true, "Please enter Email"],
      trim: true,
      unique: [true, "Email already registered"],
      lowercase: true,
      validate: validator.default.isEmail,
    },
    password: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: [true, "Please add Photo"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Please enter Gender"],
    },
    dob: {
      type: Date,
      required: [true, "Please enter DOB"],
    },
  },
  { timestamps: true } 
);

userSchema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  )
    age--;

  return age;
});

// encrypt the password
userSchema.pre("save", async function(next) {
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
})

// check the passowrd is correct or not
userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
}



export const User = mongoose.model<IUser>("User", userSchema);

export {IUser}