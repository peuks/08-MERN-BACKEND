import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

/**
 * User's schema model for the Database
 * At registration: pseudo,email & password are required
 */
const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "fucker"],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png",
    },
    bio: {
      type: String,
      max: 1024,
    },
    // User have followers
    followers: {
      type: [String],
    },
    // User is following
    following: {
      type: [String],
    },
    // User likes Posts
    likes: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * play function before save into display: 'block',
 * ! using function permit us to use this...
 */
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  const auth = await bcrypt.compare(password, user.password);
  if (user) {
    auth
      ? user
      : () => {
          throw Error("incorrect password");
        };
  }
  throw Error("incorrect email");
};

const User = mongoose.model("user", userSchema);

export default User;
