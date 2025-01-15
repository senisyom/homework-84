import express from "express";
import User from "../models/User";
import mangoose from "mongoose";

const userRouter = express.Router();

userRouter.post("/", async (req, res, next): Promise<any> => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    user.generateToken();

    await user.save();
    return res.send(user);
  } catch (error) {
    if (error instanceof mangoose.Error.ValidationError) {
      return res.status(400).send(error);
    }

    return next(error);
  }
});

userRouter.post("/session", async (req, res, next): Promise<any> => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(400).send({ error: "Username not found!" });
    }

    const isMatch = await user.checkPassword(req.body.password);

    if (!isMatch) {
      return res.status(400).send({ error: "Wrong password" });
    }

    user.generateToken();
    await user.save();

    return res.send(user);
  } catch (error) {
    return next(error);
  }
});

export default userRouter;
