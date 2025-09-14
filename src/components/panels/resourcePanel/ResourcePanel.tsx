import { Stack } from "@mantine/core";
import MetaSection from "./sections/MetaSection";
import ImagesSection from "./sections/ImagesSection";
import ColorsSection from "./sections/ColorsSection";
import TintsSection from "./sections/TintsSection";

export default function ResourcePanel() {
  return (
    <Stack>
      <MetaSection />
      <ImagesSection />
      <ColorsSection />
      <TintsSection />
    </Stack>
  );
}
