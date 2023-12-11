import CategoryService from "../../services/categoriesService";
import CategoryRepo from "../../models/CategoryModel"
import connect, { MongoHelper } from "../db-helper";

describe("Categories Service", () => {
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

  const category = {
    name: "test",
    images: ["image1", "image2"]
  };

  it("Should create a new category", async () => {
    const newCategory = await CategoryService.createCategory(category);
    expect(newCategory).toHaveProperty("_id");
    expect(newCategory.name).toEqual("test");
  });

  it("Should return a list of all categories", async () => {
    const newCategory = new CategoryRepo(category)
    await newCategory.save()
    const categories = await CategoryService.getAll()
    expect(categories.length).toBe(1)
  });

  it("Should return one category by id", async () => {
    const newCategory = new CategoryRepo(category)
    await newCategory.save()
    const fetchedCategory = await CategoryService.getSingle(String(newCategory._id))
    expect(fetchedCategory).toMatchObject(category)
  });

  it("Should return one category by name", async () => {
    const newCategory = new CategoryRepo(category)
    await newCategory.save()
    const fetchedCategory = await CategoryService.getSingleByName(newCategory.name)
    expect(fetchedCategory).toMatchObject(category)
  });

  it("Should return updated category", async () => {
    const newCategory = new CategoryRepo(category)
    await newCategory.save()
    const categoryId = String(newCategory._id)
    const updateData = {
      name: "updated test",
      images: ["updated 1", "updated 2", "updated 3"]
    }
    const updatedCategory = await CategoryService.updateCategory(categoryId, updateData)
    expect(updatedCategory?.name).toEqual("updated test")
    expect(updatedCategory?.images.length).toBe(3)
  });

  it("Should not update a category if an empty images array is passed", async () => {
    const newCategory = new CategoryRepo(category)
    await newCategory.save()
    const categoryId = String(newCategory._id)
    const updateData = {
      name: "updated test",
      images: ["updated 1", "updated 2", "updated 3"]
    }
    const updatedCategory = await CategoryService.updateCategory(categoryId, updateData)
    expect(updatedCategory?.name).toEqual("updated test")
    expect(updatedCategory?.images.length).toBe(3)
  });

  it("Should delete a category", async () => {
    const newCategory = new CategoryRepo(category)
    await newCategory.save()
    const isDeleted = await CategoryService.deleteCategory(String(newCategory._id))
    const categories = await CategoryRepo.find()
    expect(isDeleted?._id).toEqual(newCategory._id)
    expect(categories.length).toBe(0)
  });
  
});
