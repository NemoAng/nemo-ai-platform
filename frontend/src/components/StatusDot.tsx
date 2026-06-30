export function StatusDot({ ok }: { ok: boolean }) {
  return <span className={ok ? "dot ok" : "dot bad"} />;
}
