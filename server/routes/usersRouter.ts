import express from "express";
import passport from "passport";

import usersController from "../controllers/users";
import { validate } from "../middlewares/validate";
import { updateUserSchema, userSchema } from "../schemas/userSchema";
import { emailChecker } from "../middlewares/emailChecker";
import { checkAuth } from "../middlewares/checkAuth";
import { checkRoles } from "../middlewares/checkRoles";
import { ROLE } from "../utils/role";


const usersRouter = express.Router();

usersRouter.get(
  "/",
  checkAuth,
  checkRoles(ROLE.ADMIN),
  usersController.getAllUsers
);
usersRouter.get(
  "/:userId",
  checkAuth,
  checkRoles(ROLE.ADMIN),
  usersController.getSingleUser
);
usersRouter.post(
  "/",
  validate(userSchema),
  emailChecker,
  checkAuth,
  checkRoles(ROLE.ADMIN),
  usersController.createUser
);
usersRouter.post(
  "/verify-password",
  checkAuth,
  checkRoles(ROLE.ADMIN, ROLE.USER),
  usersController.verifyPassword          
);
usersRouter.post(
  "/change-password",
  checkAuth,
  checkRoles(ROLE.ADMIN, ROLE.USER),
  usersController.changePassword          
);
usersRouter.put(
  "/:userId",
  validate(updateUserSchema),
  emailChecker,
  checkAuth,
  checkRoles(ROLE.ADMIN),
  usersController.updateUser
);
usersRouter.delete(
  "/:userId",
  checkAuth,
  checkRoles(ROLE.ADMIN),
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
