import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../context/socket";
import { updateMessageStatus } from "../redux/slices/chatSlice";

const useSocketEvents = () => {
    const { user } = useSelector((state) => state.user);
    const socket = useSocket();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!socket || !user) return;

        console.log("Registering user:", user.email);
        socket.emit("register-user", user.email);

        socket.on("message-status-updated", (updatedMessage) => {
            dispatch(updateMessageStatus(updatedMessage));
        });

        return () => {
            socket.emit("disconnect-user", user.email);
        };
    }, [socket, user, dispatch]);
};

export default useSocketEvents;
