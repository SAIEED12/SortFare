export default function ShaderFallback() {
  return (
    <div
      className="absolute inset-0"
      aria-hidden="true"
      style={{
        background:
          'radial-gradient(ellipse at 30% 40%, #1e3a8a 0%, #2563eb 30%, #0f172a 60%, #0a0a14 100%)',
      }}
    />
  )
}
