import { Injectable, Scope } from "@nestjs/common";

//will allow to contextualize the name of the user for the rest of the application
@Injectable({ scope : Scope.REQUEST})
export class RequestService {

    private userName : string;

    getName() {
        return this.userName;
    }

    setName(userName : string) {
        this.userName = userName;
    }
}