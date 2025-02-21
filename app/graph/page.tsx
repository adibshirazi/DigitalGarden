"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { getAllEntries } from "@/lib/entries"

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false })

export default function GraphPage() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] })

  useEffect(() => {
    async function fetchGraphData() {
      const entries = await getAllEntries()
      const nodes = entries.map((entry) => ({ id: entry.slug, name: entry.title }))
      const links = entries.flatMap((entry) =>
        entry.linkedReferences.map((ref) => ({ source: entry.slug, target: ref.slug })),
      )
      setGraphData({ nodes, links })
    }
    fetchGraphData()
  }, [])

  return (
    <div className="w-full h-screen">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="name"
        nodeAutoColorBy="id"
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.001}
      />
    </div>
  )
}

