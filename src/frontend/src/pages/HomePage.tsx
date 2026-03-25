import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Leaf, User } from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { useListPublishedPosts } from "../hooks/useQueries";

const SKELETON_CARDS = ["s1", "s2", "s3", "s4", "s5", "s6"];

function formatDate(ns: bigint) {
  const ms = Number(ns) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function HomePage() {
  const { data: posts, isLoading } = useListPublishedPosts();
  const publishedPosts = posts ?? [];
  const heroPost = publishedPosts[0];
  const otherPosts = publishedPosts.slice(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero banner */}
        <section className="relative bg-primary overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/assets/generated/azolla-hero.dim_1200x600.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-primary-foreground/80" />
                <span className="text-primary-foreground/80 text-sm font-medium uppercase tracking-widest">
                  The Azolla Journal
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-4">
                Nature's Smallest,
                <br />
                Most Powerful Fern
              </h1>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                Exploring the science, history, and future of Azolla — the
                aquatic fern transforming sustainable agriculture.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {/* Loading state */}
          {isLoading && (
            <div data-ocid="posts.loading_state">
              <Skeleton className="w-full h-96 rounded-xl mb-12" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SKELETON_CARDS.map((k) => (
                  <Skeleton key={k} className="h-72 rounded-lg" />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && publishedPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-24 text-center"
              data-ocid="posts.empty_state"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-5">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                No posts yet.
              </h2>
              <p className="text-muted-foreground max-w-sm">
                Check back soon — new articles about Azolla are on their way.
              </p>
            </motion.div>
          )}

          {/* Featured post */}
          {!isLoading && heroPost && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-14"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-3">
                  Featured
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Link
                to="/post/$slug"
                params={{ slug: heroPost.slug }}
                className="group block"
                data-ocid="posts.item.1"
              >
                <div className="grid md:grid-cols-2 gap-0 rounded-xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-card transition-all duration-300">
                  <div className="overflow-hidden aspect-[4/3] md:aspect-auto">
                    <img
                      src={
                        heroPost.coverImageUrl ||
                        "/assets/generated/azolla-hero.dim_1200x600.jpg"
                      }
                      alt={heroPost.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center bg-card">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {heroPost.tags.map((tag) => (
                        <Badge key={tag} className="capitalize text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors">
                      {heroPost.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {heroPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" /> {heroPost.author}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />{" "}
                        {formatDate(heroPost.publishedAt)}
                      </span>
                    </div>
                    <Button variant="default" className="w-fit gap-2 group/btn">
                      Read Article
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.section>
          )}

          {/* Other posts grid */}
          {!isLoading && otherPosts.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-8">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-3">
                  All Articles
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <motion.div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
              >
                {otherPosts.map((post, i) => (
                  <motion.div
                    key={post.id.toString()}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <PostCard post={post} index={i + 2} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
