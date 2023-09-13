'use client';
import { UploadDropzone } from '@/lib/uploadthing';
import '@uploadthing/react/styles.css';
import { X } from 'lucide-react';
import Image from 'next/image';
import { FC } from 'react';

interface FileUploadProps {
  endpoint: 'messageFile' | 'serverImage';
  onChange: (url?: string) => void;
  value: string;
}

const FileUpload: FC<FileUploadProps> = ({ endpoint, onChange, value }) => {
  const fileType = value?.split('.').pop();

  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20">
        <Image className="rounded-full" alt="Upload" src={value} fill />
        <button
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          onClick={() => onChange('')}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
      endpoint={endpoint}
    />
  );
};

export default FileUpload;
