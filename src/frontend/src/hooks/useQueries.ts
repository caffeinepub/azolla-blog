import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NewPost, Post } from "../backend.d";
import { useActor } from "./useActor";

export function useListPublishedPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ["publishedPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPublishedPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ["allPosts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPostBySlug(slug: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Post>({
    queryKey: ["post", slug],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getPostBySlug(slug);
    },
    enabled: !!actor && !isFetching && !!slug,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

function invalidatePostCaches(qc: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    qc.invalidateQueries({ queryKey: ["allPosts"] }),
    qc.invalidateQueries({ queryKey: ["publishedPosts"] }),
  ]);
}

export function useCreatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (post: NewPost) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createPost(post);
    },
    onSuccess: () => invalidatePostCaches(qc),
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, post }: { id: bigint; post: NewPost }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updatePost(id, post);
    },
    onSuccess: () => invalidatePostCaches(qc),
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deletePost(id);
    },
    onSuccess: () => invalidatePostCaches(qc),
  });
}

export function useTogglePublished() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.togglePublished(id);
    },
    onSuccess: () => invalidatePostCaches(qc),
  });
}
