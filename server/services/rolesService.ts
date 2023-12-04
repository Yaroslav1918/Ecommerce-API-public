import RoleRepo from "../models/RoleModel"

async function getAll() {
  return await RoleRepo.find().exec();
}

export default {
  getAll,
};
