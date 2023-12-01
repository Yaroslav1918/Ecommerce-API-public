import { response } from "express";

import connect, { MongoHelper } from "../db-helper";
import UserService from "../../services/usersService";
import UserRepo from "../../models/UserModel";

describe("user service", () => {
  let mongoHelper: MongoHelper;

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
    avatar: "sdfsd"
  };

  it("Should create a new user", async () => {
    const newUser = await UserService.createUser(user);
    expect(newUser).toHaveProperty("_id");
    expect(newUser.name).toEqual("test");
    expect(newUser.email).toEqual("test@mail.com");
    expect(newUser.password).toEqual("123456");
  });

  it("Should return a list of users", async () => {
    const newUser = new UserRepo(user);
    await newUser.save();
    const users = await UserService.findAll();
    expect(users.length).toBe(1);
  });

  it("Should return one user by id", async () => {
    const newUser = new UserRepo(user);
    await newUser.save();
    const fetchedUser = await UserService.getSingleUser(String(newUser._id));
    expect(fetchedUser).toMatchObject(user);
  });

  it("Should update a user", async () => {
    const newUser = new UserRepo(user);
    await newUser.save();
    const userId = String(newUser._id);
    const updateData = {
      name: "updated",
      email: "updated@mail.com",
    };
    const updatedUser = await UserService.updateUser(userId, updateData);
    expect(updatedUser?.name).toEqual("updated");
    expect(updatedUser?.email).toEqual("updated@mail.com");
  });

  it("Should delete a user", async () => {
    const newUser = new UserRepo(user);
    await newUser.save();
    const userId = String(newUser._id);
    const deletedUser = await UserService.deleteUser(userId);
    expect(deletedUser).toMatchObject(user);
  });
});
