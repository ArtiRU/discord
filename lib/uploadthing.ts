import type { OurFileRouter } from '@/app/api/uploadthing/core';

import { generateComponents } from '@uploadthing/react';

export const { UploadDropzone, UploadButton, Uploader } =
  generateComponents<OurFileRouter>();
