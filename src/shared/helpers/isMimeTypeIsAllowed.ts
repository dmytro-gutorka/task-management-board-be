import type { AvatarAllowerMimeTypes } from '@modules/media/types.js';

import { AVATAR_ALLOWED_MIME_TYPES } from '../../modules/user/user.constants.js';

export function isAvatarUploadAllowedType(type: string): type is AvatarAllowerMimeTypes {
  return AVATAR_ALLOWED_MIME_TYPES.includes(type as AvatarAllowerMimeTypes);
}
