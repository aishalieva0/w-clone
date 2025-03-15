import { logOutUser } from "../firebase/auth";
import ChatWindow from "../components/chat/ChatWindow";
import Sidebar from "../components/sidebar/Sidebar";
const Chat = () => {
  return (
    <div className="chat">
      <div className="row">
        <button onClick={logOutUser}>logout</button>
        <Sidebar />
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;
