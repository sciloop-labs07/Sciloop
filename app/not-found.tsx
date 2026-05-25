import { ButtonLink } from "@/components/ui/button-link";
import { FadeIn } from "@/components/ui/fade-in";
import { Panel } from "@/components/ui/panel";

export default function NotFound() {
  return (
    <div className="page-shell pb-12 pt-12">
      <FadeIn>
        <Panel className="rounded-[36px] px-6 py-10 text-center md:px-10 md:py-14" glow>
          <div className="eyebrow justify-center">404 | Route not found</div>
          <h1 className="font-display mt-5 text-4xl font-semibold tracking-tight text-white md:text-6xl">
            That part of SciLoop has not been mapped yet.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            The current MVP is intentionally focused: a premium landing page, one Physics world, and supporting discovery routes. Use the links below to jump back into the mapped experience.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/">Return home</ButtonLink>
            <ButtonLink href="/worlds/physics" variant="secondary">
              Enter Physics World
            </ButtonLink>
          </div>
        </Panel>
      </FadeIn>
    </div>
  );
}
