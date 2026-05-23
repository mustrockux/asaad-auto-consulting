export type ArticleCategory = "scams" | "myths" | "dealer";

export interface Article {
  id: string;
  category: ArticleCategory;
}

export const articles: Article[] = [
  { id: "scam1", category: "scams" },
  { id: "scam2", category: "scams" },
  { id: "scam3", category: "scams" },
  { id: "myth1", category: "myths" },
  { id: "myth2", category: "myths" },
  { id: "myth3", category: "myths" },
  { id: "dealer1", category: "dealer" },
  { id: "dealer2", category: "dealer" },
  { id: "dealer3", category: "dealer" },
];

export const dashboardActivity = [
  {
    id: "1",
    type: "quote" as const,
    date: "2026-05-20",
    status: "completed" as const,
  },
  {
    id: "2",
    type: "chat" as const,
    date: "2026-05-18",
    status: "completed" as const,
  },
];
