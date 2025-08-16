import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '../ui/button';

interface ConfirmUploadProps {
  previewUrl: string | null;
  uploading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmUpload: React.FC<ConfirmUploadProps> = ({
  previewUrl,
  uploading,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="h-24 w-24 rounded-full object-cover border-2 border-cosmic-accent"
          />
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-red-400 hover:text-red-500 hover:bg-red-500/10 border-cosmic-accent/30"
          onClick={onCancel}
          disabled={uploading}
        >
          <X className="mr-1 h-4 w-4" />
          Отмена
        </Button>

        <Button
          variant="default"
          size="sm"
          className="bg-cosmic-accent/20 hover:bg-cosmic-accent/30 text-white"
          onClick={onConfirm}
          disabled={uploading}
        >
          {uploading ? (
            <div className="flex items-center">
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-cosmic-accent border-t-transparent rounded-full" />
              Загрузка...
            </div>
          ) : (
            <>
              <Check className="mr-1 h-4 w-4" />
              Сохранить
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
