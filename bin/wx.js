const program = require('commander') // npm i commander -D

program.version('1.0.0')
  .usage('<command> [项目名称]')
  .command('init', '创建新项目：  init  项目名')
  .command('add', '添加功能： add 命名 模块名称(list detail member create)')
  .parse(process.argv)