import type { Metadata } from "next";
import { KnowledgeGraphStudio } from "@/components/knowledge-graph/knowledge-graph-studio";

export const metadata: Metadata = { title: "Knowledge Graph · SciLoop", description: "Explore the connected scientific knowledge behind every SciLoop discovery." };

export default function KnowledgeGraphPage() { return <KnowledgeGraphStudio />; }
