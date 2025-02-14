import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "../context/socket";
import axios from "axios";
import { logOutUser } from "../firebase/auth";
import ChatWindow from "../components/chat/ChatWindow";
import Sidebar from "../components/sidebar/Sidebar";
const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiverEmail, setReceiverEmail] = useState("");

  const { user } = useSelector((state) => state.user);
  const socket = useSocket();

  useEffect(() => {
    if (!receiverEmail || !user) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5001/messages/${user.email}/${receiverEmail}`
        );
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [receiverEmail, user]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("register-user", user.email);

    socket.on("receive-message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket, user]);

  const sendMessage = () => {
    if (!socket || !user || !receiverEmail || !message.trim()) {
      return;
    }

    const newMessage = {
      sender: user.email,
      receiver: receiverEmail,
      message,
    };

    socket.emit("send-message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="chat">
      <div className="row">
        <Sidebar />
        <ChatWindow />
      </div>
    </div>
  );

  // return (
  //   <div>
  //     <h2>Chat</h2>
  //     <input
  //       type="email"
  //       placeholder="Receiver's Email"
  //       value={receiverEmail}
  //       onChange={(e) => setReceiverEmail(e.target.value)}
  //     />
  //     <input
  //       type="text"
  //       placeholder="Type your message..."
  //       value={message}
  //       onChange={(e) => setMessage(e.target.value)}
  //     />
  //     <button onClick={sendMessage} disabled={!socket}>
  //       Send
  //     </button>

  //     <div>
  //       {messages.map((msg, index) => (
  //         <p
  //           key={index}
  //           style={{ textAlign: msg.sender === user.email ? "right" : "left" }}
  //         >
  //           <strong>{msg.sender}:</strong> {msg.message}
  //         </p>
  //       ))}
  //     </div>

  //     <button onClick={logOutUser}>logout</button>
  //   </div>
  // );
};

export default Chat;
