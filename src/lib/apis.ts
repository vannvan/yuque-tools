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
   * 知识库列表
   */
  get yuqueBooksList() {
    return '/api/mine/book_stacks'
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
   * @param linebreak
   * @returns
   */
  yuqueExportMarkdown(repos: string, linebreak: boolean = false) {
    return `${repos}/markdown?attachment=true&latexcode=false&anchor=false&linebreak=${linebreak}`
  },
}

export default YUQUE_API
