export function BgGradient() {
  return (
    <div
      style={{
        background:
          "linear-gradient(to bottom, #08475000 0%, #084750 50%, #08475000 100%)",
        opacity: "6%",
      }}
      className="pointer-events-none absolute left-1/2 top-0 -z-10 h-screen w-full max-w-[840px] -translate-x-1/2 overflow-hidden blur-3xl"
    ></div>
  );
}
