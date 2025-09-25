import { Button, Menu } from "@mantine/core";
import { Check, Languages } from "lucide-react";

export type LanguageOption = {
  value: string;
  label: string;
};

type LanguageMenuProps = {
  label: string;
  options: LanguageOption[];
  currentLanguage: string;
  onChange: (value: string) => void;
};

export function LanguageMenu({
  label,
  options,
  currentLanguage,
  onChange,
}: LanguageMenuProps) {
  const activeLanguageLabel =
    options.find((option) => option.value === currentLanguage)?.label || label;

  return (
    <Menu position="bottom-end" withinPortal>
      <Menu.Target>
        <Button
          variant="default"
          size="compact-sm"
          leftSection={<Languages size={16} />}
        >
          {activeLanguageLabel}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{label}</Menu.Label>
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            onClick={() => onChange(option.value)}
            rightSection={
              option.value === currentLanguage ? <Check size={14} /> : undefined
            }
          >
            {option.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
