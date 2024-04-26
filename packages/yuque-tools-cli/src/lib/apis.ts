const YUQUE_API = {
  /**
   * 登录的重定向目标地址
   */
  get yuqueReferer() {
    return '/login?goto=https%3A%2F%2Fwww.yuque.com%2Fdashboard'
  },
  /**
   * 登录
   */
  get yuqueLoginApi() {
    return '/api/accounts/login'
  },

  get mobileLoginApi() {
    return '/api/mobile_app/accounts/login?language=zh-cn'
  },

  /**
   * 个人知识库列表
   */
  get yuqueBooksList() {
    return '/api/mine/book_stacks'
  },

  /**
   * 协作知识库
   */
  get yuqueCollabBooks() {
    return '/api/mine/raw_collab_books'
  },

  /**
   * 空间知识库列表
   */
  get yuqueBooksListOfSpace() {
    return '/api/mine/user_books?user_type=Group'
  },

  /**
   * 知识库下的文档列表
   * @param bookId
   * @returns
   */
  yuqueDocsOfBook(bookId: string) {
    return `/api/docs?book_id=${bookId}`
  },

  /**
   * 知识库验证
   * @param bookId
   * @returns
   */
  yuqueBookPasswordVerify(bookId: string) {
    return `/api/books/${bookId}/verify`
  },

  /**
   * 导出md
   * @param repos
   * @param linebreak 是否保持换行
   * @param latexcode 是否保持latex
   * @returns
   */
  yuqueExportMarkdown(repos: string, linebreak: boolean, latexcode: boolean) {
    return `${repos}/markdown?attachment=true&latexcode=${latexcode}&anchor=false&linebreak=${linebreak}`
  },

  /**
   * 导出小记
   * @param repos
   * @param linebreak 是否保持换行
   * @returns
   */
  yuqueExportNotes(offset: number, limit: number) {
    return `/api/modules/note/notes/NoteController/index?offset=${offset}&q=&filter_type=all&status=0&merge_dynamic_data=0&order=content_updated_at&with_pinned_notes=true&limit=${limit}
`
  },
}

export default YUQUE_API
