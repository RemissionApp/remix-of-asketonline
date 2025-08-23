import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { StarField } from '@/components/StarField';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';

const DeleteAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslations();
  const { deleteAccount, loading } = useAppStore();
  
  const [password, setPassword] = useState('');
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDeleteAccount = async () => {
    if (!password.trim() || !confirmationChecked) {
      toast.error(t.deleteAccount?.fillAllFields || 'Please fill all fields');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount(password);
      toast.success(t.deleteAccount?.accountDeleted || 'Account deleted successfully');
      navigate('/auth');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(t.deleteAccount?.deleteError || 'Error deleting account');
    } finally {
      setIsDeleting(false);
    }
  };

  const isFormValid = password.trim() && confirmationChecked;

  return (
    <div className="min-h-screen bg-cosmic-dark text-cosmic-text">
      <StarField starCount={50} />
      
      {/* Cosmic background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-cosmic-dark via-cosmic-accent/5 to-cosmic-dark opacity-30" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/profile')}
            className="text-cosmic-text hover:text-cosmic-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.common?.back || 'Back'}
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto w-full space-y-6">
          {/* Warning Icon */}
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-serif text-center text-cosmic-text">
            {t.deleteAccount?.title || 'Delete Account'}
          </h1>

          {/* Warning Text */}
          <div className="space-y-4 text-center text-cosmic-text/80">
            <p className="text-lg font-medium text-red-400">
              {t.deleteAccount?.warning || 'This action is irreversible!'}
            </p>
            <p>
              {t.deleteAccount?.description || 'All your data including pacts, achievements, and profile information will be permanently deleted.'}
            </p>
          </div>

          {/* Form */}
          <div className="w-full space-y-6">
            {/* Confirmation Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="confirmation"
                checked={confirmationChecked}
                onCheckedChange={(checked) => setConfirmationChecked(checked === true)}
                className="border-cosmic-accent data-[state=checked]:bg-cosmic-accent"
              />
              <label 
                htmlFor="confirmation" 
                className="text-sm text-cosmic-text cursor-pointer leading-5"
              >
                {t.deleteAccount?.confirmationText || 'I understand that this action is irreversible and all my data will be permanently deleted'}
              </label>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-cosmic-text">
                {t.deleteAccount?.passwordLabel || 'Enter your password to confirm'}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.deleteAccount?.passwordPlaceholder || 'Your password'}
                className="bg-cosmic-dark/50 border-cosmic-accent/30 text-cosmic-text placeholder-cosmic-text/50"
                disabled={isDeleting}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <Button
                onClick={handleDeleteAccount}
                disabled={!isFormValid || isDeleting}
                className="w-full bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting 
                  ? (t.deleteAccount?.deleting || 'Deleting...') 
                  : (t.deleteAccount?.deleteButton || 'Delete Account Permanently')
                }
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/profile')}
                disabled={isDeleting}
                className="w-full border-cosmic-accent/30 text-cosmic-text hover:bg-cosmic-accent/10"
              >
                {t.common?.cancel || 'Cancel'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPage;