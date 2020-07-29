import AWS from 'aws-sdk';
import crypto from 'crypto';
import Multer from 'multer';
import MulterS3 from 'multer-s3';
import path from 'path';

import config from '../../services/config';

const { awsAccessKey, awsSecretAccessKey, awsDefaultRegion } = config;

const storageTypes = {
  s3: MulterS3({
    s3: new AWS.S3({
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretAccessKey,
      region: awsDefaultRegion,
    }),
    bucket: 'tennisproimage2',
    contentType: MulterS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const filename = `${hash.toString('hex')} - ${file.originalname}`;

        cb(null, filename);
      });
    },
  }),
  local: Multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', 'tmp', 'uploads'));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err, null);

        const filename = `${hash.toString('hex')} - ${file.originalname}`;

        cb(null, filename);
      });
    },
  }),
};

export const Foto = {
  dest: path.resolve(__dirname, '..', 'tmp', 'uploads'),
  storage: storageTypes.s3,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Formato do arquivo invalido'));
    }
  },
};
