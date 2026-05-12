import type { NextFunction, Request, Response } from 'express';
import { BadRequestException } from '@exceptions';

import { MULTER_ERROR_TYPES } from '../../../shared/constants/media.constants.js';
import { convertBytesToMegaBytes } from '../../../shared/helpers/convertBytesToMegaBytes.js';
import { getMimeTypesArrayToString } from '../helpers/getMimeTypesFromArray.js';
import { isAvatarUploadAllowedType } from '../../../shared/helpers/isMimeTypeIsAllowed.js';
import {
  AVATAR_ALLOWED_MIME_TYPES,
  AVATAR_FORM_DATA_FIELD_NAME,
  AVATAR_MAX_SIZE_BYTES,
} from '../user.constants.js';
import multer, { MulterError } from 'multer';

const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: AVATAR_MAX_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (!isAvatarUploadAllowedType(file.mimetype)) {
      callback(
        new BadRequestException(
          `Only ${getMimeTypesArrayToString(AVATAR_ALLOWED_MIME_TYPES)} images are allowed`,
        ),
      );
      return;
    }

    callback(null, true);
  },
}).single(AVATAR_FORM_DATA_FIELD_NAME);

export const uploadAvatarMiddleware = (req: Request, res: Response, next: NextFunction) => {
  uploadAvatar(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof MulterError && error.code === MULTER_ERROR_TYPES.LIMIT_FILE_SIZE) {
      next(
        new BadRequestException(
          `Avatar image must be less than ${convertBytesToMegaBytes(AVATAR_MAX_SIZE_BYTES)}MB`,
        ),
      );
      return;
    }

    next(error);
  });
};
