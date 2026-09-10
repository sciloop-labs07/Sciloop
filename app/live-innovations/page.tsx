import { redirect } from "next/navigation";

export default function LiveInnovationsPage() {
  // The preserved HTML portal is now the single public SciLoop experience.
  // Keep this route as a compatibility redirect for bookmarks and old links.
  redirect("/sciloop-live");
}
