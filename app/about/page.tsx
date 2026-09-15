import { FadeIn } from "@/components/ui/fade-in";
import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";

const principles = [
  {
    title: "Worlds over articles",
    copy:
      "Discoveries become changes in a world-model so users can feel consequences before reading long explanation blocks.",
  },
  {
    title: "Visuals first, text second",
    copy:
      "Copy supports orientation and mechanism, but the primary communication layer is cinematic, spatial, and interactive.",
  },
  {
    title: "Small first subject",
    copy:
      "The MVP starts with Physics only. The typed architecture is already prepared for future AI, Biology, and Mathematics worlds.",
  },
];

export default function AboutPage() {
  return (
    <div className="page-shell space-y-10 pb-12 pt-6">
      <SectionHeading
        eyebrow="About SciLoop"
        title="A premium browser-first foundation for scientific world-models."
        description="SciLoop is intentionally small at the start. The current MVP proves the product direction: interactive simulations, cinematic presentation, typed content models, and a route system built for future subject worlds."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {principles.map((item, index) => (
          <FadeIn key={item.title} delay={0.05 * index}>
            <Panel className="h-full rounded-[30px]">
              <h2 className="font-display text-2xl font-semibold text-white">
                {item.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {item.copy}
              </p>
            </Panel>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.16}>
        <Panel className="rounded-[32px]">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="eyebrow">Current stack</div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Next.js App Router, TypeScript, Tailwind CSS, React Three Fiber, Drei, and Motion for UI-only transitions.
              </p>
            </div>
            <div>
              <div className="eyebrow">Current scope</div>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Landing page, Physics world route, discoveries route, about route, reusable design system, and typed mock data for three discoveries.
              </p>
            </div>
          </div>
        </Panel>
      </FadeIn>
    </div>
  );
}
