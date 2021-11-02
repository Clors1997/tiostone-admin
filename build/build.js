'use strict'
require('./check-versions')() //檢查nodejs和npm版本

process.env.NODE_ENV = 'production' //設置環境
//打包時控制台動畫相關包
const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')  //输出不同颜色文字
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
//設置控制臺building for production...並開始
const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {  //編譯完成回調
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
