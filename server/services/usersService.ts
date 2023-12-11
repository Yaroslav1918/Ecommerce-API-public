import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepo from "../models/UserModel";
import RoleRepo from "../models/RoleModel";
import { CreateUserInput, User, UserUpdate } from "../types/User";

async function findAll() {
  const users = await UserRepo.find().populate("role", "name").exec();
  return Promise.all(
    users.map(async (user) => {
      const modifiedUser = user.toObject();
      const roleName = await RoleRepo.findById(user.role);
      delete modifiedUser.password;
      return {
        ...modifiedUser,
        role: roleName?.name, 
      };
    })
  );
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
  const newUser = { _id: user._id, name, email, avatar, role: foundRole?.name };
  return newUser;
}

async function logIn(loginEmail: string, loginPassword: string) {
  const foundUser = await UserRepo.findOne({ email: loginEmail });
  if (
    !foundUser ||
    foundUser.isGoogleLoggedIn ||
    !foundUser.password ||
    !bcrypt.compareSync(loginPassword, foundUser.password)
  ) {
    return {
      message: !foundUser
        ? "Email is not found"
        : foundUser.isGoogleLoggedIn
        ? "Please log in via Google."
        : "Password is not valid",
      status: false,
    };
  }
  const { avatar, name, _id, email, role } = foundUser.toObject();
  const foundRole = await RoleRepo.findById({ _id: role });
  const payload = {
    userId: _id,
    email,
    role: foundRole?.name,
    permissions: foundRole?.permissions,
  };
  const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
    expiresIn: "1h",
  });
  const user = {
    _id,
    name,
    role: foundRole?.name,
    email,
    avatar,
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

async function verifyPassword(password: string, userId: string) {
  const foundUser = await UserRepo.findOne({ _id: userId });
  if (!foundUser || !foundUser?.password) {
    return null;
  }
  return bcrypt.compareSync(password, foundUser.password);
}

async function updatePassword(newPassword: string, userId: string) {
  const foundUser = await UserRepo.findOne({ _id: userId });
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  if (!foundUser || !foundUser?.password) {
    return {
      message: !foundUser ? "User is not found" : "Password is not found",
      status: false,
    };
  }
  foundUser.password = hashedPassword;
  await foundUser.save();
  return {
    message: "Password is successfully changed",
    status: true,
  };
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
  verifyPassword,
  updatePassword,
};
