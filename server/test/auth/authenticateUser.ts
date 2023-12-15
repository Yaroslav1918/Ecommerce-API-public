import request from "supertest";

import RoleRepo from "../../models/RoleModel";
import app from "../../app";
import { CreateUserInput } from "User";

export async function authenticateUser() {
  const role = new RoleRepo({
    name: "ADMIN",
    permissions: ["READ", "CREATE", "DELETE", "UPDATE"],
  });
  await role.save();
  const user: CreateUserInput = {
    name: "testName",
    email: "test1234@mail.com",
    password: "123456",
    avatar: "sdfsdf",
    role: role._id.toString(),
  };
  await request(app).post("/users/signup").send(user);
  const loginResponse = await request(app)
    .post("/users/login")
    .send({ email: "test1234@mail.com", password: "123456" });
  const accessToken = loginResponse.body.accessToken;
  return accessToken;
}
