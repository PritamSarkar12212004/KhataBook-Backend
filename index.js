// requre paages and modules
import express from "express";
import fs from "fs";
import cors from "cors";
import "dotenv/config";
const app = express();

//setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//route

app.post("/api/khatabook/create", (req, res, next) => {
  try {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");

    const currentTime = `${seconds}-${minutes},${hours}-${day}-${month}-${year}`;
    const data = req.body.info;

    fs.writeFile(`./src/file/${currentTime}.txt`, data, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Data saved to file");
    });
    res.send("data saved");
  } catch (err) {
    next(err);
  }
});
app.get("/api/khatabook/show", (req, res, next) => {
  try {
    const files = fs.readdirSync("./src/file");
    res.send(files);
  } catch (err) {
    next(err);
  }
});
app.post("/api/khatabook/delete", async (req, res, next) => {
  try {
    const { item } = await req.body;
    fs.unlink(`./src/file/${item}`, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("File deleted successfully");
    });
    res.send("data deleted");
  } catch (err) {
    ``;
    next(err);
  }
});

let datas = "";

app.post("/api/khatabook/read", (req, res, next) => {
  try {
    const data = req.body.item;
    const resPonse = fs.readFileSync(`./src/file/${data}`, "utf8");
    datas = resPonse;
    res.json(resPonse);
  } catch (err) {
    next(err);
  }
});
app.get("/api/khatabook/read/res", (req, res, next) => {
  try {
    res.send(datas);
  } catch (err) {
    next(err);
  }
});
let data2 = "";
let data3 = "";
app.post("/api/khatabook/update", async (req, res, next) => {
  try {
    const data = req.body.item;
    const resPonse = fs.readFileSync(`./src/file/${data}`, "utf8");
    data2 = resPonse;
    data3 = data;
    res.json(resPonse);
  } catch (err) {}
});
app.get("/api/khatabook/update/res", (req, res, next) => {
  try {
    res.send({ data2, data3 });
  } catch (err) {
    next(err);
  }
});
app.post("/api/khatabook/update/res/final", (req, res, next) => {
  try {
    const { data, send } = req.body;
    const Maindata = data.info;
    console.log(Maindata, send);
    fs.writeFile(`./src/file/${send}`, Maindata, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Data saved to file");
    });
    res.send("data saved");

  } catch (err) {
    next(err);
  }
});
//erroe handlaing middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// create  port
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
