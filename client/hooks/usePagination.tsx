import { Dispatch, SetStateAction, useState } from 'react'

type apiProps = {
  query?: string
  room: string | null
}

type PaginationProps = {
  limit?: number
  page?: number
  updateList?: Dispatch<SetStateAction<unknown[]>>
  apiFunction: (args: apiProps) => Promise<unknown[]>
}

export function usePagination({
  limit = 10,
  updateList,
  apiFunction,
  page = 1
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(page)
  const [loading, setLoading] = useState(false)
  const [more, setMore] = useState(true)
  const [data, setData] = useState<unknown | unknown[]>([])

  const apiMethod = async (room: string | null) => {
    if (!more) return
    const query = `?limit=${limit}&page=${currentPage}`
    setLoading(true)
    try {
      const data = await apiFunction({ query, room })
      setLoading(false)

      if (data.length < limit || !data) setMore(false)
      if (data) {
        updateList && updateList((currentList) => [...data, ...currentList])
        setData(data)
      }
      setCurrentPage((prev) => prev + 1)
    } catch (e) {
      console.log(e)
    }
  }

  return { apiMethod, currentPage, loading, more, data }
}
