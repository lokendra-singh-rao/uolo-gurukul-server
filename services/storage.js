import sharp from "sharp";
import * as uploadService from "./s3.js";

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
  const response = uploadService.uploadFile({ imageBuffer, keyName });
  return response;
}

export async function getFileUrl(keyName) {
  const response = uploadService.getSignedUrlS3(keyName);
  return response;
}
