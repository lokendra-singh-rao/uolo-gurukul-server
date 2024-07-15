import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "dotenv/config";

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export const uploadFile = async ({ imageBuffer, keyName }) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: keyName,
      Body: imageBuffer,
    };

    const command = new PutObjectCommand(params);
    const data = await client.send(command);

    return { ok: true, status: 200, data: data };
  } catch (err) {
    return { ok: false, status: 500, err: err.message };
  }
};

export const getSignedUrlS3 = async (keyName) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: keyName,
    };

    const command = new GetObjectCommand(params);

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    return { ok: true, status: 200, data: url };
  } catch (err) {
    return { ok: false, status: 500, err: err.message };
  }
};
