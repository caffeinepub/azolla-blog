# Azolla Blog

## Current State
New project. Empty backend and default frontend scaffold.

## Requested Changes (Diff)

### Add
- Blog post data model (title, slug, content, excerpt, author, publishedAt, tags, coverImage)
- CRUD API for blog posts (admin only: create, update, delete; public: list, get)
- Sample seed blog posts about Azolla (the aquatic fern plant)
- Authorization: admin role for post management, public read
- Frontend: public blog listing page with featured post
- Frontend: individual post detail page
- Frontend: admin dashboard to create/edit/delete posts
- Frontend: navigation with logo/brand

### Modify
- Default app shell to Azolla Blog branding

### Remove
- Default placeholder content

## Implementation Plan
1. Generate Motoko backend with blog post types, stable storage, and CRUD methods
2. Wire authorization component for admin role checks
3. Build frontend: home (post list + featured), post detail, admin panel (login-gated)
