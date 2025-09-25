import { Button, Flex, Group, Modal, Stack, Text } from "@mantine/core";
import { Layers3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Action } from "../../../types/action";
import type { FileRef } from "../../../types/fileRef";
import { NtpBackgroundEditorCanvas } from "./ntpBackgroundEditor/NtpBackgroundEditorCanvas";
import { NtpBackgroundEditorInspector } from "./ntpBackgroundEditor/NtpBackgroundEditorInspector";
import { NtpBackgroundEditorLayerList } from "./ntpBackgroundEditor/NtpBackgroundEditorLayerList";
import { useNtpBackgroundEditorController } from "./ntpBackgroundEditor/useNtpBackgroundEditorController";

type NtpBackgroundEditorModalProps = {
  opened: boolean;
  onClose: () => void;
  dispatch: React.Dispatch<Action>;
  current?: FileRef;
};

export function NtpBackgroundEditorModal({
  opened,
  onClose,
  dispatch,
  current,
}: NtpBackgroundEditorModalProps) {
  const { t } = useTranslation();
  const {
    layers,
    selectedLayer,
    selectedLayerId,
    selectLayer,
    outputWidth,
    outputHeight,
    setOutputWidthValue,
    setOutputHeightValue,
    isApplying,
    errorMessage,
    canvasWrapperRef,
    canvasRef,
    handleAddFiles,
    clearLayers,
    removeLayer,
    bringForward,
    sendBackward,
    resetLayerAdjustments,
    setLayerPosition,
    setLayerScale,
    setLayerOpacity,
    setLayerRotation,
    setLayerCrop,
    toggleLayerFlip,
    handleLayerPointerDown,
    handleLayerPointerMove,
    handleLayerPointerUp,
    handleApply,
    draggingLayerId,
  } = useNtpBackgroundEditorController({ opened, onClose, dispatch, current });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title={t("ntpEditor.title")}
      withinPortal={false}
      overlayProps={{ opacity: 0.2 }}
    >
      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          {t("ntpEditor.description")}
        </Text>
        <Flex
          gap="lg"
          align="stretch"
          direction={{ base: "column", md: "row" }}
        >
          <NtpBackgroundEditorCanvas
            layers={layers}
            selectedLayerId={selectedLayerId}
            draggingLayerId={draggingLayerId}
            outputWidth={outputWidth}
            outputHeight={outputHeight}
            onUpdateWidth={setOutputWidthValue}
            onUpdateHeight={setOutputHeightValue}
            onAddFiles={handleAddFiles}
            onClearLayers={clearLayers}
            canvasRef={canvasRef}
            canvasWrapperRef={canvasWrapperRef}
            onLayerPointerDown={handleLayerPointerDown}
            onLayerPointerMove={handleLayerPointerMove}
            onLayerPointerUp={handleLayerPointerUp}
          />
          <Stack flex={1} gap="md">
            <Group justify="space-between">
              <Group gap="xs">
                <Layers3 size={16} />
                <Text fw={600}>{t("ntpEditor.layersHeading")}</Text>
              </Group>
              <Text size="xs" c="dimmed">
                {t("ntpEditor.layerCount", { count: layers.length })}
              </Text>
            </Group>
            <NtpBackgroundEditorLayerList
              layers={layers}
              selectedLayerId={selectedLayerId}
              onSelect={selectLayer}
              onBringForward={bringForward}
              onSendBackward={sendBackward}
              onRemove={removeLayer}
            />
            {selectedLayer && (
              <NtpBackgroundEditorInspector
                layer={selectedLayer}
                onChangePosition={setLayerPosition}
                onChangeScale={setLayerScale}
                onChangeOpacity={setLayerOpacity}
                onChangeRotation={setLayerRotation}
                onToggleFlip={toggleLayerFlip}
                onChangeCrop={setLayerCrop}
                onReset={resetLayerAdjustments}
              />
            )}
            {errorMessage && (
              <Text size="sm" c="red">
                {errorMessage}
              </Text>
            )}
            <Group justify="space-between" mt="md">
              <Flex gap={4}>
                <Button
                  variant="default"
                  onClick={onClose}
                  disabled={isApplying}
                >
                  {t("ntpEditor.cancel")}
                </Button>
                <Button
                  onClick={handleApply}
                  loading={isApplying}
                  disabled={layers.length === 0 && !current}
                >
                  {t("ntpEditor.apply")}
                </Button>
              </Flex>
            </Group>
          </Stack>
        </Flex>
      </Stack>
    </Modal>
  );
}
