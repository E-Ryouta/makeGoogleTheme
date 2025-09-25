import { ActionIcon, Box, Group, Modal, Text } from "@mantine/core";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type RevertGuideModalProps = {
  opened: boolean;
  onClose: () => void;
};

export function RevertGuideModal({ opened, onClose }: RevertGuideModalProps) {
  const { t } = useTranslation();
  const steps = useMemo(
    () => [
      {
        title: t("revertGuide.steps.openCustomize.title"),
        body: <Text>{t("revertGuide.steps.openCustomize.body")}</Text>,
        imageSrc: "/revert/revert1.png",
        imageAlt: t("revertGuide.steps.openCustomize.title"),
      },
      {
        title: t("revertGuide.steps.showThemes.title"),
        body: <Text>{t("revertGuide.steps.showThemes.body")}</Text>,
        imageSrc: "/revert/revert2.png",
        imageAlt: t("revertGuide.steps.showThemes.title"),
      },
      {
        title: t("revertGuide.steps.setDefault.title"),
        body: <Text>{t("revertGuide.steps.setDefault.body")}</Text>,
      },
    ],
    [t],
  );

  const [step, setStep] = useState(0);
  const total = steps.length;
  const canPrev = step > 0;
  const canNext = step < total - 1;
  const goPrev = () => setStep((s) => Math.max(0, s - 1));
  const goNext = () => setStep((s) => Math.min(total - 1, s + 1));

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setStep(0);
        onClose();
      }}
      title={t("revertGuide.title")}
      centered
    >
      <Text fw={600} mb="xs">
        {step + 1}. {steps[step].title}
      </Text>
      <div>{steps[step].body}</div>

      {steps[step].imageSrc && (
        <Box
          mt="md"
          style={{
            border: "1px dashed var(--mantine-color-gray-4)",
            borderRadius: 8,
            height: 180,
            display: "grid",
            placeItems: "center",
            overflow: "hidden",
            background: "var(--mantine-color-gray-0)",
          }}
        >
          <img
            src={steps[step].imageSrc}
            alt={steps[step].imageAlt || steps[step].title}
            style={{ width: "100%", height: "100%", objectFit: "scale-down" }}
          />
        </Box>
      )}

      <Group justify="space-between" mt="md">
        <ActionIcon
          variant="default"
          onClick={goPrev}
          disabled={!canPrev}
          aria-label={t("revertGuide.ariaPrev")}
        >
          <ArrowLeft size={18} />
        </ActionIcon>
        <Text size="sm" c="dimmed">
          {step + 1} / {total}
        </Text>
        <ActionIcon
          variant="default"
          onClick={goNext}
          disabled={!canNext}
          aria-label={t("revertGuide.ariaNext")}
        >
          <ArrowRight size={18} />
        </ActionIcon>
      </Group>

      <Text size="sm" c="dimmed" mt="md">
        {t("revertGuide.footer")}
      </Text>
    </Modal>
  );
}
