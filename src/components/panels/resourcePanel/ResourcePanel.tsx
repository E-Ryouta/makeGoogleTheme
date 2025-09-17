import { Stack } from "@mantine/core";
import ColorsSection from "./sections/ColorsSection";
import ImagesSection from "./sections/ImagesSection";
import MetaSection from "./sections/MetaSection";

export default function ResourcePanel() {
  return (
    <Stack>
      <MetaSection />
      <ImagesSection />
      <ColorsSection />
    </Stack>
  );
}
