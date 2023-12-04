import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { Role } from "../utils/role";


export interface DecodedUser extends JwtPayload {
  userId: string;
  email: string;
  role: Role;
  permissions: string[];
}

export interface WithAuthRequest extends Request {
  decoded?: DecodedUser;
}

