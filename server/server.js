import dotenv from "dotenv";

// Local overrides take precedence; deployments continue using normal .env/environment values.
dotenv.config({ path: ".env.local", override: true });
dotenv.config();

const [{ default: app }, { connectDB }, { checkEnv }] = await Promise.all([
  import("./src/app.js"),
  import("./src/config/db.js"),
  import("./src/config/env.js"),
]);

checkEnv();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
});
