import path from "path"
import matter from "gray-matter"

const entriesDirectory = path.join(process.cwd(), "content", "entries")

let cachedEntries: any[] | null = null

export async function getAllEntries() {
  if (cachedEntries) {
    return cachedEntries
  }

  let entries: any[] = []

  if (typeof window === "undefined") {
    // Server-side code
    const fs = require("fs")
    if (!fs.existsSync(entriesDirectory)) {
      fs.mkdirSync(entriesDirectory, { recursive: true })
    }

    // Always check for the sample entry and create it if it doesn't exist
    const sampleEntryPath = path.join(entriesDirectory, "spaced-repetition.mdx")
    if (!fs.existsSync(sampleEntryPath)) {
      createSampleEntry(fs)
    }

    const filenames = fs.readdirSync(entriesDirectory)

    entries = filenames.map((filename: string) => {
      const filePath = path.join(entriesDirectory, filename)
      const fileContents = fs.readFileSync(filePath, "utf8")
      const { data, content } = matter(fileContents)
      return {
        slug: filename.replace(/\.mdx$/, ""),
        title: data.title || "Untitled",
        status: data.status || "Seedling",
        lastUpdated: data.lastUpdated || new Date().toISOString(),
        excerpt: data.excerpt || "",
        tags: data.tags || [],
        linkedReferences: data.linkedReferences || [],
        content,
      }
    })
  } else {
    // Client-side code
    // In a real-world scenario, you'd fetch this data from an API
    // For now, we'll return an empty array
    entries = []
  }

  cachedEntries = entries
  return entries
}

export async function getEntryBySlug(slug: string) {
  if (typeof window === "undefined") {
    // Server-side code
    const fs = require("fs")
    const filePath = path.join(entriesDirectory, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) {
      return null
    }
    const fileContents = fs.readFileSync(filePath, "utf8")
    const { data, content } = matter(fileContents)
    return {
      slug,
      title: data.title || "Untitled",
      status: data.status || "Seedling",
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      excerpt: data.excerpt || "",
      tags: data.tags || [],
      linkedReferences: data.linkedReferences || [],
      content,
    }
  } else {
    // Client-side code
    const entries = await getAllEntries()
    return entries.find((entry) => entry.slug === slug) || null
  }
}

export async function getEntriesByTag(tag: string) {
  const entries = await getAllEntries()
  return entries.filter((entry) => entry.tags.includes(tag))
}

export async function getAllTags() {
  const entries = await getAllEntries()
  const tags = new Set(entries.flatMap((entry) => entry.tags))
  return Array.from(tags)
}

function createSampleEntry(fs: any) {
  const sampleContent = `---
title: "Spaced Repetition: Optimizing Learning and Memory"
status: "Growing"
lastUpdated: "2023-05-16"
excerpt: "Exploring the powerful learning technique of spaced repetition and its applications in efficient knowledge acquisition."
tags: ["learning", "memory", "productivity"]
linkedReferences: 
  - { slug: "active-recall", title: "Active Recall" }
  - { slug: "forgetting-curve", title: "The Forgetting Curve" }
---

# Spaced Repetition: Optimizing Learning and Memory

Spaced repetition is a learning technique that involves reviewing information at gradually increasing intervals. This method leverages the psychological spacing effect to enhance long-term retention of knowledge.

## How Spaced Repetition Works

1. **Initial Learning**: You encounter new information.
2. **First Review**: Review the information shortly after learning it (e.g., within a day).
3. **Subsequent Reviews**: Review again at increasingly longer intervals (e.g., after 3 days, then a week, then a month).
4. **Adaptive Scheduling**: Adjust review intervals based on how well you remember the information.

... (rest of the content)
`

  fs.writeFileSync(path.join(entriesDirectory, "spaced-repetition.mdx"), sampleContent)
}

