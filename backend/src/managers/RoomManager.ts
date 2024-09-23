import { User } from "./UserManager";

let GLOBAL_ROOM_ID = 1;

interface Room {
  person1: User;
  person2: User;
}

export class RoomManager {
  private rooms: Map<string, Room>
  constructor() {
    this.rooms = new Map<string, Room>()
  }

  createRoom(person1: User, person2: User) {
    const roomId = this.generate();
    this.rooms.set(roomId.toString(), {
      person1,
      person2,
    })

    person1.socket.emit("send-offer", {
      roomId
    })
  }

  onOffer(roomId: string, sdp: string) {
    const person2 = this.rooms.get(roomId)?.person2;
    person2?.socket.emit("offer", {
      sdp,
    })
  }

  onAnswer(roomId: string, sdp: string) {
    const person1 = this.rooms.get(roomId)?.person1;
    person1?.socket.emit("offer", {
      sdp,
    })
  }

  generate() {
    return GLOBAL_ROOM_ID++;
  }
}
