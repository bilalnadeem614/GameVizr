"use client";

import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import ContributorCard from "./components/ContributorCard";
import DotGridBackground from "./components/DotGridBackground";
import { User, Map, BookOpen, Brain, Menu, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const contributors = [
  {
    name: "John Doe",
    email: "john@example.com",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    githubUrl: "https://github.com/johndoe",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    linkedinUrl: "https://linkedin.com/in/janesmith",
    githubUrl: "https://github.com/janesmith",
  },
  {
    name: "Alex Johnson",
    email: "alex.j@example.com",
    linkedinUrl: "https://linkedin.com/in/alexjohnson",
    githubUrl: "https://github.com/alexjohnson",
  },
  {
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    linkedinUrl: "https://linkedin.com/in/sarahwilliams",
    githubUrl: "https://github.com/sarahwilliams",
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionsRef = useRef([]);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("section-visible");
            entry.target.classList.remove("section-hidden");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) {
        section.classList.add("section-hidden");
        observer.observe(section);
      }
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className={`${spaceGrotesk.className} bg-[#0a0a0a] text-white`}>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-wide">
            GameVizr
          </Link>
          
          {/* Desktop Navigation */}
          <Link
            href="/dashboard/projects"
            className="hidden text-sm font-medium uppercase tracking-[0.2em] text-white/80 transition hover:text-white md:block"
          >
            
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-white transition hover:text-white/80 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Slide-in */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-64 transform bg-[#0a0a0a] transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <span className="text-lg font-semibold">Menu</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-white transition hover:text-white/80"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col gap-4 px-6 py-8">
          <Link
            href="/dashboard/projects"
            className="text-sm font-medium uppercase tracking-[0.2em] text-white/80 transition hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            Projects
          </Link>
        </div>
      </div>

      <main>
        <section className="relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] via-[#7C6FF4] to-[#3B82F6] transition-transform duration-100"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />
          <div className="absolute inset-0 opacity-40">
            <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.25)_1px,transparent_0)] bg-[length:24px_24px]" />
          </div>
          <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-start justify-center gap-6 px-6 py-24">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/80">
              Visual Game Design
            </p>
            <h1 className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-5xl font-semibold tracking-tight text-transparent md:text-7xl">
              GameVizr
            </h1>
            <p className="max-w-2xl text-xl text-white/90 md:text-2xl">
              Visual game design platform powered by AI agents
            </p>
            <p className="max-w-2xl text-base text-white/80 md:text-lg">
              Turn rough ideas into structured, playable assets with guided
              blocks, emergent mechanics, and a living blueprint that evolves
              alongside your team.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#0a0a0a] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:translate-y-[-2px] hover:bg-white/90"
            >
              Get Started
            </Link>
          </div>
        </section>

        <section ref={(el) => (sectionsRef.current[0] = el)} className="py-20">
          <DotGridBackground>
            <div className="mx-auto max-w-6xl px-6">
              <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-10 md:p-16">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
                  About
                </div>
                <h2 className="text-3xl font-semibold md:text-4xl">
                  About GameVizr
                </h2>
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <p className="text-base text-white/70 md:text-lg">
                    Build worlds through a block-based interface for Level Design,
                    Character Design, Environment, and Narrative. Every block
                    translates intent into clean, reusable game assets.
                  </p>
                  <p className="text-base text-white/70 md:text-lg">
                    A multi-agent system collaborates with you and each other,
                    generating mechanics, pacing suggestions, and playtest-ready
                    structures that stay aligned with your creative vision.
                  </p>
                </div>
                <div className="mt-10 rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
                  <div className="h-40 w-full rounded-xl bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.2)_1px,transparent_0)] bg-[length:22px_22px]" />
                </div>
              </div>
            </div>
          </DotGridBackground>
        </section>

        <section ref={(el) => (sectionsRef.current[1] = el)} className="bg-[#0f0f0f] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
              Features
            </div>
            <h2 className="text-3xl font-semibold md:text-4xl">
              Build with Purpose
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-[#8B5CF6] p-8">
                <User className="h-10 w-10 text-white" />
                <h3 className="mt-4 text-xl font-semibold text-white">
                  Character Design
                </h3>
                <p className="mt-3 text-sm text-white/90">
                  AI-powered character creation with attributes and abilities
                </p>
              </div>
              <div className="rounded-2xl bg-[#3B82F6] p-8">
                <Map className="h-10 w-10 text-white" />
                <h3 className="mt-4 text-xl font-semibold text-white">
                  Level Design
                </h3>
                <p className="mt-3 text-sm text-white/90">
                  Generate levels that adapt to character abilities and story
                </p>
              </div>
              <div className="rounded-2xl bg-[#10B981] p-8">
                <BookOpen className="h-10 w-10 text-white" />
                <h3 className="mt-4 text-xl font-semibold text-white">
                  Story Blocks
                </h3>
                <p className="mt-3 text-sm text-white/90">
                  Narrative elements that integrate with gameplay
                </p>
              </div>
              <div className="rounded-2xl bg-[#F97316] p-8">
                <Brain className="h-10 w-10 text-white" />
                <h3 className="mt-4 text-xl font-semibold text-white">
                  AI Collaboration
                </h3>
                <p className="mt-3 text-sm text-white/90">
                  Multi-agent system ensures coherent game design
                </p>
              </div>
            </div>
          </div>
        </section>

        <section ref={(el) => (sectionsRef.current[2] = el)} className="bg-[#0a0a0a] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-white/10 bg-[#121212] p-10 md:flex-row md:items-center md:p-16">
              <div>
                <h2 className="text-3xl font-semibold md:text-4xl">
                  Ready to Build Your Game?
                </h2>
                <p className="mt-3 max-w-xl text-base text-white/70 md:text-lg">
                  Start a project, invite collaborators, and let the agents map
                  your first playable slice.
                </p>
              </div>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-full bg-[#10B981] px-8 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#0a0a0a] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:translate-y-[-2px] hover:bg-[#13c38f]"
              >
                Create Project
              </Link>
            </div>
          </div>
        </section>

        <section ref={(el) => (sectionsRef.current[3] = el)} className="border-t border-white/10 bg-[#0a0a0a] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-semibold md:text-4xl">
                Our Contributors
              </h2>
              <span className="text-sm uppercase tracking-[0.2em] text-[#F97316]">
                Core Crew
              </span>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {contributors.map((contributor) => (
                <ContributorCard
                  key={contributor.name}
                  name={contributor.name}
                  email={contributor.email}
                  linkedinUrl={contributor.linkedinUrl}
                  githubUrl={contributor.githubUrl}
                />
              ))}
            </div>
          </div>
        </section>

        <section ref={(el) => (sectionsRef.current[4] = el)} className="bg-[#0f0f0f] py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-semibold md:text-4xl">
              Testimonials
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-white/10 bg-[#121212] p-8">
                <p className="text-lg text-white/80">
                  “GameVizr feels like a real-time creative director. It helped
                  our team go from a moodboard to a working prototype in a
                  single sprint.”
                </p>
                <div className="mt-6">
                  <p className="text-sm font-semibold">Placeholder Studio</p>
                  <p className="text-xs text-white/60">Creative Lead</p>
                </div>
              </div>
              <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-[#3B82F6]/30 via-[#8B5CF6]/30 to-[#F97316]/30 p-8">
                <div className="aspect-[4/3] w-full rounded-2xl bg-[#0a0a0a]/60" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#0a0a0a] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center text-xs uppercase tracking-[0.3em] text-white/50 md:flex-row md:text-left">
          <span>GameVizr</span>
          <span>Copyright 2026</span>
        </div>
      </footer>
    </div>
  );
}
