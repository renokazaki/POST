import { useEffect, useState } from "react";
import io from "socket.io-client";
import "./app.css"; // ここでCSSファイルをインポート

const socket = io.connect("http://localhost:5001");

const App = () => {
  const [myId, setMyId] = useState("");
  const [otherId, setOtherId] = useState("");

  const [userName, setUserName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  // //locall strageから取得
  // const [messages, setMessages] = useState(() => {
  //   const savedMessages = localStorage.getItem("messages");
  //   return savedMessages ? JSON.parse(savedMessages) : [];
  // });

  useEffect(() => {
    socket.on("your_data", ({ userId, userName, id }) => {
      setUserName(userName);
      setMyId(userId);
    });

    socket.on("send_message", ({ userId, userName, text, id }) => {
      if (myId === otherId) {
        setOtherId(id);
      }
      setMessages((prevMessages) => [
        ...prevMessages,
        { userId, userName, text },
      ]);

      // setMessages((prevMessages) => {
      //   const updatedMessages = [...prevMessages, { userId, userName, text }];
      //   //locall strageに保存

      //   localStorage.setItem("messages", JSON.stringify(updatedMessages));
      //   return updatedMessages;
      // });
    });

    //以下記載したらテキストの重複が直った
    return () => {
      socket.off("your_data");
      socket.off("send_message");
    };
  }, []); // []を依存配列として渡すことで初回のみ実行されるようにする

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    socket.emit("text_value", text);
    setText("");
  };

  return (
    <div>
      <p>こんにちは : {userName}</p>
      <div>
        <form onSubmit={handleTextSubmit}>
          <input
            type="text"
            placeholder="テキスト入力欄"
            onChange={handleTextChange}
            value={text}
          />
          <button>送信</button>
        </form>
      </div>
      <div className="container">
        {messages.map((message, index) => (
          <div key={index}>
            <p
              className={
                message.userId !== myId
                  ? "other-user-message"
                  : "my-user-message"
              }
            >
              {message.userName}: {message.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
