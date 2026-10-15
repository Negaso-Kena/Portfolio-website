import { Link, useOutletContext } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { getProjects, getPublishedPosts } from "../api/endpoints";
import { ProjectCard } from "../components/shared/ProjectCard";
import { BlogCard } from "../components/shared/BlogCard";
import { Loading } from "../components/ui/Loading";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import {
  resolveAssetUrl,
  optimizeCloudinaryImage,
} from "../api/client";
import { SEO } from "../components/shared/SEO";
import type { SiteSettings } from "../types";


export function Home() {
  const { settings } = useOutletContext<{ settings: SiteSettings | null }>();

  const { data: projects, loading: projectsLoading } = useFetch(
    () => getProjects(true),
    [],
  );

  const { data: posts, loading: postsLoading } = useFetch(
    getPublishedPosts,
    [],
  );

  return (
    <div>
      <SEO
        description={
          settings?.heroSubtitle ||
          "A Passionate Full-Stack Developer, AI automation, n8n, Zapier, and Hubspot Automation Specialist."
        }
      />
      {/* --- Hero --- */}
      <section className="hero-shell relative overflow-hidden border-b border-navy-700 px-6 py-24 md:py-32">
        <div className="hero-signal-frame" aria-hidden="true" />
        <div className="hero-signal-frame-glow" aria-hidden="true" />
        <div className="hero-section-marker" aria-hidden="true" />
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-center md:gap-12">
            {/* Avatar with rotating gradient ring */}
            <div className="relative isolate flex-shrink-0 w-[264px] h-[264px]">
              {/* Glow behind ring */}
              <div className="avatar-ring-glow absolute inset-0 -z-20 rounded-full" />

              {/* Rotating gradient ring */}
              <div className="avatar-ring absolute inset-0 -z-10 rounded-full" />

              {/* Photo container */}
              <div
                className="absolute inset-[3px] z-10 flex items-center justify-center overflow-hidden rounded-full"
                style={{
                  background:
                    "linear-gradient(145deg, #0e0e2e 0%, #191945 100%)",
                }}
              >
                {/* Pulls profile image dynamically from admin settings if available */}
                <img
                  src={
                    settings?.avatarUrl
                      ? optimizeCloudinaryImage(settings.avatarUrl, 400)
                      : "/your-photo.jpg"
                  }
                  alt="Negaso Kena"
                  decoding="async"
                  // Hero avatar is above the fold and usually the page's LCP element — load it eagerly.
                  fetchPriority="high"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>

            {/* Hero content */}
            <div className="max-w-2xl text-center md:text-left">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-sea-400">
                full-stack developer
              </p>

              <h1 className="font-display text-4xl font-bold leading-tight text-paper md:text-6xl">
                {settings?.heroTitle || "I'm Negaso Kena"}
              </h1>

              <p className="mt-4 max-w-xl text-lg text-paper-dim">
                {settings?.heroSubtitle || "A Passionate Full-Stack Developer"}
              </p>

              {/* Signature waveform */}
              <svg
                viewBox="0 0 400 40"
                className="mx-auto my-10 h-8 w-64 md:mx-0 md:w-80"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="signal-gradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#a63fea" />
                    <stop offset="100%" stopColor="#2dd4bf" />
                  </linearGradient>
                </defs>

                <polyline
                  points="0,20 60,20 80,4 100,36 120,4 140,36 160,20 240,20 260,8 280,32 300,20 400,20"
                  fill="none"
                  stroke="url(#signal-gradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1200"
                  className="animate-signal"
                />
              </svg>

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Link to="/projects">
                  <Button className="brand-cta">
                    View projects
                    <ArrowRight size={15} />
                  </Button>
                </Link>

                {settings?.resumeUrl && (
                  <a
                    href={resolveAssetUrl(settings.resumeUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="brand-cta inline-flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-all"
                    style={{
                      background:
                        "linear-gradient(90deg, #06b6d4 0%, #d946ef 100%)",
                    }}
                  >
                    <Download size={15} />
                    Download Resume
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Bio --- */}
      {settings?.bio && (
        <section className="mx-auto max-w-4xl px-6 py-20">
          <div className="about-card">
            <div className="about-card-content">
              <div className="mb-8">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-sea-400">
                  About me
                </p>

                <h2 className="mt-3 font-display text-3xl font-semibold text-paper md:text-4xl">
                  The developer{" "}
                  <span className="text-gradient-signal">behind the code.</span>
                </h2>
              </div>

              <p className="whitespace-pre-wrap text-left text-base leading-8 text-paper-dim md:text-lg">
                {settings.bio}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* --- Featured projects --- */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-paper">
            Featured <span className="text-gradient-signal">projects</span>
          </h2>

          <Link
            to="/projects"
            className="flex items-center gap-1 font-mono text-sm text-sea-400 hover:text-sea-300"
          >
            all projects
            <ArrowRight size={14} />
          </Link>
        </div>

        {projectsLoading ? (
          <Loading label="Loading projects" />
        ) : !projects || projects.length === 0 ? (
          <EmptyState
            title="No featured projects yet"
            description="Mark a project as featured from the admin dashboard to show it here."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>

      <div className="site-separator" aria-hidden="true" />

      {/* --- Recent posts --- */}
      <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-paper">
            Recent <span className="text-gradient-signal">writing</span>
          </h2>

          <Link
            to="/blog"
            className="flex items-center gap-1 font-mono text-sm text-sea-400 hover:text-sea-300"
          >
            all posts
            <ArrowRight size={14} />
          </Link>
        </div>

        {postsLoading ? (
          <Loading label="Loading posts" />
        ) : !posts || posts.length === 0 ? (
          <EmptyState
            title="No posts published yet"
            description="Publish your first post from the admin dashboard."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
