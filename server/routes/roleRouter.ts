import express from "express";

import rolesController from "../controllers/role";
import { checkAuth } from "../middlewares/checkAuth";
import { checkRoles } from "../middlewares/checkRoles";
import { ROLE } from "../utils/role";


const rolesRouter = express.Router();

rolesRouter.get(
  "/",
  checkAuth,
  checkRoles(ROLE.ADMIN),
  rolesController.getAllRoles
);


export default rolesRouter;
