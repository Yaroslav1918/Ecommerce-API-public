import express from "express";

import usersController from "../controllers/users";
import { validate } from "../middlewares/validate";
import { updateUserSchema, userSchema } from "../schemas/userSchema";
import { emailChecker } from "../middlewares/emailChecker";
import { checkAuth } from "../middlewares/checkAuth";
import { checkRoles } from "../middlewares/checkRoles";
import { ROLE } from "../utils/role";
import passport from "passport";
import { checkPermission } from "../middlewares/checkPermissions";

const usersRouter = express.Router();

usersRouter.get(
  "/",
  checkAuth,
  checkRoles(ROLE.ADMIN),
  checkPermission("READ"),
  usersController.getAllUsers
);
usersRouter.get(
  "/:userId",
  checkAuth,
  checkRoles(ROLE.ADMIN),
  checkPermission("READ"),
  usersController.getSingleUser
);
usersRouter.post(
  "/",
  validate(userSchema),
  emailChecker,
  checkAuth,
  checkRoles(ROLE.ADMIN),
  checkPermission("CREATE"),
  usersController.createUser
);
usersRouter.put(
  "/:userId",
  validate(updateUserSchema),
  emailChecker,
  checkAuth,
  checkRoles(ROLE.ADMIN),
  checkPermission("UPDATE"),
  usersController.updateUser
);
usersRouter.delete(
  "/:userId",
  checkAuth,
  checkRoles(ROLE.ADMIN),
  checkPermission("DELETE"),
  usersController.deleteUser
);
usersRouter.post("/signup", emailChecker, usersController.signUp);
usersRouter.post("/login", usersController.logIn);
usersRouter.post(
  "/login-google",
  passport.authenticate("google-id-token", { session: false }),
  usersController.googleLogIn
);

export default usersRouter;
