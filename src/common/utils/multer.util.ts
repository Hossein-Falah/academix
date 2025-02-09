import { mkdirSync } from "fs";
import { Request } from "express";
import { extname, join } from "path";
import { diskStorage } from "multer";
import { BadRequestException } from "@nestjs/common";
import { ValidationMessage } from "../enums/message.enum";

export type CallbackFunction = (error:Error, destination:string) => void;
export type MulterFile = Express.Multer.File;

export const multerDestination = (fieldName:string) => {
    return (req:Request, file:MulterFile, callback:CallbackFunction): void => {
        let path = join('public', 'uploads', fieldName);
                
        mkdirSync(path, { recursive: true });
        callback(null, path);
    }
}

export const multerFilename = (req:Request, file:MulterFile, callback:CallbackFunction):void => {
    const ext = extname(file.originalname).toLowerCase();    

    if (!isValidImageFormat(ext)) {
        callback(new BadRequestException(ValidationMessage.InValidImageFormat), null);
    } else {
        const filename = `${Date.now()}${ext}`;        
        callback(null, filename);
    }
}


export const isValidImageFormat = (ext:string) => {
    return ['.png', '.jpg', '.jpeg'].includes(ext);
}

export const multerStorage = (folderName:string) => {
    return diskStorage({
        destination: multerDestination(folderName),
        filename: multerFilename
    })
}