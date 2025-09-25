import { Button, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";

export type NtpBackgroundScaleControlProps = {
  shouldScale: boolean;
  onChange: (value: boolean) => void;
};

export function NtpBackgroundScaleControl({
  shouldScale,
  onChange,
}: NtpBackgroundScaleControlProps) {
  const { t } = useTranslation();
  return (
    <Stack gap="xs">
      <Button.Group>
        <Button
          variant={shouldScale ? "filled" : "outline"}
          onClick={() => onChange(true)}
        >
          {t("ntpScale.scale")}
        </Button>
        <Button
          variant={!shouldScale ? "filled" : "outline"}
          onClick={() => onChange(false)}
        >
          {t("ntpScale.noScale")}
        </Button>
      </Button.Group>
    </Stack>
  );
}
