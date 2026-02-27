"use client";

import { Hero } from "@/components/sections/Hero";
import { WizardContainer } from "@/components/wizard/WizardContainer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <section id="wizard" className="section-padding">
        <WizardContainer />
      </section>
    </>
  );
}
