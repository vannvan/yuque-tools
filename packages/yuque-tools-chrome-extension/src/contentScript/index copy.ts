/*
 * Description:
 * Created: 2023-10-28 23:46:36
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-10-28 23:46:36
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */

import './content.css'
import $ from 'jquery'
import axios from 'axios'

console.info('yuque-tools-extension is running')

const ICON = {
  close: `<svg width="8" height="1em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" class="larkui-icon larkui-icon-close-outlined" style="margin-left: 4px;"><path d="M34.41 34.499c3.906-3.905 10.238-3.905 14.143 0l79.903 79.902 79.903-79.902c3.905-3.905 10.237-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-79.903 79.903 79.903 79.903c3.834 3.834 3.904 10.008.21 13.927l-.21.215c-3.905 3.906-10.237 3.906-14.142 0l-79.903-79.903-79.903 79.903c-3.905 3.906-10.237 3.906-14.142 0-3.906-3.905-3.906-10.237 0-14.142l79.902-79.903L34.41 48.641c-3.835-3.834-3.904-10.007-.21-13.927Z" fill="currentColor" fill-rule="evenodd"></path></svg>`,
  add: `<svg width="1em" height="1em" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" class="larkui-icon larkui-icon-add icon-svg ReaderLayout-module_actionItem_CbOzz index-module_size_wVASz" data-name="Add" style="width: 16px; min-width: 16px; height: 16px;"><path d="M128 28c5.523 0 10 4.477 10 10v80h80c5.523 0 10 4.477 10 10s-4.477 10-10 10h-80v80c0 5.523-4.477 10-10 10s-10-4.477-10-10v-80H38c-5.523 0-10-4.477-10-10s4.477-10 10-10h80V38c0-5.523 4.477-10 10-10Z" fill="currentColor" fill-rule="evenodd"></path></svg>`,
  delete: `<svg width="1em" height="1em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="larkui-icon larkui-icon-action-delete icon-svg index-module_size_wVASz" data-name="ActionDelete" style="width: 16px; min-width: 16px; height: 16px;"><path d="M13.625 4.25a.625.625 0 1 1 0 1.25H12.59l-.385 6.746a2.125 2.125 0 0 1-1.97 1.999l-.152.005H5.917a2.125 2.125 0 0 1-2.122-2.004L3.41 5.5H2.375a.625.625 0 1 1 0-1.25h11.25ZM11.338 5.5H4.661l.382 6.675a.875.875 0 0 0 .768.819l.106.006h4.166a.875.875 0 0 0 .874-.825l.381-6.675ZM6.75 7c.345 0 .625.28.625.625v2.75a.625.625 0 1 1-1.25 0v-2.75c0-.345.28-.625.625-.625Zm2.5 0c.345 0 .625.28.625.625v2.75a.625.625 0 1 1-1.25 0v-2.75c0-.345.28-.625.625-.625Zm1.625-5.25a.625.625 0 1 1 0 1.25h-5.75a.625.625 0 1 1 0-1.25h5.75Z" fill="currentColor" fill-rule="nonzero"></path></svg>`,
}

class YuqueTools {
  docInfo: {
    id: string
    title: string
  }
  origin: string
  userName: string
  editVisible: boolean
  allTagList: { title: string; count: number }[]
  currentDocTagList: any[]
  constructor() {
    this.docInfo = {} as any
    this.origin = ''
    this.userName = ''
    this.editVisible = true
    this.allTagList = []
    this.currentDocTagList = []
  }

