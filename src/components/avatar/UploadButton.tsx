import React from 'react';
import { Camera } from 'lucide-react';
import { UserAvatar } from '../UserAvatar';

interface UploadButtonProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

export const UploadButton: React.FC<UploadButtonProps> = ({
  onFileChange,
  uploading,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <UserAvatar size="lg" />

        <label
          htmlFor="avatar-upload"
          className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-cosmic-accent text-white cursor-pointer"
          title="Загрузить аватар"
        >
          <Camera size={16} />
        </label>

        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
          disabled={uploading}
        />
      </div>
    </div>
  );
};
