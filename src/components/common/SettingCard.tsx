import { Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

type SettingCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function SettingCard({
  title,
  description,
  children,
}: SettingCardProps) {
  return (
    <Stack gap="sm">
      <Stack gap={4}>
        <Text size="sm" fw={600}>
          {title}
        </Text>
        {description && (
          <Text size="xs" c="dimmed">
            {description}
          </Text>
        )}
      </Stack>
      {children}
    </Stack>
  );
}
