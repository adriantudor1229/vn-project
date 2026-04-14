import type { Vn, Page } from "./types";

const BASE = "/api/vn";

export async function fetchVns(page = 0, size = 20): Promise<Page<Vn>> {
  const res = await fetch(`${BASE}?page=${page}&size=${size}`);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return res.json();
}
