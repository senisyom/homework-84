import express from "express";
import auth, { RequestWithUser } from "../middleware/auth";
import Task from "../models/Task";
import { log } from "console";

const taskRouter = express.Router();

taskRouter.post(
  "/",
  auth,
  async (req: RequestWithUser, res, next): Promise<any> => {
    try {
      if (!req.user) {
        return res.status(401).send({ error: "User not found" });
      }

      const task = new Task({
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
      });

      await task.save();

      return res.send(task);
    } catch (error) {
      next(error);
    }
  }
);

taskRouter.get(
  "/",
  auth,
  async (req: RequestWithUser, res, next): Promise<any> => {
    try {
      if (!req.user) {
        return res.status(401).send({ error: "User not found" });
      }
      const tasks = await Task.find({ user: req.user._id });

      return res.send(tasks);
    } catch (error) {
      next(error);
    }
  }
);

taskRouter.put(
  "/:id",
  auth,
  async (req: RequestWithUser, res, next): Promise<any> => {
    try {
      if (!req.user) {
        return res.status(401).send({ error: "User not found" });
      }
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(401).send({ error: "Task not found" });
      }

      if (String(req.user._id) !== String(task.user)) {
        return res.status(403).send({ error: "You dont have editing rights" });
      }

      const newTask = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
      };
      const updateTask = await Task.findOneAndUpdate(
        { _id: req.params.id },
        newTask
      );

      return res.send(updateTask);
    } catch (error) {
      next(error);
    }
  }
);

taskRouter.delete(
  "/:id",
  auth,
  async (req: RequestWithUser, res, next): Promise<any> => {
    try {
      if (!req.user) {
        return res.status(401).send({ error: "User not found" });
      }

      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(401).send({ error: "Task not found" });
      }

      if (String(req.user._id) !== String(task.user)) {
        return res
          .status(403)
          .send({ error: "You do not have permission to delete" });
      }

      await Task.deleteOne({ _id: req.params.id });
      return res.send(task);
    } catch (error) {
      next(error);
    }
  }
);

export default taskRouter;
