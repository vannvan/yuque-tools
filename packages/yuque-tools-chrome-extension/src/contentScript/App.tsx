/*
 * Description:
 * Created: 2023-10-28 23:51:02
 * Author: van
 * Email : adoerww@gamil.com
 * -----
 * Last Modified: 2023-10-29 12:29:56
 * Modified By: van
 * -----
 * Copyright (c) 2023 https://github.com/vannvan
 */

import { useEffect } from 'react'
import './App.less'
import TagManage from './components/TagManage'
import GlobalFloatButton from './components/GlobalFloatButton'

interface App {
  toolType: 'tagManage' | 'globalButton'
}

const App = (props: App) => {
  const { toolType } = props
  useEffect(() => {
    console.log('yuque-tools-extension is running~')
  }, [])
  useEffect(() => {
    //
  }, [])

  return (
    <>
      {toolType == 'tagManage' && <TagManage />}
      {toolType == 'globalButton' && <GlobalFloatButton />}
    </>
  )
}

export default App
