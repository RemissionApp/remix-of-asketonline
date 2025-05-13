
import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
  placeholder = "Выберите опции...",
  options: initialOptions,
  value,
  onChange,
  className,
  inputPlaceholder = "Введите свой вариант..."
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>(initialOptions);
  const [customValue, setCustomValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Функция для добавления пользовательского варианта
  const addCustomOption = () => {
    if (customValue.trim() !== "" && !options.some(option => option.value.toLowerCase() === customValue.toLowerCase().trim())) {
      const newOption = {
        value: customValue.trim(),
        label: customValue.trim()
      };
      
      setOptions(prev => [...prev, newOption]);
      onChange([...value, customValue.trim()]);
      setCustomValue("");
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
            "w-full justify-between text-left font-normal bg-cosmic-dark/50 border-cosmic-accent/30",
            className
          )}
          onClick={() => setOpen(!open)}
        >
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-1 w-full">
              {value.length > 2 ? (
                <Badge className="rounded-md bg-cosmic-accent/20 text-cosmic-accent hover:bg-cosmic-accent/30">
                  {value.length} выбрано
                </Badge>
              ) : (
                value.map((val) => {
                  const option = options.find((o) => o.value === val);
                  return (
                    <Badge
                      key={val}
                      className="rounded-md bg-cosmic-accent/20 text-cosmic-accent hover:bg-cosmic-accent/30"
                    >
                      {option?.label || val}
                      <button
                        className="ml-1 ring-offset-background hover:text-cosmic-accent/70 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            removeOption(val);
                          }
                        }}
                        onClick={(e) => {
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
            <span className="text-cosmic-secondary">{placeholder}</span>
          )}
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-cosmic-dark/90 border-cosmic-accent/30">
        <Command className="bg-transparent">
          <CommandInput placeholder={placeholder} className="text-white" />
          <CommandEmpty>Нет подходящих вариантов</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => toggleOption(option.value)}
                className="text-white"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <div className="flex items-center p-2 border-t border-cosmic-accent/20">
            <Input
              ref={inputRef}
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={inputPlaceholder}
              className="flex-1 bg-cosmic-dark/50 border-cosmic-accent/30 text-white"
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
