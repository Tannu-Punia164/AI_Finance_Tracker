"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-40 pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1
          className={`${spaceGrotesk.className} pb-8 text-5xl font-extrabold leading-[0.92] tracking-[-0.065em] md:text-7xl lg:text-[92px]`}
        >
          <span className="inline-block bg-gradient-to-br from-blue-950 via-blue-700 to-sky-400 bg-clip-text text-transparent drop-shadow-[0_8px_20px_rgba(37,99,235,0.2)]">
            Your Smart
          </span>
          <br />
          <span className="inline-block bg-gradient-to-r from-indigo-700 via-blue-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_8px_20px_rgba(37,99,235,0.2)]">
            Money Companion
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          An AI-powered financial management platform that helps you track,
          analyze, and optimize your spending with real-time insights.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="px-8">
              Watch Demo
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner.jpeg"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
