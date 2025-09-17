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
      <Text size="sm" fw={500}>
        アスペクト比に合わせた拡大
      </Text>
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
