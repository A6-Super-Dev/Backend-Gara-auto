import admin from 'firebase-admin';
import uuid from 'uuid-v4';
import InternalServerError from '../errors/types/InternalServerError';
import { logger } from '../helpers/logger';
import { stringifyArray } from '../helpers/string';

import firebaseServiceKeys from '../../firebaseServiceKeys';

/// get node-fetch
/* eslint-disable  @typescript-eslint/no-explicit-any */
const importDynamic = new Function('modulePath', 'return import(modulePath)');
const fetch = async (...args: unknown[]) => {
  const module = await importDynamic('node-fetch');
  return module.default(...args);
};

class UploadImgsFromUrlsService {
  private bucket: any;
  constructor() {
    this.initValue();
  }

  private initValue() {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(
          firebaseServiceKeys as admin.ServiceAccount
        ),
        storageBucket: 'oto-a6-superdev.appspot.com',
      });
      this.bucket = admin.storage().bucket();
    } catch (error) {
      logger.error(error, { reason: 'EXCEPTION when init firebase' });
      throw new InternalServerError();
    }
  }

  private fetchFile(link: string) {
    return new Promise((resolve) => {
      resolve(fetch(link));
    });
  }

  async uploadImgsToFirebase(urls: Array<string> | string) {
    if (typeof urls === 'object') {
      urls = urls.map((url) => {
        return url
          .replaceAll('thumb/250//', 'webp/')
          .replaceAll('thumb/150', 'webp')
          .replaceAll('thumb/250', 'webp')
          .replaceAll('thumb/350', 'webp')
          .replaceAll('thumb/650', 'webp');
      });
      const fetchFilePromises = urls.map((url) => this.fetchFile(url));
      const responseFromFetchFiles = await Promise.all(fetchFilePromises);
      try {
        const newUrls = responseFromFetchFiles.map((response: any) => {
          const newUrl = response.url
            .replace('https://img.tinbanxe.vn/', '')
            .replace('https://tinbanxe.vn/', '');

          // const file = bucket.file('path/to/image.jpg');
          const file = this.bucket.file(newUrl);

          const contentType = response.headers.get('content-type');
          const writeStream = file.createWriteStream({
            metadata: {
              contentType,
              metadata: {
                myValue: uuid(),
              },
            },
          });
          response.body.pipe(writeStream);
          return newUrl;
        });
        return stringifyArray(newUrls);
      } catch (error) {
        logger.error(error, { reason: 'EXCEPTION at uploadImgToFirebase()' });
        throw new InternalServerError();
      }
    }
  }
}

export default UploadImgsFromUrlsService;
