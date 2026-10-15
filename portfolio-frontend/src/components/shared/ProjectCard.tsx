import { Link } from "react-router-dom";
import { ExternalLink, Code2 } from "lucide-react";
import type { Project } from "../../types";
import { CornerFrame } from "../ui/CornerFrame";
import { Tag } from "../ui/Tag";
import { optimizeCloudinaryImage } from "../../api/client";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <CornerFrame className="flex h-full flex-col overflow-hidden rounded-lg border border-navy-700 bg-navy-800/40">
      <Link to={`/projects/${project.slug}`} className="block">
        <div className="aspect-video overflow-hidden bg-navy-700">
          {project.imageUrl ? (
            <img
              src={optimizeCloudinaryImage(project.imageUrl, 800)}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-mono text-xs text-paper-faint">
              no preview
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link to={`/projects/${project.slug}`}>
          <h3 className="font-display text-lg font-semibold text-paper transition-colors hover:text-sea-400">
            {project.title}
          </h3>
        </Link>
        <p className="flex-1 text-sm text-paper-dim">{project.summary}</p>

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <Tag key={t.id} label={t.name} />
            ))}
          </div>
        )}

        <div className="flex gap-4 pt-1 font-mono text-xs">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-magenta-400 hover:text-magenta-300">
              <ExternalLink size={13} /> live
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-paper-dim hover:text-paper">
              <Code2 size={13} /> source
            </a>
          )}
        </div>
      </div>
    </CornerFrame>
  );
}
