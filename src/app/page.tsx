import { StampConfigurator } from "@/features/configurator/stamp-configurator";
import { Hero } from "@/components/layout/hero";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <Hero />
      <div className="container mx-auto px-4 pb-20">
        <div id="configurator" className="scroll-mt-20">
          <StampConfigurator />
        </div>
      </div>
    </div>
  );
}
