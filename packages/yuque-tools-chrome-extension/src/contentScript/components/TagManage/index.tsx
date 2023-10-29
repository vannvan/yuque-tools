/*
 * Description: 标签管理
 * Created: 2023-10-29 00:14:35
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-10-29 16:29:13
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */
import { useEffect, useRef, useState } from 'react'
import styles from './index.module.less'
import axios from 'axios'
import { YUQUE_ICON } from '@/utils/dict'
import toast, { Toaster } from 'react-hot-toast'
import { useClickAway } from 'ahooks'

const TagManage = () => {
  const [docInfo, setDocInfo] = useState<any>()

  // 当前文档的标签列表
  const [tagList, setTagList] = useState<any[]>([])

  // 当前用户的所有标签列表
  const [allTagList, setAllTagList] = useState<any[]>([])

  const [currnetUserInfo, setCurrentUserInfo] = useState<any>({})

  const [editVisible, setEditVisible] = useState<boolean>(false)

  const [editTagContent, setEditTagContent] = useState<string>('')

  const [isSelfDoc, setIsSelfDoc] = useState<boolean>(false)

  const origin = useRef<string>('')

  const editTagRef = useRef<any>(null)

  useEffect(() => {
    origin.current = window.location.origin
    init()
  }, [])

  useClickAway(() => {
    if (editVisible) {
      setEditVisible(false)
    }
  }, editTagRef)

  const init = async () => {
    const { docInfo: _docInfo, userInfo }: any = await getDocInfo(window.location.href)

    const _tagList: any = await getTagsListOfDoc(_docInfo.id)
    const _allTagList: any = await getAllTagsList(userInfo.login)
    setDocInfo(_docInfo)
    setIsSelfDoc(_docInfo.user_id === userInfo.id)
    setCurrentUserInfo(userInfo)
    setTagList(_tagList)
    setAllTagList(_allTagList)
  }

  const getDocInfo = (url: string) => {
    return new Promise((resolve) => {
      try {
        axios.get(url).then((res) => {
          const { data: documentContent } = res
          const regex = /decodeURIComponent\("(.*?)"\)/
          const match = documentContent.match(regex)

          if (match?.length) {
            const encoded = decodeURIComponent(match[1])
            const { doc, me } = JSON.parse(encoded)
            resolve({
              docInfo: doc,
              userInfo: me,
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
   * 获取当前文档的标签
   * @param docId
   * @returns
   */
  const getTagsListOfDoc = (docId: string) => {
    return new Promise((resolve) =>
      axios.get(origin.current + '/api/tags?docId=' + docId).then((res) => {
        // console.log(`${docId}的标签`, res.data.data)
        resolve(res.data.data)
      })
    )
  }

  const getAllTagsList = (userName: string) => {
    return new Promise((resolve) =>
      axios.get(origin.current + `/r/${userName}/tags?tag=`).then((res) => {
        const regex = /decodeURIComponent\("(.*?)"\)/
        const match = res.data.match(regex)
        if (match?.length) {
          const encoded = decodeURIComponent(match[1])
          const { tagGroup } = JSON.parse(encoded)
          // console.log('tagGroup', tagGroup)
          resolve(tagGroup)
        }
      })
    )
  }

  /**
   * 删除文档的标签
   * @param docId
   * @param tagId
   */
  const deleteTagOfDoc = (docId: string, tagId: string) => {
    axios
      .delete(`${origin.current}/api/tags/${tagId}`, {
        params: {
          docId,
        },
      })
      .then((res) => {
        if (res.data) {
          const _tagList = tagList.filter((tag) => tag.id !== tagId)
          setTagList(_tagList)
          toast.success('删除成功')
        }
      })
  }

  /**
   * 给文档添加已存在的标签
   * @param title
   */
  const setTagForDoc = (title: string) => {
    axios
      .post(`${origin.current}/api/tags`, {
        docId: docInfo.id,
        title,
      })
      .then((res) => {
        if (res.data) {
          const _tagList = [
            ...tagList,
            {
              id: res.data.data.id,
              title,
            },
          ]
          setTagList(_tagList)
          const _allTagList = [...allTagList]
          const index = _allTagList.findIndex((tag) => tag.title === title)
          _allTagList[index].count++
          setAllTagList(_allTagList)
          toast.success('应用成功')
        }
      })
      .catch((error) => {
        const { message } = error.response.data || {}
        toast.error(message)
      })
  }

  /**
   * 给文档添加全新的标签
   */
  const setNewTagForDoc = () => {
    const exit = allTagList.find((item) => item.title === editTagContent)
    if (exit) {
      toast.error(`${editTagContent}已存在`)
      return
    }
    axios
      .post(`${origin.current}/api/tags`, {
        docId: docInfo.id,
        title: editTagContent,
      })
      .then((res) => {
        if (res.data) {
          console.log(' res.data', res.data)
          const _tagList = [
            ...tagList,
            {
              id: res.data.data.id,
              title: editTagContent,
            },
          ]
          setTagList(_tagList)

          const _allTagList = [...allTagList]
          _allTagList.push({
            title: editTagContent,
            count: 1,
          })
          setAllTagList(_allTagList)
          setEditTagContent('')
          toast.success('添加成功')
        } else {
          console.warn('创建标签失败', res.data)
        }
      })
      .catch((error) => {
        console.log(error.response.data)
        const { message } = error.response.data || {}
        toast.error(message)
      })
  }

  useEffect(() => {
    console.log('yuque-tools-extension TagManage is running~')
  }, [])

  const isDocIncludeThisTag = (title: string) => {
    return tagList.some((tag) => tag.title === title)
  }

  return (
    <div className={styles.content} style={{ display: isSelfDoc ? 'flex' : 'none' }}>
      <Toaster position="top-center" />
      <div className={styles['doc-tag-wrap']} ref={editTagRef}>
        {tagList && tagList.length ? (
          tagList.map((tag: any) => (
            <div className={styles.item} key={tag.title}>
              <span>{tag.title}</span>
              <span
                dangerouslySetInnerHTML={{ __html: YUQUE_ICON.close }}
                style={{ cursor: 'pointer', marginLeft: 6 }}
                onClick={() => {
                  deleteTagOfDoc(docInfo.id, tag.id)
                  console.log('tag', tag)
                }}
              ></span>
            </div>
          ))
        ) : (
          <>暂无标签</>
        )}
        <div className={styles['to-be-edit-wrap']}>
          <div
            dangerouslySetInnerHTML={{ __html: YUQUE_ICON.add }}
            className={styles['add-icon']}
            onClick={() => setEditVisible(!editVisible)}
          ></div>

          <div
            className={styles['to-be-edit-outer-content']}
            style={{ display: editVisible ? 'block' : 'none' }}
          >
            <div
              className={styles['close-icon-wrap']}
              dangerouslySetInnerHTML={{ __html: YUQUE_ICON.close }}
              onClick={() => setEditVisible(false)}
            ></div>
            <div className={styles['to-be-edit-inner-content']}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 12,
                }}
              >
                <input
                  value={editTagContent}
                  type="text"
                  onChange={(e) => setEditTagContent(e.target.value)}
                  className={styles['tag-edit-input']}
                  placeholder="添加标签"
                  maxLength={10}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setNewTagForDoc()
                    }
                  }}
                />
                <span
                  dangerouslySetInnerHTML={{ __html: YUQUE_ICON.add }}
                  style={{ cursor: 'pointer', display: 'inline-block', fontSize: 14 }}
                  onClick={setNewTagForDoc}
                ></span>
              </div>
              <div className={styles['all-tag-list-content']}>
                {allTagList.map((tag: any) => (
                  <div
                    key={tag.title}
                    className={[
                      styles['tag-item'],
                      isDocIncludeThisTag(tag.title) ? styles['tag-item-active'] : '',
                    ].join(' ')}
                    style={{ display: 'flex' }}
                  >
                    <span>{tag.title}</span>
                    <span style={{ marginLeft: 6 }}>({tag.count})</span>
                    <span
                      dangerouslySetInnerHTML={{ __html: YUQUE_ICON.add }}
                      onClick={() => setTagForDoc(tag.title)}
                      style={{
                        marginLeft: 'auto',
                        cursor: 'pointer',
                        display: isDocIncludeThisTag(tag.title) ? 'none' : 'inline-block',
                        fontSize: 14,
                      }}
                    ></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={styles['tag-manage-link-button']}
        onClick={() => {
          const firstTag = allTagList[0].title
          window.open(`${origin.current}/r/${currnetUserInfo.login}/tags?tag=` + firstTag)
        }}
      >
        标签管理
      </div>
    </div>
  )
}

export default TagManage
