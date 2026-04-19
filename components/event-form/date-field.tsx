'use client';

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { format } from "date-fns";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const DateTimeSection = ({ 
  dateName, 
  timeName, 
  minDate 
}: { 
  dateName: string; 
  timeName: string; 
  minDate?: Date 
}) => {
  const { control, register } = useFormContext();
  
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="flex flex-row flex-wrap gap-4 items-start flex-1">
      <Controller
        control={control}
        name={dateName}
        render={({ field }) => (
          <Popover open={isOpen} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-48 flex-1 justify-between bg-secondary py-4 h-auto rounded-lg border-none font-normal"
              >
                <span className="truncate">
                  {field.value ? format(field.value, "PPP") : "Select date"}
                </span>
                <ChevronDown className="opacity-50" size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false); 
                }}
                disabled={(day) => 
                  day < (minDate || new Date(new Date().setHours(0, 0, 0, 0)))
                }
              />
            </PopoverContent>
          </Popover>
        )}
      />
      <Input
        type="time"
        step="1"
        {...register(timeName)}
        className="flex-1 appearance-none bg-secondary py-4 h-auto border-none rounded-lg px-4 text-base focus-visible:ring-0"
      />
    </div>
  );
};