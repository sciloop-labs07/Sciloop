import type { Metadata } from "next";
import { DirectorDashboard } from "@/components/director/director-dashboard";

export const metadata: Metadata = { title: "Director AI · SciLoop", description: "Coordinate, critique, optimize, and select the strongest SciLoop production." };
export default function DirectorPage() { return <DirectorDashboard />; }
