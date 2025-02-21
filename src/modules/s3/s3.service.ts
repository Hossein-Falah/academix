import { S3 } from "aws-sdk";
import { extname } from "path";
import { BadRequestException, Injectable } from "@nestjs/common";
import { BadRequestMessage } from "src/common/enums/message.enum";

@Injectable()
export class S3Service {
  private readonly s3:S3;

  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
      },
      endpoint: process.env.S3_ENDPOINT,
      region: "default"
    })
  }

  async uploadVideo(file:Express.Multer.File, folderName:string) {
    const ext = extname(file.originalname);
    
    if (!['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) {
      throw new BadRequestException(BadRequestMessage.InValidVideoFormat);
    }

    return await this.s3.upload({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${folderName}/${Date.now()}/${ext}}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read"
    }).promise();
  }

  async uploadFile(file:Express.Multer.File, folderName:string) {
    const ext = extname(file.originalname); // .png .jpg

    return await this.s3.upload({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${folderName}/${Date.now()}${ext}`,
      Body: file.buffer
    }).promise();
  }

  async deleteFile(Key:string) {
    return await this.s3.deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: Key
    }).promise();
  }
}