import { Github, Linkedin } from "lucide-react";

export default function ContributorCard({
  name,
  email,
  linkedinUrl,
  githubUrl,
}) {
  return (
    <div className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-[#8B5CF6]">
      <div>
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="mt-2 text-sm text-white/60 overflow-hidden text-ellipsis break-all">{email}</p>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 transition hover:text-white"
          aria-label={`${name} on LinkedIn`}
        >
          <Linkedin className="h-5 w-5" />
        </a>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 transition hover:text-white"
          aria-label={`${name} on GitHub`}
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
