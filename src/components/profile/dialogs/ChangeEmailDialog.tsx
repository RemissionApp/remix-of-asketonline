import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  lang: 'ru' | 'en' | 'es';
}

export const ChangeEmailDialog: React.FC<Props> = ({ open, onOpenChange, lang }) => {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const t = (ru: string, en: string, es: string) => (lang === 'ru' ? ru : lang === 'es' ? es : en);

  const submit = async () => {
    const r = z.string().email().safeParse(email);
    if (!r.success) return toast.error(t('Неверный email', 'Invalid email', 'Email inválido'));
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ email });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(t('Подтвердите по ссылке в письме', 'Check your inbox to confirm', 'Revisa tu correo'));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-cosmic-dark border-cosmic-accent/40 text-white max-w-md mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-cosmic-gold">
            {t('Сменить email', 'Change email', 'Cambiar email')}
          </DialogTitle>
        </DialogHeader>
        <Input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="bg-cosmic-deep-blue/40 border-cosmic-accent/30 text-white"
        />
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