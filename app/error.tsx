"use client";

import { ButtonLink } from "@/components/ui/button-link";
import { Panel } from "@/components/ui/panel";

export default function GlobalError() {
  return (
    <div className="page-shell py-24">
      <Panel className="rounded-[32px] text-center" glow>
        <div className="eyebrow justify-center">System recovery</div>
        <h2 className="font-display mt-4 text-3xl font-semibold text-white md:text-5xl">
          The world model hit turbulence.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
          Reload the route or return to the landing page. The MVP includes graceful fallback states, but this surface still needs a clean reset.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/">Return home</ButtonLink>
        </div>
      </Panel>
    </div>
  );
}