  async init(url: string) {
    this.origin = window.location.origin
    const { docInfo, userName } = (await this.getDocInfo(url)) as any
    this.userName = userName
    this.docInfo = docInfo
    const self = this

    this.allTagList = await this.getAllTagsList()
    if (docInfo) {
      this.currentDocTagList = await this.getTagsListOfDoc(docInfo.id)
      console.log(`${docInfo.title}`, this.currentDocTagList)
      $('.header-crumb').after(`<div id="YuqueToolsTagManage">
        <button class="yuque-tools-primary-button yuque-tools-tag-manage">标签管理</button>
      </div>`)

      // 当前文档的标签列表
      const tagElement =
        this.currentDocTagList && this.currentDocTagList.length
          ? this.currentDocTagList
              .map(
                (tag) => `<div class="yuque-tools-tag-item" data-tag-id="${tag.id}">${tag.title}
            <span class="yuque-tools-delete-doc-tag-icon" data-tag-id="${tag.id}" data-doc-id="${docInfo.id}">${ICON.close}</span>
          </div>`,
              )
              .join('')
          : '<div style="margin-right:16px">暂无标签</div>'

      // 编辑
      const tagEditWrap = `
          <div class="yuque-tools-tag-edit-wrap" style="display:${
            this.editVisible ? 'block' : 'none'
          }" >
            <div class="yuque-tools-tag-new">
              <input placeholder="添加标签" class="yuque-tools-tag-new-input" />
              <span class="yuque-tools-handle-add-tag">${ICON.add}</span>
            </div>
            <div class="yuque-tools-tag-list">
              ${this.allTagList
                .map((item) => {
                  const isInclude = this.currentDocTagList
                    .map((tag) => tag.title)
                    .includes(item.title)
                  return `<div class="yuque-tools-all-tag-item  ${
                    isInclude ? 'yuque-tools-all-tag-item-highlight' : ''
                  }">
                    <span>${item.title}</span>
                    <span style="display:${
                      isInclude ? 'none' : 'block'
                    }" class="yuque-tools-tab-set-icon">${ICON.add}</span>
                    </div>`
                })
                .join('')}
            </div>
           
          </div>
        `

      //  <div class="yuque-tag-edit-action-wrap">
      //     <button class="yuque-tools-default-button">取消</button>
      //       <button class="yuque-tag-edit-save yuque-tools-primary-button">保存</button>
      //     </div>

      $('#YuqueToolsTagManage').prepend(
        `
        <div class="yuque-tools-doc-tag-list">
        ${tagElement}
        </div>
        <div class="yuque-tools-add-wrap">
          <div class="yuque-tools-add-icon">
          ${ICON.add}
          </div>
        ${tagEditWrap}
        </div>
        `,
      )

      // $('#ne-toolbar-container').css({
      //   'z-index': '0 !important',
      // })

      // 切换
      $('.yuque-tools-add-icon').click((e) => {
        e.stopPropagation()
        self.editVisible = !self.editVisible
        $('.yuque-tools-tag-edit-wrap').toggle()
      })

      // 跳转到标签管理
      $('.yuque-tools-tag-manage').click(() => {
        const firstTag = this.allTagList[0].title
        window.open(`${this.origin}/r/${this.userName}/tags?tag=` + firstTag)
      })

