import { Document } from "mongoose";

export interface Plantilla extends Document  {
    id?: number;
    _name: string;
    _html: string;
}