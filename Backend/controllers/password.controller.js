import User from "../models/user.model.js";
import generateToken from "../util/generateToken.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;
      

    if (!email) {
      res.status(400).json({
        msg: "Invalid Credentials",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json("Invalid Email");
    } else {
      const token = generateToken(user);

      const transporter = nodemailer.createTransport({
        service: "GMAIL",
        auth: {
          user: process.env.MYEMAIL,
          pass: process.env.MYPASS,
        },
      });

      const mailOption = {
        from: process.env.MYEMAIL,
        to: email,
        subject: "SENDING EMAIL TO RESET PASSWORD",
        text: `http://localhost:3500/api/resetPassword/${token}`,
      };

        await transporter.sendMail(mailOption);
        
        res.status(200).json("Email Sent Successfully .. Please Check your Gmail")

    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
      

    const { newPassword } = req.body;

    const isVerify = jwt.verify(token, process.env.SECRET_KEY);
      
    if (!isVerify) {
      res.status(400).json("Invalid Token");
    } else {
      const hash = await bcrypt.hash(newPassword, 10);

      await User.updateOne({ _id: isVerify.id }, { $set: { password: hash } });

      res.status(201).json("Password Updated");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export {forgotPassword , resetPassword}