import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";

const Room = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const name = searchParams.get("name");
  const [lobby, setLobby] = useState(true);
  const [socket, setSocket] = useState<null | Socket>(null);

  useEffect(() => {
    // logic to init user to the room
    const socket = io(URL);
    socket.on("send-offer", ({ roomId }) => {
      setLobby(false);
      socket.emit("offer", {
        sdp: "",
        roomId,
      });
    });

    socket.on("offer", ({ roomId, offer }) => {
      setLobby(false);
      socket.emit("answer", {
        roomId,
        sdp: "",
      });
    });

    socket.on("answer", ({ roomId, answer }) => {
      setLobby(false);
    });

    socket.on("lobby", () => {
      setLobby(true);
    });

    setSocket(socket);
  }, [name]);

  if(lobby) {
    return <div>
      Waiting to connect you to someone
    </div>
  }

  return <div>Hi {name}
    <video src="" width={400} height={400} />
    <video src="" width={400} height={400} />
  </div>;
};

export default Room;
