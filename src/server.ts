const cors = require("cors");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/userRoutes");
require("dotenv").config();
const express = require("express");
const { onSocketConection } = require("./controllers/socketController");
const port = process.env.PORT || 3001;

let app = express(),
  server = require("http").createServer(app),
  io = require("socket.io")({
    cors: {
      origin: [process.env.FRONTEND_URL],
    },
  }).listen(server);

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(
  (
    _req: any,
    res: { setHeader: (arg0: string, arg1: string) => void },
    next: () => void
  ) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
  }
);
app.use(express.json());

io.on("connection", (socket: any) => onSocketConection(socket, io));

const routerLand = express.Router();
routerLand.get("/", (_req: any, _res: any, _next: any) => {});

app.use("/api/user", usersRoutes);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    server.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch((err: any) => {
    console.log(err);
  });
