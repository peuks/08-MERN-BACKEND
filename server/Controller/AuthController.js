import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * @Route('api/users/register')
 */
const secret = "test";

const signup = async (req, res) => {
  const { email, password, pseudo } = req.body;

  try {
    const emailCondition = await User.findOne({ email });
    const pseudoCondition = await User.findOne({ pseudo });

    if (emailCondition)
      return res.status(400).json({ email: "User already exists" });
    if (pseudoCondition)
      return res.status(400).json({ pseudo: "already already taken" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      pseudo,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "1h",
    });

    res.status(201).json({ result, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ test: error.message });

    console.log(error._message);
  }
};

/**
 * @Route('api/users/login')
 */

const signin = async (req, res) => {
  const { email, password } = req.body;

  // try {
  const oldUser = await User.findOne({ email });

  if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

  const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

  if (!isPasswordCorrect)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
    expiresIn: "1h",
  });

  res.status(200).json({ result: oldUser, token });
  // } catch (err) {
  //   res.status(500).json({ message: "Something went wrong" });
  // }
};

/**
 * @Route('api/users/logout')
 */
const logout = async (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

export { logout, signin, signup };
