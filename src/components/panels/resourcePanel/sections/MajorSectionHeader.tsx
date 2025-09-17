import { Title } from "@mantine/core";

export default function MajorSectionHeader({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginTop: 12,
        marginBottom: 8,
      }}
    >
      <div
        aria-hidden
        style={{
          width: 6,
          height: 22,
          borderRadius: 3,
          background: "#1c7ed6",
        }}
      />
      <Title order={5} style={{ margin: 0 }}>
        {label}
      </Title>
      <div
        aria-hidden
        style={{ flex: 1, height: 1, background: "#dee2e6", marginLeft: 6 }}
      />
    </div>
  );
}
