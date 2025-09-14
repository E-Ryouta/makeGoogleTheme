import { Stack } from "@mantine/core";
import MetaSection from "./sections/MetaSection";
import ImagesSection from "./sections/ImagesSection";
import ColorsSection from "./sections/ColorsSection";

export default function ResourcePanel() {
  return (
    <Stack>
      <MetaSection />
      <ImagesSection />
      <ColorsSection />
      {/* Tints removed */}
    </Stack>
  );
}
