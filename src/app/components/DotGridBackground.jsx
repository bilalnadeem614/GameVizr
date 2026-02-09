export default function DotGridBackground({ children }) {
  return (
    <div className="relative w-full bg-[#0a0a0a]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #333333 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
