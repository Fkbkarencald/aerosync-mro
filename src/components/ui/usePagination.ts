import { useState } from 'react'

/** Paginate a mock list locally (preview behaviour — no data fetching). */
export function usePagination<T>(rows: T[], perPage: number) {
  const [page, setPage] = useState(1)
  const pages = Math.max(1, Math.ceil(rows.length / perPage))
  const clamped = Math.min(page, pages)
  return {
    page: clamped,
    pages,
    setPage,
    rows: rows.slice((clamped - 1) * perPage, clamped * perPage),
  }
}
