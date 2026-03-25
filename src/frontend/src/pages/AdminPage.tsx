import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit2,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  LogIn,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { NewPost, Post } from "../backend.d";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreatePost,
  useDeletePost,
  useIsCallerAdmin,
  useListAllPosts,
  useTogglePublished,
  useUpdatePost,
} from "../hooks/useQueries";

const SKELETON_ROWS = ["r1", "r2", "r3", "r4"];

const EMPTY_FORM: Omit<NewPost, "publishedAt"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "",
  coverImageUrl: "",
  tags: [],
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function PostForm({
  initialData,
  onSubmit,
  isPending,
  onCancel,
}: {
  initialData?: Post | null;
  onSubmit: (data: NewPost) => void;
  isPending: boolean;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<typeof EMPTY_FORM>(
    initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          excerpt: initialData.excerpt,
          content: initialData.content,
          author: initialData.author,
          coverImageUrl: initialData.coverImageUrl,
          tags: initialData.tags,
        }
      : { ...EMPTY_FORM },
  );
  const [tagsStr, setTagsStr] = useState(
    initialData ? initialData.tags.join(", ") : "",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSubmit({
      ...form,
      tags,
      publishedAt: BigInt(Date.now()) * BigInt(1_000_000),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="pf-title">Title *</Label>
          <Input
            id="pf-title"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({
                ...f,
                title,
                slug: f.slug || slugify(title),
              }));
            }}
            placeholder="Article title"
            required
            data-ocid="post_form.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pf-slug">Slug *</Label>
          <Input
            id="pf-slug"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="url-friendly-slug"
            required
            data-ocid="post_form.input"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pf-excerpt">Excerpt *</Label>
        <Textarea
          id="pf-excerpt"
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          placeholder="Short description shown on the blog listing"
          rows={2}
          required
          data-ocid="post_form.textarea"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pf-content">Content *</Label>
        <Textarea
          id="pf-content"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          placeholder="Full article content (Markdown supported)"
          rows={10}
          required
          data-ocid="post_form.textarea"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="pf-author">Author *</Label>
          <Input
            id="pf-author"
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            placeholder="Author name"
            required
            data-ocid="post_form.input"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="pf-cover">Cover Image URL</Label>
          <Input
            id="pf-cover"
            value={form.coverImageUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, coverImageUrl: e.target.value }))
            }
            placeholder="https://..."
            data-ocid="post_form.input"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pf-tags">Tags (comma-separated)</Label>
        <Input
          id="pf-tags"
          value={tagsStr}
          onChange={(e) => setTagsStr(e.target.value)}
          placeholder="science, agriculture, sustainability"
          data-ocid="post_form.input"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isPending}
          data-ocid="post_form.submit_button"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {initialData ? "Save Changes" : "Create Post"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            data-ocid="post_form.cancel_button"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

export default function AdminPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: posts, isLoading: postsLoading } = useListAllPosts();

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const togglePublished = useTogglePublished();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const handleLogin = async () => {
    try {
      await login();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCreate = async (data: NewPost) => {
    try {
      await createPost.mutateAsync(data);
      toast.success("Post created successfully!");
      setShowCreateForm(false);
    } catch {
      toast.error("Failed to create post.");
    }
  };

  const handleUpdate = async (data: NewPost) => {
    if (!editingPost) return;
    try {
      await updatePost.mutateAsync({ id: editingPost.id, post: data });
      toast.success("Post updated!");
      setEditingPost(null);
    } catch {
      toast.error("Failed to update post.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deletePost.mutateAsync(id);
      toast.success("Post deleted.");
    } catch {
      toast.error("Failed to delete post.");
    }
  };

  const handleToggle = async (id: bigint) => {
    try {
      await togglePublished.mutateAsync(id);
      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="font-display text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
        </div>

        {/* Not authenticated */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="admin.panel"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-5">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-semibold mb-2">
              Admin Access Required
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Please log in to access the admin dashboard and manage blog posts.
            </p>
            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              data-ocid="admin.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Signing
                  in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" /> Login to Continue
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Authenticated, checking admin role */}
        {isAuthenticated && adminLoading && (
          <div className="py-12" data-ocid="admin.loading_state">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}

        {/* Authenticated but not admin */}
        {isAuthenticated && !adminLoading && !isAdmin && (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="admin.error_state"
          >
            <p className="text-muted-foreground text-lg">
              You don't have admin access.
            </p>
          </div>
        )}

        {/* Admin dashboard */}
        {isAuthenticated && !adminLoading && isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground">
                {posts?.length ?? 0} total post{posts?.length !== 1 ? "s" : ""}
              </p>
              <Button
                onClick={() => setShowCreateForm((v) => !v)}
                className="gap-2"
                data-ocid="admin.primary_button"
              >
                <Plus className="w-4 h-4" />
                {showCreateForm ? "Cancel" : "New Post"}
              </Button>
            </div>

            {/* Create form */}
            {showCreateForm && (
              <div
                className="bg-card border border-border rounded-lg p-6 mb-8"
                data-ocid="admin.panel"
              >
                <h2 className="font-display text-xl font-semibold mb-5">
                  Create New Post
                </h2>
                <PostForm
                  onSubmit={handleCreate}
                  isPending={createPost.isPending}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            )}

            {/* Posts list */}
            {postsLoading ? (
              <div className="space-y-3" data-ocid="admin.loading_state">
                {SKELETON_ROWS.map((k) => (
                  <Skeleton key={k} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="space-y-3">
                {posts.map((post, idx) => (
                  <div
                    key={post.id.toString()}
                    className="flex items-start sm:items-center gap-4 bg-card border border-border rounded-lg p-4 flex-col sm:flex-row"
                    data-ocid={`admin.item.${idx + 1}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-medium text-foreground truncate">
                          {post.title}
                        </h3>
                        <Badge
                          variant={post.published ? "default" : "secondary"}
                          className="text-xs shrink-0"
                        >
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Toggle published */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggle(post.id)}
                        disabled={togglePublished.isPending}
                        title={post.published ? "Unpublish" : "Publish"}
                        data-ocid={`admin.toggle.${idx + 1}`}
                      >
                        {post.published ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>

                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingPost(post)}
                        data-ocid={`admin.edit_button.${idx + 1}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>

                      {/* Delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            data-ocid={`admin.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent data-ocid="admin.dialog">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &ldquo;
                              {post.title}&rdquo;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="admin.cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              data-ocid="admin.confirm_button"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16" data-ocid="admin.empty_state">
                <Leaf className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No posts yet. Create your first article!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </main>

      {/* Edit post modal */}
      <Dialog
        open={!!editingPost}
        onOpenChange={(open) => !open && setEditingPost(null)}
      >
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Edit Post
            </DialogTitle>
          </DialogHeader>
          {editingPost && (
            <PostForm
              initialData={editingPost}
              onSubmit={handleUpdate}
              isPending={updatePost.isPending}
              onCancel={() => setEditingPost(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
