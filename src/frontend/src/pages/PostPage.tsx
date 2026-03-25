import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useGetPostBySlug } from "../hooks/useQueries";

const SKELETON_LINES = ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8"];

function formatDate(ns: bigint) {
  const ms = Number(ns) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderContent(content: string) {
  return content.split("\n\n").map((block) => {
    const key = block.slice(0, 40);
    if (block.startsWith("## ")) {
      return (
        <h2
          key={key}
          className="font-display text-2xl font-bold text-foreground mt-8 mb-3"
        >
          {block.replace("## ", "")}
        </h2>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <h3
          key={key}
          className="font-display text-xl font-semibold text-foreground mt-6 mb-2"
        >
          {block.replace("### ", "")}
        </h3>
      );
    }
    if (block.startsWith("- ")) {
      const items = block.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul
          key={key}
          className="list-disc list-inside space-y-1.5 my-4 text-foreground/80"
        >
          {items.map((item) => (
            <li key={item}>{item.replace("- ", "")}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={key} className="leading-relaxed text-foreground/80 my-4">
        {block.replace(/\*(.*?)\*/g, "$1")}
      </p>
    );
  });
}

export default function PostPage() {
  const { slug } = useParams({ from: "/post/$slug" });
  const { data: post, isLoading, isError } = useGetPostBySlug(slug ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main
          className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full"
          data-ocid="post.loading_state"
        >
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="w-full h-72 rounded-xl mb-8" />
          <div className="space-y-3">
            {SKELETON_LINES.map((k) => (
              <Skeleton key={k} className="h-4 w-full" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main
          className="flex-1 flex items-center justify-center"
          data-ocid="post.error_state"
        >
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg mb-4">
              Post not found.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Back to Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
          <img
            src={
              post.coverImageUrl ||
              "/assets/generated/azolla-hero.dim_1200x600.jpg"
            }
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mb-6 text-muted-foreground hover:text-foreground -ml-2"
            >
              <Link to="/" data-ocid="post.link">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Blog
              </Link>
            </Button>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {formatDate(post.publishedAt)}
              </span>
            </div>

            <div className="text-base">{renderContent(post.content)}</div>
          </motion.div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
