import type { Post } from "../backend.d";

export const SAMPLE_POSTS: Post[] = [
  {
    id: BigInt(1),
    slug: "azolla-the-worlds-fastest-growing-plant",
    title:
      "Azolla: The World's Fastest-Growing Plant & Its Remarkable Potential",
    excerpt:
      "Discover how this tiny aquatic fern is quietly revolutionizing sustainable agriculture, with the ability to double its biomass in just 2–3 days under ideal conditions.",
    content: `Azolla is a genus of seven species of aquatic ferns — small, free-floating plants that live on the surface of still or slow-moving water. What makes Azolla truly extraordinary is its symbiotic relationship with the nitrogen-fixing cyanobacterium *Anabaena azollae*, which lives within specialized cavities in the fern's leaves.

This partnership allows Azolla to fix atmospheric nitrogen directly into the soil, functioning as a natural, cost-free fertilizer. For rice farmers in Asia who have used Azolla for centuries, this isn't news — but modern sustainable agriculture is only beginning to appreciate the full scope of what this tiny plant can offer.

## Growth Rate

Under optimal conditions — warm temperatures, abundant sunlight, and nutrient-rich water — Azolla can double its biomass in as little as 2 to 3 days. This extraordinary growth rate makes it one of the fastest-growing plants on Earth, and means that a small initial culture can rapidly cover an entire pond or paddy field.

## Nitrogen Fixation

The nitrogen fixed by Azolla can replace or significantly reduce the need for synthetic nitrogen fertilizers. Studies in Vietnam and China show that using Azolla as a green manure can reduce nitrogen fertilizer application by 25–50%, cutting costs and environmental impact simultaneously.

## How to Grow Azolla

Growing Azolla is straightforward:
- Start with a small culture from a nursery or online supplier
- Place in a shallow container or pond with at least 4 hours of sunlight per day
- Maintain water temperature between 20–30°C
- Harvest every 7–10 days, returning a portion as starter culture

The harvested biomass can be used as green manure, livestock feed, or compost.`,
    author: "Dr. Maria Chen",
    coverImageUrl: "/assets/generated/azolla-hero.dim_1200x600.jpg",
    tags: ["basics", "nitrogen-fixation", "growth"],
    published: true,
    createdAt: BigInt(Date.now() - 7 * 86400000) * BigInt(1000000),
    publishedAt: BigInt(Date.now() - 7 * 86400000) * BigInt(1000000),
    updatedAt: BigInt(Date.now() - 7 * 86400000) * BigInt(1000000),
  },
  {
    id: BigInt(2),
    slug: "azolla-in-rice-paddies-ancient-wisdom",
    title: "Azolla in Rice Paddies: Ancient Wisdom Meets Modern Agronomy",
    excerpt:
      "Vietnamese farmers have used Azolla as a natural fertilizer for over 1,000 years. Today, scientists are rediscovering why this traditional practice is so effective.",
    content:
      "The use of Azolla in rice cultivation has a history stretching back over a millennium in Southeast Asia. In Vietnam, farmers refer to it as 'bèo hoa dâu' — the duckweed lotus. It was grown in winter in the rice paddies and incorporated into the soil before the rice season, providing a natural green manure that boosted yields without any artificial inputs.",
    author: "James Okafor",
    coverImageUrl: "/assets/generated/azolla-rice-paddies.dim_800x500.jpg",
    tags: ["rice-farming", "history", "asia"],
    published: true,
    createdAt: BigInt(Date.now() - 14 * 86400000) * BigInt(1000000),
    publishedAt: BigInt(Date.now() - 14 * 86400000) * BigInt(1000000),
    updatedAt: BigInt(Date.now() - 14 * 86400000) * BigInt(1000000),
  },
  {
    id: BigInt(3),
    slug: "azolla-nitrogen-fixation-science",
    title: "The Science of Azolla's Nitrogen Fixation Explained",
    excerpt:
      "How does a tiny floating fern capture atmospheric nitrogen? A deep dive into the Azolla-Anabaena symbiosis and what it means for sustainable fertilization.",
    content:
      "At the heart of Azolla's agricultural value is its unique symbiotic relationship with Anabaena azollae, a cyanobacterium that lives inside specialized dorsal leaf cavities of the fern. This relationship is one of the most intimate plant-microbe partnerships known to science.",
    author: "Dr. Sarah Wellstone",
    coverImageUrl: "/assets/generated/azolla-nitrogen.dim_800x500.jpg",
    tags: ["science", "nitrogen-fixation", "symbiosis"],
    published: true,
    createdAt: BigInt(Date.now() - 21 * 86400000) * BigInt(1000000),
    publishedAt: BigInt(Date.now() - 21 * 86400000) * BigInt(1000000),
    updatedAt: BigInt(Date.now() - 21 * 86400000) * BigInt(1000000),
  },
  {
    id: BigInt(4),
    slug: "growing-azolla-at-home",
    title: "Growing Azolla at Home: A Beginner's Complete Guide",
    excerpt:
      "You don't need a farm to grow Azolla. With a simple container and a sunny spot, you can cultivate this remarkable plant and use it to boost your garden soil.",
    content:
      "Azolla is surprisingly easy to grow at home, and you don't need any specialized equipment. A plastic storage bin, some pond water, and a sunny location are all you need to get started.",
    author: "Tom Greenfield",
    coverImageUrl: "/assets/generated/azolla-hands.dim_800x500.jpg",
    tags: ["guide", "home-growing", "beginner"],
    published: true,
    createdAt: BigInt(Date.now() - 30 * 86400000) * BigInt(1000000),
    publishedAt: BigInt(Date.now() - 30 * 86400000) * BigInt(1000000),
    updatedAt: BigInt(Date.now() - 30 * 86400000) * BigInt(1000000),
  },
  {
    id: BigInt(5),
    slug: "azolla-as-biofuel-future-energy",
    title: "Azolla as Biofuel: Could This Fern Power Our Future?",
    excerpt:
      "With its exceptional biomass production rate, Azolla is emerging as a candidate for next-generation biofuel production. Researchers are exploring its potential.",
    content:
      "The same qualities that make Azolla an exceptional fertilizer — rapid growth, high biomass production — also make it an intriguing candidate for biofuel production.",
    author: "Dr. Maria Chen",
    coverImageUrl: "/assets/generated/azolla-biofuel.dim_800x500.jpg",
    tags: ["biofuel", "energy", "research"],
    published: true,
    createdAt: BigInt(Date.now() - 45 * 86400000) * BigInt(1000000),
    publishedAt: BigInt(Date.now() - 45 * 86400000) * BigInt(1000000),
    updatedAt: BigInt(Date.now() - 45 * 86400000) * BigInt(1000000),
  },
  {
    id: BigInt(6),
    slug: "azolla-water-garden-ornamental",
    title: "Azolla in Your Water Garden: Beauty Meets Function",
    excerpt:
      "Beyond agriculture, Azolla makes a stunning addition to ornamental ponds and water gardens. Here's how to incorporate it into your landscape design.",
    content:
      "Azolla's delicate, mossy texture and bright green color make it a beautiful ornamental plant for water features. In autumn, many species turn a striking red or burgundy color, adding seasonal interest.",
    author: "Lena Hoffmann",
    coverImageUrl: "/assets/generated/azolla-garden.dim_800x500.jpg",
    tags: ["ornamental", "water-garden", "landscaping"],
    published: true,
    createdAt: BigInt(Date.now() - 60 * 86400000) * BigInt(1000000),
    publishedAt: BigInt(Date.now() - 60 * 86400000) * BigInt(1000000),
    updatedAt: BigInt(Date.now() - 60 * 86400000) * BigInt(1000000),
  },
];
