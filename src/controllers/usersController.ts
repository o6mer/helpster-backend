import { Request, Response, NextFunction } from "express";
const { User } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).json({ message: "Can not login, invalid inputs" });
    return next();
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(401)
        .json({ message: "Can not login, invalid email or password" });
      return next();
    }

    if (!(await bcrypt.compare(password, user.password))) {
      res
        .status(401)
        .json({ message: "Can not login, invalid email or password" });
      return next();
    }

    res
      .status(200)
      .json({ username: user.username, email: user.email, roll: user.roll });
  } catch (err) {}
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, username, roll } = req.body;

  if (!email || !password || !username) {
    res.status(401).json({ message: "Can not create usesr, invalid inputs" });
    return next();
  }

  try {
    const isUserExist = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserExist) {
      return res
        .status(400)
        .json({ message: "Can not create user, user already exists" });
      // return next();
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    let newUser = new User({
      email,
      password: hashedPassword,
      username,
      roll,
      id: uuidv4(),
    });
    newUser = await newUser.save();
    res.status(200).json({ username, email, roll });
  } catch (err) {
    res.status(500).json({ message: "Can not create user, " + err });
    return next();
  }
};

export { login, signup };
