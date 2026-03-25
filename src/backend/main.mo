import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Persistent State for Posts
  let posts = Map.empty<Nat, Post>();
  var nextPostId = 1;

  // Authorization/Authentication functionality
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profiles
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type NewPost = {
    title : Text;
    slug : Text;
    content : Text;
    excerpt : Text;
    author : Text;
    publishedAt : Int;
    tags : [Text];
    coverImageUrl : Text;
  };

  type Post = NewPost and {
    id : Nat;
    published : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  module Post {
    // Order by publishedAt desc, then createdAt desc, then id desc
    public func compare(post1 : Post, post2 : Post) : Order.Order {
      switch (Int.compare(post2.publishedAt, post1.publishedAt)) {
        case (#equal) {
          switch (Int.compare(post2.createdAt, post1.createdAt)) {
            case (#equal) {
              Nat.compare(post2.id, post1.id);
            };
            case (other) { other };
          };
        };
        case (other) { other };
      };
    };
  };

  func validatePostData(post : NewPost) {
    if (post.title.size() == 0) {
      Runtime.trap("Title cannot be empty");
    };
    if (post.slug.size() == 0) {
      Runtime.trap("Slug cannot be empty");
    };
    if (post.content.size() == 0) {
      Runtime.trap("Content cannot be empty");
    };
    if (post.excerpt.size() == 0) {
      Runtime.trap("Excerpt cannot be empty");
    };
    if (post.author.size() == 0) {
      Runtime.trap("Author cannot be empty");
    };
    if (post.publishedAt != 0 and post.publishedAt >= Time.now()) {
      Runtime.trap("PublishedAt cannot be in the future");
    };
    if (post.coverImageUrl.size() == 0) {
      Runtime.trap("Cover image URL cannot be empty");
    };
  };

  func validateSlugUnique(slug : Text, excludeId : ?Nat) {
    let allPosts = List.empty<Post>();
    for (post in posts.values()) {
      allPosts.add(post);
    };
    let slugExists = allPosts.any(func(post) {
      post.slug == slug and (switch (excludeId) {
        case (?id) { post.id != id };
        case (null) { true };
      })
    });
    if (slugExists) {
      Runtime.trap("Slug must be unique");
    };
  };

  // --- Admin Blog Post Management ---

  public shared ({ caller }) func createPost(post : NewPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create posts");
    };

    validatePostData(post);
    validateSlugUnique(post.slug, null);

    let now = Time.now();
    let newPost : Post = {
      post with
      id = nextPostId;
      createdAt = now;
      updatedAt = now;
      published = false;
    };
    posts.add(nextPostId, newPost);
    nextPostId += 1;
  };

  public shared ({ caller }) func updatePost(id : Nat, post : NewPost) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update posts");
    };

    validatePostData(post);
    validateSlugUnique(post.slug, ?id);

    let existingPost = switch (posts.get(id)) {
      case (?post) { post };
      case (null) { Runtime.trap("Post not found") };
    };

    let now = Time.now();
    let updatedPost : Post = {
      post with
      id;
      createdAt = existingPost.createdAt;
      updatedAt = now;
      published = existingPost.published;
    };
    posts.add(id, updatedPost);
  };

  public shared ({ caller }) func deletePost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };

    if (not posts.containsKey(id)) {
      Runtime.trap("Post not found");
    };
    posts.remove(id);
  };

  public shared ({ caller }) func togglePublished(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can toggle post publication status");
    };

    let post = switch (posts.get(id)) {
      case (?post) { post };
      case (null) { Runtime.trap("Post not found") };
    };
    let updatedPost = { post with published = not post.published };
    posts.add(id, updatedPost);
  };

  public query ({ caller }) func listAllPosts() : async [Post] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all posts");
    };

    posts.values().toArray().sort();
  };

  public query ({ caller }) func listPublishedPosts() : async [Post] {
    posts.values().toArray().filter(func(post) { post.published }).sort();
  };

  public query ({ caller }) func getPostById(id : Nat) : async Post {
    let post = switch (posts.get(id)) {
      case (?post) { post };
      case (null) { Runtime.trap("Post not found") };
    };

    // Only admins can view unpublished posts
    if (not post.published and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Post not found");
    };

    post;
  };

  public query ({ caller }) func getPostBySlug(slug : Text) : async Post {
    let allPosts = posts.values().toArray();
    switch (allPosts.find(func(post) { post.slug == slug and post.published })) {
      case (?post) { post };
      case (null) { Runtime.trap("Post not found") };
    };
  };

  // --- Initialize with Sample Posts ---
  system func preupgrade() {};
  system func postupgrade() {
    let timestamp1 = 1654818240000000000;
    let timestamp2 = 1654904640000000000;
    let timestamp3 = 1654991040000000000;

    let samplePosts : [Post] = [
      {
        id = 1;
        title = "The Wonders of Azolla: Nature's Sustainable Fertilizer";
        slug = "azolla-sustainable-fertilizer";
        content = "Azolla is a tiny aquatic fern with enormous potential in sustainable farming. Its symbiotic relationship with nitrogen-fixing bacteria makes it a natural source of fertilizer, reducing the need for harmful chemicals.";
        excerpt = "Discover how Azolla is revolutionizing sustainable agriculture with its nitrogen-fixing abilities.";
        author = "Azolla Blog Team";
        publishedAt = timestamp1;
        tags = ["Azolla", "sustainability", "agriculture", "fertilizer"];
        coverImageUrl = "https://example.com/images/azolla-fertilizer.jpg";
        published = true;
        createdAt = timestamp1;
        updatedAt = timestamp1;
      },
      {
        id = 2;
        title = "Azolla in Sustainable Agriculture: A Case Study";
        slug = "azolla-case-study";
        content = "A recent study in Southeast Asia demonstrated the effectiveness of Azolla in rice paddies. Farmers saw an increase in crop yields while reducing their reliance on expensive nitrogen-based fertilizers.";
        excerpt = "See how farmers are using Azolla to boost crop yields and cut costs in real-world case studies.";
        author = "Azolla Blog Team";
        publishedAt = timestamp2;
        tags = ["Azolla", "sustainability", "agriculture"];
        coverImageUrl = "https://example.com/images/azolla-case-study.jpg";
        published = true;
        createdAt = timestamp2;
        updatedAt = timestamp2;
      },
      {
        id = 3;
        title = "Azolla Cultivation Tips for Beginners";
        slug = "azolla-cultivation-tips";
        content = "Starting an Azolla pond is easy and requires minimal maintenance. This article covers pond preparation, water requirements, and harvesting techniques for beginners.";
        excerpt = "Learn how to cultivate Azolla in your own backyard with these beginner-friendly tips.";
        author = "Azolla Blog Team";
        publishedAt = timestamp3;
        tags = ["Azolla", "cultivation", "agriculture", "farming"];
        coverImageUrl = "https://example.com/images/azolla-cultivation-tips.jpg";
        published = true;
        createdAt = timestamp3;
        updatedAt = timestamp3;
      },
    ];

    for (post in samplePosts.values()) {
      posts.add(post.id, post);
    };
    nextPostId := 4;
  };
};
