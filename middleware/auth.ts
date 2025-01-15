import { Request, Response, NextFunction } from "express";
import { HydratedDocument } from "mongoose";
import { UserFields } from "../types";
import User from "../models/User";

export interface RequestWithUser extends Request {
  user?: HydratedDocument<UserFields>;
}

const auth = async (
  expressReq: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const req = expressReq as RequestWithUser;

  const headerValue = req.get("Authorization");

  if (!headerValue) {
    res.status(401).send({ error: 'Header "Authorization" not found' });
    return;
  }

  const [_bearer, token] = headerValue.split(" ");

  if (!token) {
    res.status(401).send({ error: "Token not found" });
    return;
  }

  const user = await User.findOne({ token });

  if (!user) {
    res.status(401).send({ error: "Wrong Token!" });
    return;
  }

  req.user = user;

  next();
};

export default auth;
