// const path = require('path')
import path from 'path'
// webpack中所有配置信息都应该写在module.exports中
export default {
  // 入口文件
  entry: './src/app.ts',
  // 指定打包文件输出的路径
  output: {
    path: path.resolve('./', 'dist'),
    // 打包后的文件
    filename: 'bundle.js',
  },
  // 指定webpack打包时使用的模块
  module: {
    // 指定要加载的规则
    rules: [
      {
        // 指定的是规则生效的文件
        test: /\.ts$/,
        // 要使用的loader
        use: 'ts-loader',
        // 要排除的文件
        exclude: /node-modules/,
      },
    ],
  },
}
