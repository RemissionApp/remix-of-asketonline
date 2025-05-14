
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { Slider } from "@/components/ui/slider";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const { t } = useTranslations();
  const [month, setMonth] = React.useState<Date>(props.defaultMonth || new Date());
  const currentYear = new Date().getFullYear();
  const yearRange = 50; // 50 years before and after current year
  const minYear = currentYear - yearRange;
  const maxYear = currentYear + yearRange;

  // Handle year slider change
  const handleYearChange = (values: number[]) => {
    const newYear = values[0];
    const newDate = new Date(month);
    newDate.setFullYear(newYear);
    setMonth(newDate);
    
    // Pass the new date to the DayPicker through onMonthChange prop
    if (props.onMonthChange) {
      props.onMonthChange(newDate);
    }
  };

  // Handle month slider change
  const handleMonthChange = (values: number[]) => {
    const newMonth = values[0];
    const newDate = new Date(month);
    newDate.setMonth(newMonth - 1); // Months are 0-indexed in JS Date
    setMonth(newDate);
    
    // Pass the new date to the DayPicker through onMonthChange prop
    if (props.onMonthChange) {
      props.onMonthChange(newDate);
    }
  };

  // Effect to update internal month state when defaultMonth or selected date changes
  React.useEffect(() => {
    if (props.defaultMonth) {
      setMonth(props.defaultMonth);
    } else if (props.selected instanceof Date) {
      setMonth(props.selected);
    }
  }, [props.defaultMonth, props.selected]);

  return (
    <div className="space-y-4">
      {/* Year Slider */}
      <div className="px-3 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t?.calendar?.year || 'Year'}: {month.getFullYear()}</span>
        </div>
        <Slider
          defaultValue={[month.getFullYear()]}
          value={[month.getFullYear()]}
          min={minYear}
          max={maxYear}
          step={1}
          onValueChange={handleYearChange}
          className="w-full"
        />
      </div>
      
      {/* Month Slider */}
      <div className="px-3 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t?.calendar?.month || 'Month'}: {month.getMonth() + 1}</span>
        </div>
        <Slider
          defaultValue={[month.getMonth() + 1]}
          value={[month.getMonth() + 1]}
          min={1}
          max={12}
          step={1}
          onValueChange={handleMonthChange}
          className="w-full"
        />
      </div>
      
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3 pointer-events-auto", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell:
            "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: () => <ChevronLeft className="h-4 w-4" />,
          IconRight: () => <ChevronRight className="h-4 w-4" />,
        }}
        month={month}
        onMonthChange={setMonth}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
