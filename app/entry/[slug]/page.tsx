import { MDXRemote } from "next-mdx-remote/rsc"
import { getEntryBySlug, getAllEntries } from "@/lib/entries"
import Link from "next/link"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const entries = await getAllEntries()
  return entries.map((entry) => ({
    slug: entry.slug,
  }))
}

export default async function EntryPage({ params }: { params: { slug: string } }) {
  const entry = await getEntryBySlug(params.slug)

  if (!entry) {
    notFound()
  }

  return (
    <article className="max-w-2xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{entry.title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {entry.status} • Last tended {new Date(entry.lastUpdated).toLocaleDateString()}
        </p>
      </header>
      <div className="prose dark:prose-invert max-w-none">
        <MDXRemote source={entry.content} />
      </div>
      {(entry.tags.length > 0 || entry.linkedReferences.length > 0) && (
        <footer className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          {entry.tags.length > 0 && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Link
                    href={`/tag/${tag}`}
                    key={tag}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {entry.linkedReferences.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Linked References</h2>
              <ul className="space-y-1">
                {entry.linkedReferences.map((ref) => (
                  <li key={ref.slug}>
                    <Link href={`/entry/${ref.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {ref.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </footer>
      )}
    </article>
  )
}

