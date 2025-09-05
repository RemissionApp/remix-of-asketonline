import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/useTranslations';
import { useAppStore } from '@/store/useAppStore';
import { formatDateLong, getLocaleByLanguage } from '@/utils/dateFormatUtils';
import { useNavigate } from 'react-router-dom';

interface ProfileFormProps {
  onSubmit: (values: z.infer<any>) => Promise<void>;
  isSaving: boolean;
  defaultValues?: {
    name: string;
    birthDate: Date;
  };
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  onSubmit,
  isSaving,
  defaultValues = { name: '', birthDate: new Date() },
}) => {
  const { t } = useTranslations();
  const { language } = useAppStore();
  const navigate = useNavigate();

  // Create form schema based on language
  const formSchema = z.object({
    name: z.string().min(2, {
      message: t.userProfile?.nameRequired || 'Имя обязательно',
    }),
    birthDate: z.date({
      required_error:
        t.userProfile?.birthDateRequired || 'Укажите дату рождения',
    }),
  });

  // Initialize form with provided values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues.name,
      birthDate: defaultValues.birthDate || new Date(),
    },
  });

  // Update form values when defaultValues changes
  useEffect(() => {
    if (defaultValues && (defaultValues.name !== form.getValues('name') || defaultValues.birthDate !== form.getValues('birthDate'))) {
      console.log('ProfileForm - Resetting form with defaultValues:', defaultValues);
      form.reset({
        name: defaultValues.name || '',
        birthDate: defaultValues.birthDate || new Date(),
      });
    }
  }, [defaultValues, form]);

  // Handle form submission without navigation (let parent handle it)
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('=== ProfileForm handleSubmit called ===');
    console.log('Form values:', values);
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-cosmic-secondary text-sm font-sans">
                {t.userProfile?.nameLabel || 'Как тебя зовут'}
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-transparent backdrop-blur-[5px] border-cosmic-accent/30 text-white font-sans"
                  placeholder={
                    t.userProfile?.namePlaceholder || 'Введите ваше имя'
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400 font-sans" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="text-left">
              <FormLabel className="text-cosmic-secondary text-sm font-sans">
                {t.userProfile?.birthDateLabel || 'Дата рождения'}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full bg-transparent backdrop-blur-[5px] border-cosmic-accent/30 text-left font-sans text-white',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        formatDateLong(field.value, language)
                      ) : (
                        <span>
                          {t.userProfile?.birthDatePlaceholder ||
                            'Выберите дату рождения'}
                        </span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto bg-cosmic-dark/30 backdrop-blur-[5px] border-cosmic-accent/30 p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={date => {
                      const today = new Date();
                      const maxYear = today.getFullYear();
                      return (
                        date > today ||
                        date.getFullYear() > maxYear ||
                        date < new Date('1900-01-01')
                      );
                    }}
                    initialFocus
                    className="pointer-events-auto"
                    locale={getLocaleByLanguage(language)}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-red-400 font-sans" />
            </FormItem>
          )}
        />

        <div className="pt-4">
          <Button
            className="w-full bg-cosmic-accent/20 hover:bg-cosmic-accent/30 text-white border border-cosmic-accent/30 font-sans"
            type="submit"
            disabled={isSaving}
          >
            {isSaving
              ? t.userProfile?.savingButton || 'Сохранение...'
              : t.userProfile?.continueButton || 'Продолжить'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
