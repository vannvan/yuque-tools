export type IUserConfig = Ytool.App.IAccountInfo & {
  host: string
  output: string
}

export interface ILoginResponse {
  ok: boolean
  goto: string
  user: {
    id: string
    login: string
    name: string
    description: string
  }
}

export interface ICookies {
  expired: number
  data: string
}

export type TBookItem = {
  id: string
  slug: string
  name: string
  user: {
    name: string
    login: string
  }
  docs: TDocItem[]
}

export type TBookStackItem = {
  books: TBookItem[]
  name: string
  id: number
}

export interface IBookStack {
  data: TBookStackItem[]
}

export type TDocItem = {
  title: string
  slug: string
  description: string
}

export interface IDocsOfBook {
  data: TDocItem[]
}
