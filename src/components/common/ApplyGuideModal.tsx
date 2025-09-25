import { ActionIcon, Box, Group, Modal, Text } from "@mantine/core";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type ApplyGuideModalProps = {
  opened: boolean;
  onClose: () => void;
};

export function ApplyGuideModal({ opened, onClose }: ApplyGuideModalProps) {
  const { t } = useTranslation();
  const steps = useMemo(
    () => [
      {
        title: t("applyGuide.steps.accessExtensions.title"),
        body: (
          <Text>
            {t("applyGuide.steps.accessExtensions.body")}
          </Text>
        ),
        imageSrc: "/guide/step1.png",
        imageAlt: t("applyGuide.steps.accessExtensions.title"),
      },
      {
        title: t("applyGuide.steps.enableDeveloperMode.title"),
        body: (
          <Text>{t("applyGuide.steps.enableDeveloperMode.body")}</Text>
        ),
        imageSrc: "/guide/step2.png",
        imageAlt: t("applyGuide.steps.enableDeveloperMode.title"),
      },
      {
        title: t("applyGuide.steps.loadExtension.title"),
        body: (
          <Text>{t("applyGuide.steps.loadExtension.body")}</Text>
        ),
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
      title={t("applyGuide.title")}
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
          aria-label={t("applyGuide.ariaPrev")}
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
          aria-label={t("applyGuide.ariaNext")}
        >
          <ArrowRight size={18} />
        </ActionIcon>
      </Group>
    </Modal>
  );
}
