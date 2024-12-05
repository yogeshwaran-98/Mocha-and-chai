import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  console.log("Inside register controller");
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "missing fields" });
    }
    console.log(name, email, password);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!createUser) {
      return res.status(400).json({ msg: "Something went wrong" });
    }

    return res.status(200).json({ msg: "User created successfully" });
  } catch (err) {
    console.log(err);
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username && password && username == "admin" && password == "admin") {
      return res.status(200).json({ status: "success" });
    }
    return res.status(401).json({ status: "failure" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: "error", message: "An unexpected error occurred" });
  }
};
