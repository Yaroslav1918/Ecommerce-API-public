import request from "supertest";
import jwt from "jsonwebtoken";

import connect, { MongoHelper } from "../db-helper";
import app from "../../app";
import UserRepo from "../../models/UserModel";
import { authenticateUser } from "../auth/authenticateUser";
import { DecodedUser } from "../../types/Auth";

describe("User controller", () => {
  let mongoHelper: MongoHelper;
  let accessToken: string;

  beforeEach(async () => {
    accessToken = await authenticateUser();
  });

  beforeAll(async () => {
    mongoHelper = await connect();
  });

  afterEach(async () => {
    await mongoHelper.clearDatabase();
  });

  afterAll(async () => {
    await mongoHelper.closeDatabase();
  });

  const user = {
    name: "test",
    email: "test@mail.com",
    password: "123456",
    avatar: "zxdgfdsv",
  };

  it("Should create a new user", async () => {
    const response = await request(app)
      .post("/users")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(user);
    expect(response.body.user).toHaveProperty("_id");
    expect(response.body.user).toEqual({
      _id: expect.any(String),
      name: "test",
      email: "test@mail.com",
      avatar: "zxdgfdsv",
    });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created");
  });

  it("Should return a list of users", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.body.length).toBe(1);
  });

  it("Should return one user by id", async () => {
    const newUser = new UserRepo(user);
    await newUser.save();
    const response = await request(app)
      .get(`/users/${newUser._id}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.body.user).toMatchObject(user);
    expect(response.status).toBe(200);
  });

  it("Should update a user", async () => {
    const newUser = new UserRepo(user);
    await newUser.save();
    const response = await request(app)
      .put(`/users/${newUser._id}`)
      .send({ name: "updated", email: "updated@mail.com" })
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.body.user.name).toBe("updated");
    expect(response.body.user.email).toBe("updated@mail.com");
    expect(response.status).toBe(200);
  });

  it("Should delete a user", async () => {
    const newUser = new UserRepo(user);
    await newUser.save();
    const response = await request(app)
      .delete(`/users/${newUser._id}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted");
  });

  it("Should verify a password", async () => {
    const decodedUser = jwt.verify(
      accessToken,
      process.env.TOKEN_SECRET as string
    ) as DecodedUser;
    const response = await request(app)
      .post("/users/verify-password")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ password: "123456", userId: decodedUser.userId });
    expect(response.body.message).toBe("Password is valid");
  });

  it("Should not verify a password", async () => {
    const decodedUser = jwt.verify(
      accessToken,
      process.env.TOKEN_SECRET as string
    ) as DecodedUser;
    const response = await request(app)
      .post("/users/verify-password")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ password: "12345", userId: decodedUser.userId });
    expect(response.body.error).toBe("Password is not valid");
  });

  it("Should change a password", async () => {
    const decodedUser = jwt.verify(
      accessToken,
      process.env.TOKEN_SECRET as string
    ) as DecodedUser;
    const response = await request(app)
      .post("/users/change-password")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ newPassword: "12345678", userId: decodedUser.userId });
    expect(response.body.message).toBe("Password is successfully changed");
  });

  it("Should sign up", async () => {
    const response = await request(app).post("/users/signup").send({
      name: "test",
      email: "test@mail.com",
      password: "123456",
      avatar: "zxdgfdsv",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User created");
  });

  it("Should sign in", async () => {
    await request(app).post("/users/signup").send({
      name: "test",
      email: "test@mail.com",
      password: "123456",
      avatar: "zxdgfdsv",
    });

    const response = await request(app).post("/users/login").send({
      email: "test@mail.com",
      password: "123456",
    });
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("user");
  });
});
