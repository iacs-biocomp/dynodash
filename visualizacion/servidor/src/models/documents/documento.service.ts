import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Number } from "mongoose";
import { Documento, DocumentoType } from "./documento.schema";


@Injectable()
export class DocumentoService {
    private readonly logger = new Logger(DocumentoService.name);

    constructor(
        @InjectModel("Documento") private documentoModel: Model<DocumentoType>
    ) {}

    async getDocumento(id : Number): Promise<Documento> {
        return await this.documentoModel.findOne({code: id})
    }
}