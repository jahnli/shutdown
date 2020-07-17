module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "appId": "com.example.app",
        "productName":"shutdown",//项目名，也是生成的安装文件名，即aDemo.exe
        "copyright":"Copyright © 2020",//版权信息
        "win":{//win相关配置
          "icon":"./logo.ico",//图标，当前图标在根目录下，注意这里有两个坑
          "target": [
            {
              "target": "nsis",//利用nsis制作安装程序
              "arch": [
                "x64",//64位
                "ia32"//32位
              ]
            }
          ]
        }
      }
    }
  }
}
