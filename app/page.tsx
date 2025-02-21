import { getAllEntries } from "@/lib/entries"
import HomeClient from "./home-client"

export const metadata = {
  title: "Digital Garden - Home",
  description: "Welcome to my Digital Garden, a place for ideas to grow",
}

export default async function Home() {
  const entries = await getAllEntries()

  return <HomeClient entries={entries} />
}

