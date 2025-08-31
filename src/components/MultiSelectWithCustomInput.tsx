import React, { useState, useRef } from 'react';
import { Check, ChevronDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from '@/hooks/useTranslations';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectWithCustomInputProps {
  placeholder?: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  inputPlaceholder?: string;
}

const MultiSelectWithCustomInput: React.FC<MultiSelectWithCustomInputProps> = ({
  placeholder,
  options: initialOptions,
  value,
  onChange,
  className,
  inputPlaceholder,
}) => {
  const { language } = useAppStore();
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [customValue, setCustomValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Translate placeholder texts based on language
  const getPlaceholder = () =>
    placeholder ||
    (language === 'ru'
      ? 'Выберите опции...'
      : language === 'es'
        ? 'Seleccione opciones...'
        : 'Select options...');

  const getInputPlaceholder = () =>
    inputPlaceholder ||
    (language === 'ru'
      ? 'Введите свой вариант...'
      : language === 'es'
        ? 'Ingrese su opción...'
        : 'Enter your option...');

  const getNoMatchesText = () => {
    return language === 'ru'
      ? 'Нет подходящих вариантов'
      : language === 'es'
        ? 'No hay opciones coincidentes'
        : 'No matches found';
  };

  const getSelectedCountText = (count: number) => {
    return language === 'ru'
      ? `${count} выбрано`
      : language === 'es'
        ? `${count} seleccionados`
        : `${count} selected`;
  };

  // Функция для добавления пользовательского варианта
  const addCustomOption = () => {
    if (
      customValue.trim() !== '' &&
      !options.some(
        option =>
          option.value.toLowerCase() === customValue.toLowerCase().trim()
      )
    ) {
      const newOption = {
        value: customValue.trim(),
        label: customValue.trim(),
      };

      setOptions(prev => [...prev, newOption]);
      onChange([...value, customValue.trim()]);
      setCustomValue('');
    }
  };

  // Обработчик нажатия Enter в поле пользовательского ввода
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomOption();
    }
  };

  // Удаление выбранной опции
  const removeOption = (optionValue: string) => {
    onChange(value.filter(val => val !== optionValue));
  };

  // Переключение состояния опции (выбрана/не выбрана)
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      removeOption(optionValue);
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between text-left font-normal bg-cosmic-dark/50 border-cosmic-accent/30 text-sm sm:text-base',
            className
          )}
          onClick={() => setOpen(!open)}
        >
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-1 w-full">
              {value.length > 2 ? (
                <Badge className="rounded-md bg-cosmic-accent/20 text-cosmic-accent hover:bg-cosmic-accent/30 text-xs sm:text-sm">
                  {getSelectedCountText(value.length)}
                </Badge>
              ) : (
                value.map(val => {
                  const option = options.find(o => o.value === val);
                  return (
                    <Badge
                      key={val}
                      className="rounded-md bg-cosmic-accent/20 text-cosmic-accent hover:bg-cosmic-accent/30 text-xs sm:text-sm"
                    >
                      {option?.label || val}
                      <button
                        className="ml-1 ring-offset-background hover:text-cosmic-accent/70 focus:outline-none"
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            removeOption(val);
                          }
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          removeOption(val);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })
              )}
            </div>
          ) : (
            <span className="text-cosmic-secondary">{getPlaceholder()}</span>
          )}
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-cosmic-dark/90 border-cosmic-accent/30 text-sm sm:text-base">
        <Command className="bg-transparent">
          <CommandInput placeholder={getPlaceholder()} className="text-white text-sm sm:text-base" />
          <CommandList>
            <CommandEmpty>{getNoMatchesText()}</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  onSelect={() => toggleOption(option.value)}
                  className="text-white text-sm sm:text-base"
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value.includes(option.value) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <div className="flex items-center p-2 border-t border-cosmic-accent/20">
            <Input
              ref={inputRef}
              value={customValue}
              onChange={e => setCustomValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getInputPlaceholder()}
              className="flex-1 bg-cosmic-dark/50 border-cosmic-accent/30 text-white text-sm sm:text-base"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={addCustomOption}
              className="ml-2 text-cosmic-accent hover:text-cosmic-accent/70 hover:bg-cosmic-accent/10"
              disabled={!customValue.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectWithCustomInput;