      self.updateEvent()
      // 添加tag
      $('.yuque-tools-handle-add-tag').click(() => {
        const newTagContent = $('.yuque-tools-tag-new-input').val()
        if (newTagContent) {
          axios
            .post(`${this.origin}/api/tags`, {
              docId: self.docInfo.id,
              title: newTagContent,
            })
            .then((res) => {
              const { data } = res.data
              $('.yuque-tools-tag-new-input').val('')
              // 所有文档的标签列表
              $('.yuque-tools-tag-list').prepend(
                `<div class="yuque-tools-all-tag-item yuque-tools-all-tag-item-highlight" 
                  data-tag-id="${data.id}">${newTagContent}
                </div>`,
              )

              // 当前文档的标签列表
              $('.yuque-tools-doc-tag-list').append(
                `<div class="yuque-tools-tag-item" data-tag-id="${data.id}">${newTagContent}<span class="yuque-tools-delete-doc-tag-icon" data-tag-id="${data.id}" data-doc-id="${docInfo.id}">${ICON.close}</span></div>`,
              )
              self.updateEvent()
            })
        }
      })
    }
    $(document).on('click', ':not(.yuque-tools-tag-edit-wrap)', function () {
      if (self.editVisible) {
        $('.yuque-tools-tag-edit-wrap').toggle()
      }
    })
  }

  updateCurrentDocTagElement() {
    const currentDocTagList: any[] = this.currentDocTagList
    //
  }

  updateEvent() {
    const self = this
    // 删除文档的标签
    $('.yuque-tools-delete-doc-tag-icon').click(function (e) {
      console.log('删除当前文档的标签', $(this).attr('data-doc-id'))
      const docId = $(this).attr('data-doc-id')
      const tagId = $(this).attr('data-tag-id')
      axios
        .delete(`${self.origin}/api/tags/${tagId}`, {
          params: {
            docId: docId,
          },
        })
        .then((res) => {
          console.log(res)
          $(`.yuque-tools-tag-item[data-tag-id="${tagId}"]`).remove()
          $(`.yuque-tools-all-tag-item[data-tag-id="${tagId}"]`).remove()
        })
    })

    // 给文档添加已存在的标签
    $('.yuque-tools-tab-set-icon').click(function (e) {
      console.log('设置标签', $(this).prev().text())
      const newTagContent = $(this).prev().text()
      axios
        .post(`${self.origin}/api/tags`, {
          docId: self.docInfo.id,
          title: newTagContent,
        })
        .then((res) => {
          const { data } = res.data
          // 当前文档的标签列表
          $('.yuque-tools-doc-tag-list').append(
            `<div class="yuque-tools-tag-item" data-tag-id="${data.id}">${newTagContent}<span class="yuque-tools-delete-doc-tag-icon" data-tag-id="${data.id}" data-doc-id="${self.docInfo.id}">${ICON.close}</span></div>`,
          )
          // 当前项目高亮
          $(this).parent().addClass('yuque-tools-all-tag-item-highlight')
          // 当前按钮删除
          $(this).remove()
        })
    })
  }

  locationObserver() {
    const self = this
    let oldHref: any = null
    const bodyList: any = document.querySelector('body'),
      observer = new MutationObserver(function (mutations) {
        if (oldHref != location.pathname) {
          oldHref = location.pathname
          setTimeout(() => {
            self.editVisible = false
            self.allTagList = []
            self.init(location.href)
          }, 200)
        }
      })
    const config = {
      childList: true,
      subtree: true,
    }
    observer.observe(bodyList, config)
  }

  getDocInfo(url: string) {
    return new Promise((resolve) => {
      try {
        axios.get(url).then((res) => {
          const { data: documentContent } = res
          // const documentContent = document.documentElement.innerHTML
          const regex = /decodeURIComponent\("(.*?)"\)/
          const match = documentContent.match(regex)

          if (match?.length) {
            const encoded = decodeURIComponent(match[1])
            const { doc, me } = JSON.parse(encoded)
            resolve({
              docInfo: doc,
              userName: me.login,
            })
          }
        })
      } catch (error) {
        console.warn(error)
        resolve({})
      }
    })
  }

  /**
   * 获取文章的标签
   * @param docId
   * @returns
   */
  async getTagsListOfDoc(docId: string): Promise<any[]> {
    return new Promise((resolve) =>
      axios.get(this.origin + '/api/tags?docId=' + docId).then((res) => {
        // console.log(`${docId}的标签`, res.data.data)
        resolve(res.data.data)
      }),
    )
  }
  /**
   * 获取用户的标签
   * @returns
   */
  async getAllTagsList(): Promise<{ title: string; count: number }[]> {
    return new Promise((resolve) =>
      axios.get(this.origin + `/r/${this.userName}/tags?tag=`).then((res) => {
        const regex = /decodeURIComponent\("(.*?)"\)/
        const match = res.data.match(regex)
        if (match?.length) {
          const encoded = decodeURIComponent(match[1])
          const { tagGroup } = JSON.parse(encoded)
          // console.log('tagGroup', tagGroup)
          resolve(tagGroup)
        }
      }),
    )
  }
}

const ytool = new YuqueTools()

ytool.locationObserver()
