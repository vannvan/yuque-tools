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

interface IDocsOfBook {
  data: TDocItem[]
}

export { ILoginResponse, ICookies, TBookItem, TDocItem, TBookStackItem, IBookStack, IDocsOfBook }
