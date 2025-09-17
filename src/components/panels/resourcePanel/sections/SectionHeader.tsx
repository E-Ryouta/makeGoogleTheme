import { Title } from "@mantine/core";

export default function SectionHeader({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 8,
        marginBottom: 4,
      }}
    >
      <div
        aria-hidden
        style={{
          width: 4,
          height: 18,
          borderRadius: 2,
          background: "#228be6",
        }}
      />
      <Title order={6} style={{ margin: 0 }}>
        {" "}
        {label}{" "}
      </Title>
      <div
        aria-hidden
        style={{ flex: 1, height: 1, background: "#e9ecef", marginLeft: 4 }}
      />
    </div>
  );
}
