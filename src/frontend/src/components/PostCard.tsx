import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Calendar, User } from "lucide-react";
import type { Post } from "../backend.d";

function formatDate(ns: bigint) {
  const ms = Number(ns) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface PostCardProps {
  post: Post;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  return (
    <article
      className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-card flex flex-col"
      data-ocid={`posts.item.${index}`}
    >
      <Link
        to="/post/$slug"
        params={{ slug: post.slug }}
        className="block overflow-hidden aspect-[16/9]"
      >
        <img
          src={
            post.coverImageUrl ||
            "/assets/generated/azolla-hero.dim_1200x600.jpg"
          }
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-medium capitalize"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <Link to="/post/$slug" params={{ slug: post.slug }}>
          <h3 className="font-display text-lg font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-3 border-t border-border">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" /> {post.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {formatDate(post.publishedAt)}
          </span>
        </div>
      </div>
    </article>
  );
}
