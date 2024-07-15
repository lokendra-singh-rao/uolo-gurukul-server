import sharp from "sharp";
import * as s3Service from "../services/s3Service.js";

export async function uploadFile({ imageBuffer, keyName }) {
  imageBuffer = await sharp(imageBuffer)
    .resize({
      width: 400,
      height: 400,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .webp()
    .toBuffer();
  const response = s3Service.uploadFile({ imageBuffer, keyName });
  return response;
}

export async function getFileUrl(keyName) {
  const response = s3Service.getSignedUrlS3(keyName);
  return response;
}
