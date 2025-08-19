export type Review = {
  id: string
  title: string
  subtitle?: string
  body: string
}

const seed: Review[] = [
  {
    id: "rdb-250",
    title: "Baileigh RDB-250",
    subtitle: "Hydraulic • Taiwan • Max 1-1/2\" OD",
    body: "Full review coming soon. Overview, pros/cons, and buying advice will appear here."
  },
  {
    id: "jd2-32",
    title: "JD2 Model 32",
    subtitle: "Manual • USA • Max 2\" OD",
    body: "Full review coming soon. Overview, pros/cons, and buying advice will appear here."
  },
  {
    id: "m600",
    title: "RogueFab M600 Series",
    subtitle: "Hydraulic • USA • Max 2-3/8\" OD",
    body: "Full review coming soon. Overview, pros/cons, and buying advice will appear here."
  }
]

export async function getReviewById(id: string) {
  const needle = String(id).toLowerCase()
  const hit =
    seed.find(r => r.id.toLowerCase() === needle)
    ?? seed.find(r => r.title.toLowerCase().includes(needle))
  return hit ?? null
}
