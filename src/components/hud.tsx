export default function Hud() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute top-12 left-24 flex items-center gap-x-4">
        <div className="relative size-24">
          <img src="/blue_ring.png" className="absolute size-full" />
          <img src="/quigonjinn.png" className="absolute size-full" />
        </div>

        <div className="flex -space-x-1">
          <img src="/heart.png" className="size-10" />
          <img src="/heart.png" className="size-10" />
          <img src="/heart.png" className="size-10" />
          <img src="/heart.png" className="animate-heartbeat size-10" />
        </div>
      </div>
    </div>
  );
}
