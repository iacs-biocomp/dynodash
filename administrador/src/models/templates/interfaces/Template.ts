import { Document } from "mongoose";

export interface Template extends Document  {
    id?: number;
    _name: string;
    _html: string;
}