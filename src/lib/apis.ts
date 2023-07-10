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

  /**
   * 个人知识库列表
   */
  get yuqueBooksList() {
    return '/api/mine/book_stacks'
  },

  /**
   * 空间知识库列表
   */
  get yuqueBooksListOfSpace() {
    return '/api/mine/user_books?offset=0&limit=30&query=&user_type=Group'
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
   * 导出md
   * @param repos
   * @param linebreak 是否保持换行
   * @returns
   */
  yuqueExportMarkdown(repos: string, linebreak: boolean) {
    return `${repos}/markdown?attachment=true&latexcode=false&anchor=false&linebreak=${linebreak}`
  },
}

export default YUQUE_API
