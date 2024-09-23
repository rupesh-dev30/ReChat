import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export interface User {
  socket: Socket;
  name: string;
}

export class UserManager {
  private users: User[];
  private queue: string[];
  private roomManager: RoomManager;

  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
  }

  addUser(name: string, socket: Socket) {
    this.users.push({
      name,
      socket,
    });
    this.queue.push(socket.id);
    socket.send("lobby");
    this.clearQueue();
    this.initHandlers(socket);
  }

  removeUser(socketId: string) {
    const user = this.users.find(x => x.socket.id === socketId);
    
    this.users = this.users.filter((u) => u.socket.id !== socketId);
    this.queue = this.queue.filter((x) => x === socketId);
  }

  clearQueue() {
    console.log("inside clear queues");
    console.log(this.queue.length)
    if (this.queue.length < 2) {
      return;
    }

    console.log(this.users);
    console.log(this.queue);
    
    const id1 = this.queue.pop();
    const id2 = this.queue.pop();

    console.log("id is " + id1 + " " + id2)
    
    const person1 = this.users.find((p) => p.socket.id === id1);
    const person2 = this.users.find((p) => p.socket.id === id2);
    console.log(person1);
    console.log(person2);
    
    if (!person1 || !person2) {
      return;
    }
    
    console.log("creating room");

    const room = this.roomManager.createRoom(person1, person2);
    console.log(room);
    this.clearQueue();
    
  }

  initHandlers(socket: Socket) {
    socket.on("offer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onOffer(roomId, sdp);
    });

    socket.on("answer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onAnswer(roomId, sdp);
    });
  }
}

// SDP -> Session Description Protocol
