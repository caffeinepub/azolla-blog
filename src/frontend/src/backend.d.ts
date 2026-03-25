import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface NewPost {
    coverImageUrl: string;
    title: string;
    content: string;
    slug: string;
    tags: Array<string>;
    publishedAt: bigint;
    author: string;
    excerpt: string;
}
export interface UserProfile {
    name: string;
}
export interface Post {
    id: bigint;
    coverImageUrl: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: bigint;
    slug: string;
    tags: Array<string>;
    publishedAt: bigint;
    author: string;
    updatedAt: bigint;
    excerpt: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPost(post: NewPost): Promise<void>;
    deletePost(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPostById(id: bigint): Promise<Post>;
    getPostBySlug(slug: string): Promise<Post>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllPosts(): Promise<Array<Post>>;
    listPublishedPosts(): Promise<Array<Post>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    togglePublished(id: bigint): Promise<void>;
    updatePost(id: bigint, post: NewPost): Promise<void>;
}
