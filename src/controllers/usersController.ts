const { User } = require("../models/userModel");

const login = (req: any, res: any) => {
  console.log(req.body);
};

const signup = async (req: any, res: any, next: any) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    res.status(401).json({ message: "Can not create usesr, invalid inputs" });
    return next();
  }

  console.log(email, password, username);

  try {
    let newUser = new User({ email, password, username });
    newUser = await newUser.save();
    res.status(200).json({ ...newUser.toObject() });
  } catch (err) {
    console.log(err);
  }
};

exports.login = login;
exports.signup = signup;

export {};
