---
title: Eclipse使用
breadcrumb: false
headerDepth: 4
pageInfo: false
order: 2
---


## 1、安装和卸载
下载：https://www.eclipse.org/downloads/packages/

安装：只需要解压即可使用（安装目录尽量不要出现中文和空格）

卸载：将文件夹删除即可

## 2、常用快捷键
* Ctrl+T查看类 的结构
* Ctrl+alt+l看所有快捷键
* Ctrl+shift+f整理结构
* Ctrl+1 快速修复(最经典的快捷键,就不用多说了)
* Ctrl+D: 删除当前行
* Alt+↓ 当前行和下面一行交互位置(特别实用,可以省去先剪切,再粘贴了)
* Ctrl+L定位在某行
* Ctrl+Q定位到最后编辑的地方
* Ctrl+/ 注释当前行,再按则取消注释
* Shift+Alt+R对你的选定的属性全局命名
* Ctrl+K 参照选中的单词快速定位到下一个
* Ctrl+Shift+W关闭所有打开的editer
* Ctrl+Shift+X 把当前选中的文本全部变味小写Ctrl+Shift+Y 把当前选中的文本全部变为小写
* Ctrl+Shift+F 格式化当前代码这个相当常用
* Alt+Shift+M 抽取方法
* Alt+Shift+C 修改函数结构
* Alt+Shift+J  这个是用来快速生成方法参数的注释用的
* Ctrl+Shift+O导入所以包并删除无用包
* Ctrl+i对齐
* Ctrl+y回复

## 3、编码设置

![编码设置](https://pic1.imgdb.cn/item/687cb327eb915f894175b317/1753002766.png)

## 4、项目导入
在左侧的PackageExplorer区域右键，选择 import--General -- Existing Projects into Workspace
选择后，点击 next在新的窗口中，点击 Browse 找到需要导入的项目（注意，找到项目的名字位置就可以了）
选中要导入的项目，点击Copy复选框，点击Finish完成。
注意：Eclipse中已经存在的同名项目不能再次导入

![项目导入](https://pic1.imgdb.cn/item/687cb327eb915f894175b316/1753002788.png)

## 5、java项目中引入jar文件和导出jar文件
jar包是一个可以包含许多.class文件的压缩文件。我们可以将一个jar包加入到项目的依赖中，从而该项目可以使用该jar下的所有类；也可以把项目中所有的类打包到指定的jar包，提供给其他项目使用

导出步骤：项目右键选择export

![](https://pic1.imgdb.cn/item/687cb327eb915f894175b315/1753002782.jpg)

选择要导入的项目

![](https://pic1.imgdb.cn/item/687cb3cfeb915f894175b318/1753002950.png)

导入步骤

第一种方式
1. 项目根文件目录下创建 lib 文件夹，用于管理所有的 jar 文件
2. 把 jar 文件复制到 lib 文件夹中
3. 右键点击 jar 文件，点击 build path ，选择 add to build path，此时查看项目根文件夹下的.classpath 文件，发现新加入的 jar 包路径被配置到了该文件中，说明可以使用 jar 包中所有类了

![](https://pic1.imgdb.cn/item/687cb44ceb915f894175b319/1753003080.png)

第二种方式

![](https://pic1.imgdb.cn/item/687cb54feb915f894175b31d/1753003345.png)

![](https://pic1.imgdb.cn/item/687cb4c2eb915f894175b31a/1753003183.png)

如果是web项目直接放在lib文件下

![](https://pic1.imgdb.cn/item/687cb57eeb915f894175b31e/1753003389.png)

## 6、到处可以运行的文件
项目右键export

![](https://pic1.imgdb.cn/item/687cb632eb915f894175b31f/1753003543.png)

![](https://pic1.imgdb.cn/item/687cb67eeb915f894175b320/1753003646.png)

运行方式：cmd进入到指定位置，使用java运行jar的命令启动即可：java -jar xiaogongyi.jar
eclipse只是一个辅助工具，可将写的程序打包独立运行，打包步骤
1. 把bin文件拷贝到单独文件夹下
2. 将jre也复制到这个文件夹中，去掉一些多余的如src.zip lib\ext\jfxrt\.jar  bin\sever bin\jfxwebkit.dil减少尺寸与大小
3. 创建一个bat文件（在电脑中的组织中查看中去掉资源管理器的扩展名功能）内容是
   start jre\bin\javaw.exe -cp .\bin\ -Djava.ext.dirs=. com.lph.Main1 其中的main是代表入口类
4. bat文件创建一个快捷方式重命名，换图标压缩发布

## 7、eclipse 安装windowbuilder

1、下载最新版 eclipse 
地址：https://www.eclipse.org/downloads/packages/

下载解压，打开解压文件夹里的 eclipse.exe 文件

2、下载windowbuilder
地址  https://eclipse.dev/windowbuilder/downloads/
复制最新的下载地址

![](https://pic1.imgdb.cn/item/687cb728eb915f894175b321/1753003801.png)

打开 eclipse 点击 help -> install new software

![](https://pic1.imgdb.cn/item/687cb7b9eb915f894175b322/1753003936.png)

next 接收协议即可完成预安装 ，等几分钟右下角显示完成安装，提示重启 eclipse,重启之后即可使用

