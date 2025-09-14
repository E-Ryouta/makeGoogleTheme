import { useState } from "react";
import { Box, Group, Modal, Text, ActionIcon } from "@mantine/core";
import { ArrowLeft, ArrowRight } from "lucide-react";

type ApplyGuideModalProps = {
  opened: boolean;
  onClose: () => void;
};

export function ApplyGuideModal({ opened, onClose }: ApplyGuideModalProps) {
  const steps: {
    title: string;
    body: React.ReactNode;
    imageSrc?: string;
    imageAlt?: string;
  }[] = [
    {
      title: "拡張機能管理にアクセス",
      body: (
        <Text>
          Chromeの右上の3点リーダから拡張機能＞拡張機能管理を選択してください
        </Text>
      ),
      imageSrc: "/guide/step1.png",
    },
    {
      title: "開発者モードをON",
      body: <Text>右上の「開発者モード」のトグルをONにします。</Text>,
      imageSrc: "/guide/step2.png",
    },
    {
      title: "拡張機能を読み込む",
      body: (
        <Text>
          ダウンロードしたファイルを開いた画面にドラッグ＆ドロップしてください。
        </Text>
      ),
    },
  ];

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
      title="テーマの適用方法"
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
          aria-label="前へ"
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
          aria-label="次へ"
        >
          <ArrowRight size={18} />
        </ActionIcon>
      </Group>
    </Modal>
  );
}
