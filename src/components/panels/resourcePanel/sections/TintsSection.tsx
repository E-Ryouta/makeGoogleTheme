import { Stack } from "@mantine/core";
import TintField from "../../../fields/TintField";
import MajorSectionHeader from "./MajorSectionHeader";

export default function TintsSection() {
  return (
    <Stack>
      <MajorSectionHeader label="Tints" />
      <TintField label="Buttons tint" tintKey="buttons" />
    </Stack>
  );
}
