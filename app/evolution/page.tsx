import type { Metadata } from "next";
import { EvolutionDashboard } from "@/components/evolution/evolution-dashboard";

export const metadata: Metadata = { title: "Evolution Engine · SciLoop", description: "Learn from every published reel and improve the next production." };
export default function EvolutionPage() { return <EvolutionDashboard />; }
