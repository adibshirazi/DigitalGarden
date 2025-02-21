import Link from "next/link"
import { getEntriesByTag, getAllTags } from "@/lib/entries"

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map((tag) => ({
    tag,
  }))
}

export default async function TagPage({ params }: { params: { tag: string } }) {
  const entries = await getEntriesByTag(params.tag)

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Entries tagged with "{params.tag}"</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <Link
            href={`/entry/${entry.slug}`}
            key={entry.slug}
            className="block p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition-shadow bg-white dark:bg-gray-800"
          >
            <h3 className="text-xl font-semibold mb-2">{entry.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{entry.excerpt}</p>
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded text-sm ${getStatusColor(entry.status)}`}>{entry.status}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {new Date(entry.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case "Seedling":
      return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
    case "Growing":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100"
    case "Evergreen":
      return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
    default:
      return "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100"
  }
}

