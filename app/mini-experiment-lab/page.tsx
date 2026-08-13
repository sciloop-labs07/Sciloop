import { PhysicsWorldExperience } from "@/components/three/physics-world-experience";
import { Panel } from "@/components/ui/panel";
import { physicsDiscoveries } from "@/data/discoveries";
import { physicsWorldExperienceConfig } from "@/data/worlds/physics-world";
import { getDiscoveryBySlug } from "@/lib/utils";

interface MiniExperimentLabPageProps {
  searchParams: Promise<{ discovery?: string }>;
}

export default async function MiniExperimentLabPage({
  searchParams,
}: MiniExperimentLabPageProps) {
  const params = await searchParams;
  const discoverySlug =
    params.discovery ?? physicsWorldExperienceConfig.defaultDiscoverySlug;
  const discovery = getDiscoveryBySlug(physicsDiscoveries, discoverySlug);

  return (
    <div className="page-shell space-y-6 pb-12 pt-4">
      <Panel className="rounded-[32px] px-6 py-6 md:px-8 md:py-7">
        <div className="space-y-3">
          <div className="eyebrow">Experiments + Reality Sandbox 3D</div>
          <h1 className="font-display text-3xl font-semibold text-white md:text-4xl">
            Mini Experiment Lab
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">
            Run focused experiments and open the full browser-native Reality
            Sandbox without leaving the laboratory.
          </p>
        </div>
      </Panel>

      {physicsDiscoveries.length > 0 ? (
        <PhysicsWorldExperience
          discoveries={physicsDiscoveries}
          initialDiscoverySlug={discovery.slug}
        />
      ) : (
        <Panel className="rounded-[32px] px-6 py-10 md:px-8">
          <h2 className="font-display text-3xl font-semibold text-white">
            Simulation unavailable
          </h2>
        </Panel>
      )}
    </div>
  );
}
