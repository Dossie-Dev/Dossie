"use client"
import HeroSection from "./hero";
import Features from "../../../components/ui/Features";
import Features2 from "../../../components/ui/Features2";
import Faq from "@/components/ui/Faq";
import Cta from "@/components/ui/Cta";
import Testimonial from "@/components/ui/Testimonial";



export default function Home() {
  return (
    <div>
      <HeroSection />
      <Features />
      <Features2 />
      <Faq />
      <Testimonial />
      <Cta />
    </div>
  );
}
