import { AVATAR_ALLOWED_MIME_TYPES } from '../user.constants.js';

export function getMimeTypesArrayToString(mimeTypes: typeof AVATAR_ALLOWED_MIME_TYPES): string {
  return mimeTypes.map((type) => type.split('/')[1]).join(', ');
}
