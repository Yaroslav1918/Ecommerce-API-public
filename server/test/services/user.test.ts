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
    avatar: "sdfsd",
  };

  it("Should create a new user", async () => {
    const newUser = await UserService.createUser(user);
    expect(newUser).toHaveProperty("_id");
    expect(newUser.name).toEqual("test");
    expect(newUser.email).toEqual("test@mail.com");
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

  it("Should update a password", async () => {
    const newUser = new UserRepo(user);
    await newUser.save();
    const userId = String(newUser._id);
    const newPassword = "1234567";
    const result = await UserService.updatePassword(newPassword, userId);
    expect(result.message).toEqual("Password is successfully changed");
    expect(result.status).toEqual(true);
  });

  it("Should varify a password", async () => {
       const newUser = await UserService.signUp(user);
       const userWithPassword = await UserService.getSingleUser(
         newUser._id.toString()
       );
    const userId = String(userWithPassword?._id);
    const password = "123456";
    const result = await UserService.verifyPassword(password, userId);
    expect(result).toEqual(true);
  });

  it("Should sign up  user", async () => {
    const newUser = await UserService.signUp(user);
    expect(newUser).toHaveProperty("_id");
    expect(newUser).toHaveProperty("name");
    expect(newUser).toHaveProperty("email");
  });

  it("Should sign in  user", async () => {
    const newUser = await UserService.signUp(user);
    const userWithPassword = await UserService.getSingleUser(
      newUser._id.toString()
    );
    const password = "123456";
    if (!userWithPassword?.password) return;
    const loggedInUser = await UserService.logIn(
      userWithPassword.email,
      password
    );
    expect(loggedInUser).toHaveProperty("accessToken");
    expect(loggedInUser).toHaveProperty("user");
  });

  it("Should not sign in user", async () => {
    const newUser = await UserService.signUp(user);
    const userWithPassword = await UserService.getSingleUser(
      newUser._id.toString()
    );
    const password = "1234567";
    if (!userWithPassword?.password) return;
    const loggedInUser = await UserService.logIn(
      userWithPassword.email,
      password
    );
    expect(loggedInUser.message).toBe("Password is not valid");
  });
});
