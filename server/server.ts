import mongoose from "mongoose";
import "dotenv/config";

import app from "./app";

const port = process.env.PORT || 5000;
const mongoURL = process.env.DB_URL_COMMON as string;
mongoose.connect(mongoURL).then(() => console.log("Connected!"));
app.listen(port, () => {
  console.log(`👀 Server is running on localhost:${port}`);
});
