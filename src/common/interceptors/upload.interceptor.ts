import { memoryStorage } from "multer";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { multerStorage } from "../utils/multer.util";
import { MulterField } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

export const UploadFile = (fieldName:string, folderName:string = "images") => {
    return class UploadUtility extends FileInterceptor(fieldName, {
        storage: multerStorage(folderName)
    }) {}
}

export const UploadFileS3 = (filedName:string) => {
    return class UploadUtility extends FileInterceptor(filedName, {
        storage: memoryStorage()
    }) {}
}

export const UploadFileFieldsS3 = (uploadFields:MulterField[]) => {
    return class UploadUtility extends FileFieldsInterceptor(uploadFields, {
        storage: memoryStorage()
    }) {}
}