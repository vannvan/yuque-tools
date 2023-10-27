interface ILoginResponse {
  ok: boolean
  goto: string
  user: {
    id: string
    login: string
    name: string
    description: string
  }
}

interface ICookies {
  expired: number
  data: string
}

type TBookItem = {
  id: string
  slug: string
  name: string
  user: {
    name: string
    login: string
  }
  docs: TDocItem[]
}

type TBookStackItem = {
  books: TBookItem[]
  name: string
  id: number
}

interface IBookStack {
  data: TBookStackItem[]
}

type TDocItem = {
  title: string
  slug: string
  description: string
}

type TNoteTag = {
  id: number
  name: string
}

type TNoteContent = {
  updated_at: string
  abstract: string
}

type TNote = {
  tags: TNoteTag[]
  content: TNoteContent
  id: number
  slug: string

}

type TNoteRst = {
  notes: TNote[]
  pin_notes: TNote[]
  has_more: boolean
}

interface IDocsOfBook {
  data: TDocItem[]
}

export { ILoginResponse, ICookies, TBookItem, TDocItem, TBookStackItem, IBookStack, IDocsOfBook, TNoteRst }
