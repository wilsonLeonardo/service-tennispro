import Multer from 'multer';
import MulterAzureStorage from 'multer-azure-storage'; // eslint-disable-line

import config from '../../services/config';

const { storage } = config;

const connectionString = storage;

export const Foto = Multer({
  storage: new MulterAzureStorage({
    azureStorageConnectionString: connectionString,
    containerName: 'fotos',
    containerSecurity: 'blob',
  }),
});
