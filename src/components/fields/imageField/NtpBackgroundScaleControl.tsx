import { Button, Stack, Text } from "@mantine/core";

export type NtpBackgroundScaleControlProps = {
  shouldScale: boolean;
  onChange: (value: boolean) => void;
};

export function NtpBackgroundScaleControl({
  shouldScale,
  onChange,
}: NtpBackgroundScaleControlProps) {
  return (
    <Stack gap="xs">
      <Button.Group>
        <Button
          variant={shouldScale ? "filled" : "outline"}
          onClick={() => onChange(true)}
        >
          拡大する
        </Button>
        <Button
          variant={!shouldScale ? "filled" : "outline"}
          onClick={() => onChange(false)}
        >
          拡大しない
        </Button>
      </Button.Group>
    </Stack>
  );
}
