import blueRing from '../assets/images/blue_ring.png';
import greenRing from '../assets/images/green_ring.png';
import heart from '../assets/images/heart.png';
import obiWan from '../assets/images/obi_wan.png';
import quiGon from '../assets/images/quigonjinn.png';

export default function Hud() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute top-12 left-24 flex items-center gap-x-4">
        <div className="relative size-24">
          <img src={blueRing} className="absolute size-full" />
          <img src={quiGon} className="absolute size-full" />
        </div>

        <div className="flex -space-x-1">
          <img src={heart} className="size-10" />
          <img src={heart} className="size-10" />
          <img src={heart} className="size-10" />
          <img src={heart} className="animate-heartbeat size-10" />
        </div>
      </div>

      <div className="absolute top-12 right-24 flex items-center gap-x-4 opacity-60">
        <div className="relative size-24">
          <img src={greenRing} className="absolute size-full" />
          <img src={obiWan} className="absolute size-full" />
        </div>
      </div>
    </div>
  );
}
