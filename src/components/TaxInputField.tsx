import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const formatDisplayValue = (value: string): string => {
  if (!value || value === "") return "";
  const cleanValue = value.replace(/[^0-9.]/g, "");
  if (cleanValue === "") return "";

  const parts = cleanValue.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  const lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);
  const formatted =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (otherNumbers ? "," : "") +
    lastThree;

  return decimalPart !== undefined ? `${formatted}.${decimalPart}` : formatted;
};

const formatInputValue = (value: string): string => {
  if (!value || value === "") return "";
  return value.replace(/[^0-9.]/g, "");
};

interface TaxInputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  tooltip?: string;
  icon?: React.ElementType;
}

const TaxInputField = ({
  label,
  id,
  value,
  onChange,
  placeholder = "0",
  tooltip,
  icon: Icon,
}: TaxInputFieldProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
          ₹
        </span>
        <Input
          id={id}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={focused ? value : formatDisplayValue(value)}
          onChange={(e) => onChange(formatInputValue(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="pl-7"
        />
      </div>
    </div>
  );
};

export default TaxInputField;
