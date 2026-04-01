import { S3Client } from '@aws-sdk/client-s3';
import { config } from './config';

export const s3 = new S3Client({
    region: config.aws.REGION,
    credentials: {
        accessKeyId: config.aws.ACCESS_KEY_ID,
        secretAccessKey: config.aws.SECRET_ACCESS_KEY,
    },
});
