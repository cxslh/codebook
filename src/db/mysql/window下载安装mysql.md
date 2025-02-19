---
title: mysql安装和卸载
breadcrumb: false
headerDepth: 4
pageInfo: false
order: 2
---

## 一、卸载
第 1 步：停止 mysql 服务 找到计算机管理中的服务 将 mysql 服务从启动改为停止  
第 2 步：通过控制面板卸载程序将 mysql 卸载即可，这种方式删除数据目录下的数据不会跟着删除，找到 mysql 安装目录内容已经不在了；或者通过 360 或电脑关键软件卸载；或者通过软件包自带的卸载程序卸载  
第 3 步：删除 mysql data 文件夹（安装 mysql 的时候没有修改默认在 c 盘下的 program data 中的 mysql)  
第 4 步：删除环境变量下和 mysql 相关的配置和步骤 1 中的服务  
第 5 步：清理注册表，mysql8 不需要，5 版本需要手动删除  
+ win+R打开命令框，输入regedit打开注册表编辑器或者直接搜索regedit，进入注册表
+ 文件路径下：HKEY_LOCAL_MACHINE\SYSTEM\ControlSet002\Services\Eventlog\Application*找到MySQLD Service以及MYSQL进行删除(如果没有就可以忽略)
+ 此外在你的电脑可能会有多个或者不同的ControlSet00x*，都要将其中的MySQL删掉

## 二、mysql 版本说明
+ mysql community server 社区版 开源免费自由下 不提供技术支持
+ mysql Enterprise Edittion 企业版本 需付费 不能在线下载 可试用 30 天
+ mysql Cluster 集群版 开源免费用于集群服务器 可将几个 mysql server 封装成一个 server
+ mysql Cluster CGE 高级集群版 需付费



目前最新 8.0.27，同一台电脑可以同时装多个版本数据库， mysql 官方还提供了一款 mysql 的图形管理工具 mysql workbench 分别是

+ 社区版 mysql workbench
+ 商用版 mysql workbenchSE

## 三、安装


### 1、mysql5 版本安装


下载 mysql-5.5.56-winx64.msi，点击安装



![](https://img-blog.csdnimg.cn/20200701103430860.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



在打开的窗口中，选择接受安装协议，单击“next”继续安装，如图所示:



![](https://img-blog.csdnimg.cn/2020070110345333.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20200701103509707.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



在出现自定义安装界面中选择 mysql 数据库的安装路径,这里我设置的是“d:\MySQL”，单击“next”继续安装，如图所示：



![](https://img-blog.csdnimg.cn/20200701103604723.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20200701103630962.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



单击“Install”按钮之后出现如下正在安装的界面，经过很少的时间，MySQL 数据库安装完成，出现完成 MySQL 安装的界面，如图所示：



![](https://img-blog.csdnimg.cn/20200701103734617.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20200701103643885.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20200701103749333.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20200701103800931.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20200701103811813.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20200701103826352.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20200701103841614.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20200701103853767.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20200701103906832.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20200701103925417.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20200701103941991.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20200701103954814.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



问题：



1、无法 start service 问题



![](https://img-blog.csdnimg.cn/20200701104206580.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



2、mysql 安装到最后一步无响应的问题解决



安装完毕后，我们打开 MySQL 安装路径，这里我安装在 D:\Program Files\MySQL。然后找到 bin 下面的 MysqlinstanceConfig.exe



以管理员身份点击执行



重新之前安装过程，操作一样，无特殊要求一路[NEXT]就可以，这里我只讲解一下重要的地方：



![](https://img-blog.csdnimg.cn/20200701104531700.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



这里要改下服务名称我在尾部添加了 1072 四个数字，注意不要在下拉列表选！！！一定要自定义一个！！



![](https://img-blog.csdnimg.cn/20200701104657210.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



![](https://img-blog.csdnimg.cn/20200701104707505.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



测试安装成功是否



打开 cmd 输入 mysql -uroot -proot 如下，则安装成功



![](https://img-blog.csdnimg.cn/20200701104123165.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM0NDkxNTA4,size_16,color_FFFFFF,t_70)



### 2、mysql8 版本安装

打开下载地址

[https://www.mysql.com/](https://www.mysql.com/)

选择 downloads

![](https://img-blog.csdnimg.cn/img_convert/ebc30e1dc695568b467f44fb61d39608.png)

![](https://img-blog.csdnimg.cn/img_convert/4d0b41ce882df2becb7a656c78460c2f.png)

选择版本，直接下载 msi 的 zip 的还要做配置

![](https://img-blog.csdnimg.cn/img_convert/10e04963a22ee0b8769d99973d2f7930.png)

直接下载所有程序，不用下载引导器，历史版本选择 archives

![](https://img-blog.csdnimg.cn/img_convert/3785a8da78bcaabc94fba70f6141a8b3.png)

点击下载好的 8 版本的 msi 文件，选择自定义安装

![](https://img-blog.csdnimg.cn/img_convert/d2b52f598009dff3ca707883ff73a973.png)

![](https://img-blog.csdnimg.cn/img_convert/e604fe4017cce5f8ecdfdaad7f317af3.png)

下一步即可安装完成，接下来就是配置

![](https://img-blog.csdnimg.cn/img_convert/d914d7a417df809ee25f37960667489d.png)

![](https://img-blog.csdnimg.cn/img_convert/308f9eac16241db11802aa1fc942f311.png)

下一步输入密码和用户名

![](https://img-blog.csdnimg.cn/img_convert/121927621d77960a4a1f3e93bf90469d.png)

![](https://img-blog.csdnimg.cn/img_convert/d1110dacddce095d2fab18d358661496.png)

8.0 环境变量配置

![](https://img-blog.csdnimg.cn/img_convert/01fb9a83de79ae4df1bd228abf8083eb.png)

