import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { z, ZodSchema } from 'zod';
import { toast } from 'sonner';

export type FieldKind = 'text' | 'date' | 'textarea';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  kind: FieldKind;
  initialValue: string;
  schema?: ZodSchema<string>;
  onSave: (value: string) => Promise<void> | void;
  saveLabel?: string;
  cancelLabel?: string;
  placeholder?: string;
}

export const EditFieldDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  title,
  kind,
  initialValue,
  schema,
  onSave,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  placeholder,
}) => {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  const handleSave = async () => {
    if (schema) {
      const r = schema.safeParse(value);
      if (!r.success) {
        toast.error(r.error.issues[0]?.message || 'Invalid');
        return;
      }
    }
    try {
      setSaving(true);
      await onSave(value);
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message ?? 'Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cosmic-dark border-cosmic-accent/40 text-white max-w-md mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-cosmic-gold">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          {kind === 'textarea' ? (
            <Textarea
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={placeholder}
              className="bg-cosmic-deep-blue/40 border-cosmic-accent/30 text-white"
              rows={4}
            />
          ) : (
            <Input
              type={kind === 'date' ? 'date' : 'text'}
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={placeholder}
              className="bg-cosmic-deep-blue/40 border-cosmic-accent/30 text-white"
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
            {cancelLabel}
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-cosmic-accent hover:bg-cosmic-accent/80">
            {saveLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};