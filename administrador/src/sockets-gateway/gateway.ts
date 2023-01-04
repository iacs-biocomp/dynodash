import { OnModuleInit } from "@nestjs/common";
import { 
    MessageBody, 
    SubscribeMessage, 
    WebSocketGateway, 
    WebSocketServer 
} from "@nestjs/websockets";
import { Server } from "socket.io";


//this decorator is used to indicate that this is a websocket implementation
@WebSocketGateway()
export class MyGateway implements OnModuleInit {

    //Defines the websocket of the server to this property 
    @WebSocketServer()
    server : Server;

    //define the method that listens to the connection event when the module has been initialize
    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id);
            console.log("Connected.");
        })
    }

    //this method allows the client to consume the websocket event. The server recieves the info sent by the client.
    @SubscribeMessage('newMessage')
    //body is the data sent by the client
    onNewMessage(@MessageBody() body : any) {
        console.log(body);
        //difine the event that sends the message back to the client
        this.server.emit('onMessage', {
            msg : "Nuevo mensaje",
            content: body
        })
    }
}
