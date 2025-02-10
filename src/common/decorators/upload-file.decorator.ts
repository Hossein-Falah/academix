import { ParseFilePipe, UploadedFiles } from "@nestjs/common"

export const UploadedOptionalFiles = () => {
    return UploadedFiles(new ParseFilePipe({
        fileIsRequired: false,
        validators: []
    }))
}