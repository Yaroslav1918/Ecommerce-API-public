import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepo from "../models/UserModel";
import RoleRepo from "../models/RoleModel";
import { CreateUserInput, User, UserUpdate } from "../types/User";
import { RoleName } from "../utils/role";

async function findAll() {
  const users = await UserRepo.find().populate("role", "name").exec();
  return users.map((user) => {
    const modifiedUser = user.toObject();
    delete modifiedUser.password;
    return {
      ...modifiedUser,
      role: (user.role as unknown as RoleName).name,
    };
  });
}

async function getSingleUser(index: string) {
  const id = new mongoose.Types.ObjectId(index);
  const user = await UserRepo.findById(id);
  return user;
}

async function createUser(user: CreateUserInput) {
  const newUser = new UserRepo(user);
  await newUser.save();
  const foundRole = await RoleRepo.findById({ _id: newUser.role });
  const { _id, name, email, avatar } = newUser;
  return {
    _id,
    name,
    email,
    role: foundRole?.name,
    avatar,
  };
}

async function updateUser(index: string, user: UserUpdate) {
  const updatedUser = await UserRepo.findOneAndUpdate({ _id: index }, user, {
    new: true,
  });
  if (!updatedUser) {
    return null;
  }
  const foundRole = await RoleRepo.findById({ _id: updatedUser.role });
  const { _id, name, email, avatar } = updatedUser;
  return {
    _id,
    name,
    email,
    role: foundRole?.name,
    avatar,
  };
}

async function deleteUser(index: string) {
  const deletedUser = await UserRepo.findOneAndDelete({ _id: index });
  return deletedUser;
}

async function signUp(userInfo: CreateUserInput) {
  const { name, email, role, avatar, password } = userInfo;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new UserRepo({
    name,
    email,
    role,
    avatar,
    password: hashedPassword,
  });
  await user.save();
  const foundRole = await RoleRepo.findById({ _id: user.role });
  if (!foundRole) {
    return null;
  }
  const newUser = { name, email, avatar, role: foundRole.name };
  return newUser;
}

async function logIn(email: string, password: string) {
  const foundUser = await UserRepo.findOne({ email: email });
  if (!foundUser || !foundUser.password) {
    return null;
  }
  const isValid = bcrypt.compareSync(password, foundUser.password);
  const foundRole = await RoleRepo.findById({ _id: foundUser.role });
  console.log(foundRole?.permissions);
  if (!foundRole || !isValid) {
    return null;
  }
  const payload = {
    userId: foundUser._id,
    email: foundUser.email,
    role: foundRole.name,
    permissions: foundRole.permissions,
  };

  const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
    expiresIn: "1h",
  });
  const user = {
    _id: foundUser._id,
    name: foundUser.name,
    role: foundRole.name,
    email: foundUser.email,
    avatar: foundUser.avatar,
  };
  return { accessToken, user };
}

async function googleLogin(userInfo: User) {
  const foundRole = await RoleRepo.findById({ _id: userInfo.role });
  if (userInfo && foundRole) {
    const payload = {
      userId: userInfo._id,
      email: userInfo.email,
      role: foundRole.name,
      permissions: foundRole.permissions,
    };
    const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
      expiresIn: "1h",
    });
    const user = JSON.parse(JSON.stringify(userInfo));
    user.role = foundRole.name;
    return { accessToken, user };
  }
  return null;
}

export default {
  findAll,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  signUp,
  logIn,
  googleLogin,
};
