import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { getLocaleByLanguage } from '@/utils/dateFormatUtils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { language } = useAppStore();
  const locale = getLocaleByLanguage(language);

  const [month, setMonth] = React.useState<Date>(
    props.defaultMonth ||
      (props.selected instanceof Date ? props.selected : new Date())
  );

  React.useEffect(() => {
    if (props.selected instanceof Date) setMonth(props.selected);
    else if (props.defaultMonth) setMonth(props.defaultMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.defaultMonth, (props.selected as Date | undefined)?.getTime?.()]);

  const currentYear = new Date().getFullYear();
  const minYear = (props as any).fromYear ?? currentYear - 100;
  const maxYear = (props as any).toYear ?? currentYear;

  const years = React.useMemo(() => {
    const out: number[] = [];
    for (let y = maxYear; y >= minYear; y--) out.push(y);
    return out;
  }, [minYear, maxYear]);

  const months = React.useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        value: i,
        label: new Date(2000, i, 1).toLocaleString(language || 'ru', {
          month: 'long',
        }),
      })),
    [language]
  );

  const updateMonth = (next: Date) => {
    setMonth(next);
    props.onMonthChange?.(next);
  };

  const goPrev = () => {
    const d = new Date(month);
    d.setMonth(d.getMonth() - 1);
    updateMonth(d);
  };
  const goNext = () => {
    const d = new Date(month);
    d.setMonth(d.getMonth() + 1);
    updateMonth(d);
  };

  const selectClass =
    'appearance-none bg-cosmic-dark/70 border border-cosmic-accent/30 text-white text-sm rounded-lg px-2.5 py-1.5 pr-7 cursor-pointer hover:bg-cosmic-dark/90 focus:outline-none focus:ring-1 focus:ring-cosmic-accent/60 [&>option]:bg-cosmic-dark [&>option]:text-white';
  const navBtn =
    'h-8 w-8 inline-flex items-center justify-center rounded-lg bg-cosmic-dark/70 border border-cosmic-accent/30 text-white hover:bg-cosmic-accent/20 transition-colors';

  return (
    <div className="p-3 space-y-3 select-none">
      <div className="flex items-center justify-between gap-2">
        <button type="button" aria-label="Previous month" onClick={goPrev} className={navBtn}>
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 flex-1 justify-center">
          <div className="relative">
            <select
              value={month.getMonth()}
              onChange={e => {
                const d = new Date(month);
                d.setMonth(parseInt(e.target.value, 10));
                updateMonth(d);
              }}
              className={selectClass}
            >
              {months.map(m => (
                <option key={m.value} value={m.value}>
                  {m.label.charAt(0).toUpperCase() + m.label.slice(1)}
                </option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rotate-90 text-cosmic-secondary" />
          </div>
          <div className="relative">
            <select
              value={month.getFullYear()}
              onChange={e => {
                const d = new Date(month);
                d.setFullYear(parseInt(e.target.value, 10));
                updateMonth(d);
              }}
              className={selectClass}
            >
              {years.map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rotate-90 text-cosmic-secondary" />
          </div>
        </div>

        <button type="button" aria-label="Next month" onClick={goNext} className={navBtn}>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn('pointer-events-auto', className)}
        classNames={{
          months: 'flex flex-col',
          month: 'space-y-2',
          caption: 'hidden',
          caption_label: 'hidden',
          nav: 'hidden',
          table: 'w-full border-collapse',
          head_row: 'flex',
          head_cell:
            'text-cosmic-secondary/70 rounded-md w-9 font-normal text-[0.75rem] uppercase tracking-wider',
          row: 'flex w-full mt-1',
          cell: 'h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
          day: cn(
            buttonVariants({ variant: 'ghost' }),
            'h-9 w-9 p-0 font-normal text-white/90 hover:bg-cosmic-accent/20 hover:text-white aria-selected:opacity-100 rounded-lg'
          ),
          day_selected:
            'bg-cosmic-accent text-white hover:bg-cosmic-accent hover:text-white focus:bg-cosmic-accent focus:text-white',
          day_today:
            'border border-cosmic-gold/50 text-cosmic-gold bg-transparent',
          day_outside: 'text-cosmic-secondary/30',
          day_disabled: 'text-cosmic-secondary/25 opacity-50',
          day_hidden: 'invisible',
          ...classNames,
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
        month={month}
        onMonthChange={setMonth}
        locale={locale}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
