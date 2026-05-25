import { PhysicsWorldExperience } from "@/components/three/physics-world-experience";
import { Panel } from "@/components/ui/panel";
import { physicsDiscoveries } from "@/data/discoveries";
import { physicsWorldExperienceConfig } from "@/data/worlds/physics-world";
import { getDiscoveryBySlug } from "@/lib/utils";

interface PhysicsWorldPageProps {
  searchParams: Promise<{ discovery?: string }>;
}

export default async function PhysicsWorldPage({
  searchParams,
}: PhysicsWorldPageProps) {
  const params = await searchParams;
  const discoverySlug =
    params.discovery ?? physicsWorldExperienceConfig.defaultDiscoverySlug;
  const discovery = getDiscoveryBySlug(physicsDiscoveries, discoverySlug);

  return (
    <div className="page-shell space-y-6 pb-12 pt-4">
      <Panel className="rounded-[32px] px-6 py-6 md:px-8 md:py-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="eyebrow">Portal 3 / World 01</div>
            <h1 className="font-display text-3xl font-semibold text-white md:text-4xl">
              Reality Sandbox
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="chip rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]">
              <span className="chip-dot" />
              Browser live
            </span>
            <span className="chip rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]">
              <span className="chip-dot" />
              Law cores
            </span>
            <span className="chip rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]">
              <span className="chip-dot" />
              Cinematic feedback
            </span>
          </div>
        </div>
      </Panel>

      {physicsDiscoveries.length > 0 ? (
        <PhysicsWorldExperience
          discoveries={physicsDiscoveries}
          initialDiscoverySlug={discovery.slug}
        />
      ) : (
        <Panel className="rounded-[32px] px-6 py-10 md:px-8">
          <div className="space-y-3">
            <div className="eyebrow">Placeholder</div>
            <h2 className="font-display text-3xl font-semibold text-white">
              Physics World Placeholder
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              The full Physics scene is not available yet, so this route is
              showing a visible placeholder inside the same project.
            </p>
          </div>
        </Panel>
      )}
    </div>
  );
}
