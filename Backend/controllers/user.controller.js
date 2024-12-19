import User from "../models/user.model.js";

import bcrypt from "bcrypt";
import generateToken from "../util/generateToken.js";

const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      res.status(400).json({
        msg: "Invalid Credentials",
      });
    }

    const isExistUser = await User.findOne({ email });

    if (isExistUser) {
      res.status(400).json("User already exist");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        userName,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        msg: "User Created",
        user: newUser,
      });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        msg: "Invalid Credentials",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(200).json({
        msg: "Please register first",
      });
    } else {
      const isValidPassword = await bcrypt.compare(password, user.password);


      if (isValidPassword) {
        res
          .status(200)
          .json({ msg: "Logged In successfully", token: generateToken(user) });
      } else {
        res.status(400).json({
          msg: "Invalid Password",
        });
      }
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};


export { register, login , home };
