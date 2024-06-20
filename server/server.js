const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
// const path = require("path");
const app = express();

const port = process.env.PORT || 5001;
// const staticPath = path.resolve(__dirname, "dist");

// setup middleware 
// app.use(express.static(staticPath));



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://post-672j.onrender.com",
    methods: ["GET", "POST"],
  },
});

//チャットアプリから以下のonとemitのみ修正
let nextUserId = 1; // 次のユーザIDを管理

io.on("connection", (socket) => {
  console.log("New client connected");

  const userId = nextUserId++;
  const userName = `User ${userId}`;
  const id = socket.id
  console.log(id)

  //socketは自分のみ
  socket.emit("your_data", { userId, userName ,id});

    socket.on ("text_value",text => {
      console.log(text)
      //ioはみんなに
      io.emit("send_message",{ userId, userName, text ,id})
  })
//   //クライアントから受信
//   socket.on ("user",user => {
//       console.log(user)
//       io.emit("user",user);
//   })
  
//   socket.on("reset", user => {
//       console.log("リセットイベント受信");
//       io.emit("reset", user);
//   })

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

// if (process.env.NODE_ENV === "production") {
//   app.get("*", (req, res) => {
//     const indexFile = path.join(__dirname, "dist", "index.html");
//     return res.sendFile(indexFile);
//   });
// }

server.listen(port, () => console.log(`server listening on port ${port}`));
