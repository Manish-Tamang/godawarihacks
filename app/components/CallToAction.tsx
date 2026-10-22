import { Button } from "./ui/button";
import { GridSection } from "./ui/grid-section";
import { GridPattern } from "./ui/patterns";
import { Notch } from "./ui/notch";

/** Closing dark band: "Ready to Code?" with the register and about links. */
export function CallToAction() {
  return (
    <>
      {/* White spacer so the notch below always cuts out of a white band. */}
      <GridSection className="border-b-0" innerClassName="h-12" />
      <section
        id="contact"
        className="relative scroll-mt-14 bg-neutral-900 px-4"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 mix-blend-overlay">
          <div className="absolute -inset-[40px] bg-[conic-gradient(from_-81deg,#3A8BFD_-72deg,#855AFC_33deg,#F00_70deg,#EAB308_136deg,#5CFF80_214deg,#00FFF9_259deg,#3A8BFD_288deg,#855AFC_393deg)] blur-[30px]" />
        </div>
        <div className="relative mx-auto max-w-grid-width">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 border-x border-white/5 [mask-image:linear-gradient(black,transparent)]" />
            <div className="absolute inset-y-0 left-1/2 w-[1200px] -translate-x-1/2">
              <GridPattern className="text-white/15 [mask-composite:intersect] [mask-image:linear-gradient(black,transparent),radial-gradient(black,transparent)]" />
            </div>
          </div>
          <Notch className="text-white" />
          <div className="relative flex flex-col items-center px-4 pb-32 pt-24 text-center">
            <h2 className="max-w-lg text-balance font-display text-4xl font-medium text-neutral-50 sm:text-5xl">
              Ready to Code?
            </h2>
            <p className="mt-6 max-w-[560px] text-pretty text-lg font-medium text-neutral-400 sm:text-xl">
              Register now and be part of the most exciting hackathon of the
              year!
            </p>
            <div className="mt-10 flex items-center justify-center gap-3">
              <Button href="/register" variant="inverted">
                Register Now
              </Button>
              <Button href="/about" variant="glass">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
