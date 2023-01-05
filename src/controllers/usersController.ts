import { Request, Response, NextFunction } from "express";
const { User } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

    const { id, username, role } = user;

    const token = jwt.sign({ id, username, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ id, username, role, token });
  } catch (err) {
    res.status(500).json({ message: "Can not create user, " + err });
    return next();
  }
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, username, role } = req.body;

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
      role,
      id: uuidv4(),
    });
    newUser = await newUser.save();

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Can not create user, " + err });
    return next();
  }
};

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const user = await checkToken(token);

    // If the user is not found, return a 401 status
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // If the user is found, return the user data
    const { id, username, role } = user;

    res.status(200).json({ id, username, role });
  } catch (error) {
    // If the token is invalid, return a 401 status
    return res.status(401).send({ message: "Unauthorized" });
  }
};

const checkToken = async (token: string) => {
  try {
    if (!token) return;

    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ id: decodedUser.id });

    return user;
  } catch (err) {
    console.log(err);
  }
};

export { login, signup, auth, checkToken };
