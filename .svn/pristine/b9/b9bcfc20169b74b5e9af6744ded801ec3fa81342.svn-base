const path = require('path')
const fs = require('fs')
const glob = require('glob')
const inquirer = require('inquirer')
const program = require('commander')
const config = require('./wx.config')
program.usage('<project-name>').parse(process.argv)
program.usage('<next-name>').parse(process.argv)
program.usage('<target-name>').parse(process.argv)
program.usage('<target-names>').parse(process.argv)
console.log(program.args[0])
console.log(program.args[1])
console.log(program.args[2])
console.log(program.args[3])
// 根据输入，获取项目名称 ,获取对应的功能页面
// let projectName = program.args[0]
let targetName = program.args[0]
let baseName = program.args[1]



// const basePath = path.resolve(path.join('base/pages', baseName))
// let targetPath = config.projectPath + projectName + '/pages/'+targetName
let targetPath = path.join(process.cwd(), 'pages', targetName)
const basePath = path.resolve(path.join(__dirname, '../base/pages', baseName))


//  修改
specialArray = [{
    name: 'member',
    title: '成员列表'
  },
  {
    name: 'list',
    title: '列表'
  },
  {
    name: 'detail',
    title: '详情'
  },
  {
    name: 'join',
    title: '加入'
  },
  {
    name: 'create',
    title: '创建'
  },
]

// 判断是不是这个列表的命名
if (specialArray.some(item => {
    return item.name == baseName
  })) {
  // 是否取特定目录
  isSpecial = true
} else {
  isSpecial = false
}


if (isSpecial) {
  // 不等于基础模板时，带上baseName name list   nameList  
  targetPath += baseName.replace(baseName[0], baseName[0].toUpperCase())
}



// 判断basePath是否存在
fs.stat(basePath, (err, data) => {
  if (err) {


    return console.log(`${baseName}功能暂无`)
  }

  // 创建指定目录 
  fs.stat(targetPath, (err, stats) => {

    if (err) { // 判断指定目录是否存在
      // 命令行交互， 获取信息
      ask().then(answer => {
        fs.mkdirSync(targetPath)
        console.log('创建目录为' + targetPath)
        copyFile('js', answer)
        copyFile('wxml', answer)
        copyFile('wxss', answer)
        copyFile('json', answer)
        // 修改指定app.json
        changeAppJson()
      })

    } else if (stats.isDirectory()) {
      console.log('目录' + targetPath + '已存在')
      return
    } else {
      ask().then(answer => {
        fs.mkdirSync(targetPath)
        console.log('创建目录为' + targetPath)
        copyFile('js', answer)
        copyFile('wxml', answer)
        copyFile('wxss', answer)
        copyFile('json', answer)
        // 修改指定app.json
        changeAppJson()

      })
    }
    if (baseName == 'base') {
      console.log('已创建base模板')
    }
  })
})

function ask() {
  return inquirer.prompt([{
    name: 'navigationBarTitleText',
    message: 'navigationBarTitleText?'
  }])
}




// 修改json
function changeAppJson() {
  fs.readFile(process.cwd() + '/app.json', 'utf-8', (err, data) => {
    data = JSON.parse(data)
    data['pages'].push(`pages/${!isSpecial?targetName:targetName+baseName.replace(baseName[0],baseName[0].toUpperCase())}/${!isSpecial?targetName:targetName+baseName.replace(baseName[0],baseName[0].toUpperCase())}`)
    data = JSON.stringify(data)
    fs.writeFile(process.cwd() + '/app.json', data, (err, file) => {
      if (err) {
        return console.log(err)
      }
      console.log('修改app.json成功')
    })
  })
}
// 获取文件 输出文件
function copyFile(type, answer) {
  glob(`${basePath}/*.${type}`, (err, baseFile) => {
    if (err) {
      return console.log(err)
    }
    // 执行操作 对模板文件修改,获取返回字符串
    let targetStr = changeData(baseFile[0], type, answer)

    let name
    if (!isSpecial) {
      name = '/' + targetName
    } else {
      name = '/' + targetName + baseName.replace(baseName[0], baseName[0].toUpperCase())
    }
    fs.writeFile(targetPath + name + '.' + type, targetStr, (err, data) => {
      if (err) {
        return console.log(err)
      }
      console.log(`创建${name+'.'+type}---`)
    })
  })
}
// 替换规则 ： 唯一性
function changeData(data, type, answer) {
  let dataStr = fs.readFileSync(data, 'utf-8')
  // 执行模板文件修改
  if (type == 'json') {
    dataStr = JSON.parse(dataStr)
    dataStr['navigationBarTitleText'] = answer.navigationBarTitleText
    dataStr = JSON.stringify(dataStr)
  }
  if (baseName == 'list') {
    dataStr = dataStr.replace(/_getList/g, `get${targetName.replace(targetName[0],targetName[0].toUpperCase())}List`) //getTargetList  字母大写
    dataStr = dataStr.replace(/_interface/g, `${targetName}`)
    dataStr = dataStr.replace(/_list/g, `${targetName}List`)
    dataStr = dataStr.replace(/_detail/g, `${targetName}`)
    // dataStr = dataStr.replace(/fnList/g,`get${targetName}List`)
  } else if (baseName == 'detail') {
    dataStr = dataStr.replace(/_getDetail/g, `get${targetName.replace(targetName[0],targetName[0].toUpperCase())}`) //getTargetList  字母大写
    dataStr = dataStr.replace(/_interface/g, `${targetName}`)
    dataStr = dataStr.replace(/_detail/g, `${targetName}`)
  } else if (baseName == 'join') {
    dataStr = dataStr.replace(/_getDetail/g, `get${targetName.replace(targetName[0],targetName[0].toUpperCase())}`) //getTargetList  字母大写
    dataStr = dataStr.replace(/_detail/g, `${targetName}`)
    dataStr = dataStr.replace(/_interface/g, `${targetName}`)
  } else if (baseName == 'create') {
    dataStr = dataStr.replace(/_getDetail/g, `get${targetName.replace(targetName[0],targetName[0].toUpperCase())}`) //getTargetList  字母大写
    dataStr = dataStr.replace(/_detail/g, `${targetName}`)
    dataStr = dataStr.replace(/_interface/g, `${targetName}`)
  } else if (baseName == 'member') {
    dataStr = dataStr.replace(/_getDetail/g, `get${targetName.replace(targetName[0],targetName[0].toUpperCase())}`) //getTargetList  字母大写
    dataStr = dataStr.replace(/_detail/g, `${targetName}`)
    dataStr = dataStr.replace(/_interface/g, `${targetName}`)
  }

  return dataStr
}