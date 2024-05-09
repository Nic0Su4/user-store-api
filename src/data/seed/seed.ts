import { envs } from "../../config"
import { CategoryModel, MongoDatabase, ProductModel, UserModel } from "../mongo";
import { seedData } from "./data";


(async () => {

  MongoDatabase.connect({
    dbName: envs.MONGO_DB_NAME,
    mongoUrl: envs.MONGO_URL,
  })

  await main();

  await MongoDatabase.disconnect();

})();

const randomBetween0andX = ( x: number ) => {
  return Math.floor(Math.random() * x);
}

async function main() {

  // 0. Clean database
  await Promise.all([
    UserModel.deleteMany(),
    CategoryModel.deleteMany(),
    ProductModel.deleteMany(),
  ])

  // 1. Create users
  const users = await UserModel.insertMany(seedData.users);

  // 2. Create categories
  const categories = await CategoryModel.insertMany(
    seedData.categories.map( category => ({
      ...category,
      user: users[0]._id
    }) )
  );

  // 3. Create products
  const products = await ProductModel.insertMany(
    seedData.products.map(product => {

      const category = categories[randomBetween0andX(seedData.categories.length - 1)]._id;
      const user = users[randomBetween0andX(seedData.users.length - 1)]._id;

      return {
        ...product,
        category: category,
        user: user,
      }

    })
  )


  console.log('seeded')

}