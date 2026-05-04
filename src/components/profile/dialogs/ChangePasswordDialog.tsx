import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lang: 'ru' | 'en' | 'es';
}

export const ChangePasswordDialog: React.FC<Props> = ({ open, onOpenChange, lang }) => {
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);

  const t = (ru: string, en: string, es: string) => (lang === 'ru' ? ru : lang === 'es' ? es : en);

  const submit = async () => {
    if (pw.length < 8) return toast.error(t('Минимум 8 символов', 'Min 8 characters', 'Mín. 8 caracteres'));
    if (pw !== pw2) return toast.error(t('Пароли не совпадают', 'Passwords do not match', 'No coinciden'));
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(t('Пароль обновлён', 'Password updated', 'Contraseña actualizada'));
    onOpenChange(false);
    setPw(''); setPw2('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cosmic-dark border-cosmic-accent/40 text-white max-w-md mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-cosmic-gold">
            {t('Сменить пароль', 'Change password', 'Cambiar contraseña')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input type="password" value={pw} onChange={e => setPw(e.target.value)}
            placeholder={t('Новый пароль', 'New password', 'Nueva contraseña')}
            className="bg-cosmic-deep-blue/40 border-cosmic-accent/30 text-white" />
          <Input type="password" value={pw2} onChange={e => setPw2(e.target.value)}
            placeholder={t('Повторите', 'Confirm', 'Repetir')}
            className="bg-cosmic-deep-blue/40 border-cosmic-accent/30 text-white" />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={busy}>
            {t('Отмена', 'Cancel', 'Cancelar')}
          </Button>
          <Button onClick={submit} disabled={busy} className="bg-cosmic-accent hover:bg-cosmic-accent/80">
            {t('Сохранить', 'Save', 'Guardar')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};