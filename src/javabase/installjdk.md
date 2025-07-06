---
title: 安装jdk
headerDepth: 4
order: 1
---

## 1、下载
JDK有OracleJDK和OpenJDK，一般看公司用的哪个版本，下载对应的即可  
OracleJDK官网下载地址：[https://www.oracle.com/cn/java/technologies/downloads/](https://www.oracle.com/cn/java/technologies/downloads/)  
下载链接默认最新版,其他版本选择Java archive,注意首先需要注册账号，然后登录下载  
OpenJDK官网：[https://openjdk.org/](https://openjdk.org/)  
OpenJDK下载：[https://jdk.java.net/java-se-ri/17-MR1](https://jdk.java.net/java-se-ri/17-MR1)

## 2、window 安装 jdk
下载下来点击安装，安装路径最好别放到c盘下，并且不要包含中文和空格，防止有些编程工具不识别

![](https://cdn.nlark.com/yuque/0/2024/png/2589452/1716176169751-a0975b3e-3978-4db8-912b-fff76ce580c4.png)

安装到如下步骤，是另外安装一个jre,因为jdk包含jre所以上面安装的时候已经安40cb-ab19-5656e366fcbb.png)

配置环境变量装了jre,此时关闭界面也行，但是为了保证有些编程工具配置jre问题，这里可以单独安装jre,比如这里安装到和jdk同目录下

![](https://cdn.nlark.com/yuque/0/2024/png/2589452/1716176170015-3a9cbbd7-e9b4-

右键我的电脑→属性→高级系统设置→环境变量；

新建→变量名JAVA_HOME变量值复制你的jdk存放的位置即可→确定

![](https://cdn.nlark.com/yuque/0/2024/png/2589452/1716176170176-a3e1d7de-ea94-4280-be97-a8039dc0d6dc.png)

win10中在环境变量中找到path--新建输入%JAVA_HOME%\bin--确定

![](https://cdn.nlark.com/yuque/0/2024/png/2589452/1716176170336-ef42d5a2-279d-4bbf-b51e-baf43a1474d4.png)

win7中，直接在path路径最前面加上%JAVA_HOME%\bin;

注意win7中有一个英文封号%JAVA_HOME%\bin;

![](https://cdn.nlark.com/yuque/0/2024/png/2589452/1716176170500-af6b603e-58c4-43db-9e70-48253f21f02d.png)

接下来就是验正是否配置成功，win+r 快捷启动命令端输入cmd，输入java –version  注意中间有一个空格，出现jdk版本说明配置成功

![](https://cdn.nlark.com/yuque/0/2025/png/2589452/1740018028046-1b89bb90-85e4-4725-bd6c-f02b31818cb1.png)

## 3、linux 安装 jdk
当前Linux版本

```bash
LSB Version:	:core-4.1-amd64:core-4.1-noarch
Distributor ID:	CentOS
Description:	CentOS Linux release 7.3.1611 (Core) 
Release:	7.3.1611
Codename:	Core
```

![](https://cdn.nlark.com/yuque/0/2025/gif/2589452/1740019520327-9d638853-c39a-4fa3-a61c-71d4b279f767.gif)检查服务器当前有没有自带java环境

```bash
rpm -qa | grep java
```

如果存在自带jdk，先卸载rpm -e --nodeps

如：

rpm -e --nodeps java-1.7.0-openjdk-1.7.0.99-2.6.5.1.el6.x86_64

rpm -e --nodeps java-1.6.0-openjdk-1.6.0.38-1.13.10.4.el6.x86_64

![](https://cdn.nlark.com/yuque/0/2025/png/2589452/1740019520825-eefddb6c-8619-442d-a4c5-18ed05913bb7.png)

将下载好的jdk压缩包jdk-8u151-linux-x64.tar.gz上传到opt目录下（安装软件一般安装在opt，根据自己习惯），上传软件这里使用的而是xftp,完成之后直接解压

```bash
tar -zxvf jdk-8u151-linux-x64.tar.gz
```

![](https://cdn.nlark.com/yuque/0/2025/gif/2589452/1740019520330-28c68991-ac45-4836-979f-7f1c2e6ff1eb.gif)解压之后打开环境变量配置文件profile，

```bash
vim /etc/profile
```

![](https://cdn.nlark.com/yuque/0/2025/gif/2589452/1740019520445-34b821c6-bb7d-4673-b048-979bd9e8f379.gif)执行上面命令之后会打开文本文件编译器vim ,linux自带的，按下键盘上的i键即可编辑，在文件末尾添加

```bash
unset -f pathmunge
JAVA_HOME=/opt/jdk1.8.0_151
PATH=/opt/jdk1.8.0_151/bin:$PATH
export JAVA_HOME PATH
```

如何保存上面编辑过的文件，按一下ESC键盘    shift+;   wq  即可保存 如图

![](https://cdn.nlark.com/yuque/0/2025/png/2589452/1740019520975-1bac5c1d-20c2-4d64-aa32-1a18e9563dca.png)![](https://cdn.nlark.com/yuque/0/2025/gif/2589452/1740019520756-7ef72697-5de7-42b0-9677-69bf812d9ce7.gif)

让配置文件生效

```bash
source /etc/profile
```

![](https://cdn.nlark.com/yuque/0/2025/gif/2589452/1740019520831-6a1d5d7e-bc04-43de-849c-d78d6d2ada6f.gif)
查看是否配置完成java -version

![](https://cdn.nlark.com/yuque/0/2025/png/2589452/1740019521204-a95ae867-b8f1-4de0-8f61-e8a296937240.png)

注意：前面步骤都对，还不能生效，就注销用户  
如果在3级别 直接输入命令logout  
如果在5级别 注销当前用户重新登陆  

