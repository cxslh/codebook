---
title: 安装
breadcrumb: false
headerDepth: 4
pageInfo: false
order: 2
---

## 一、Linux 安装 Redis
如果需要卸载之前的旧版本，卸载步骤如下 
1. 停止redis-server服务
2. 删除/usr/local/bin目录下与redis相关的文件
```shell
ls -l /usr/local/bin/redis-*
rm -rf /usr/local/bin/redis-*
```
安装前首先需要下载安装包,官网下载地址：[https://redis.io/download/](https://redis.io/download/),这里选择redis7.0版本，下载之后上传到系统指定目录下，比如我上传到opt目录下，接着解压
```shell
tar -zxvf redis-7.0.15.tar.gz
```
解压完的Redis目录
* redis-benchmark:性能测试工具，服务启动后运行该命令，看看自己电脑性能如何
* redis-check-aof:修复有问题的AOF文件，RDB和AOF后续问介绍
* redis-check-dump:修复有问题的dump.rdb文件
* redis-cli:客户端操作入口
* redis-sentinel:redis集群使用
* reids-server:redis服务器启动命令

因为tar文件类似java源码，需要经过编译，所以要先安装编译c源码的编译器gcc
```shell
yum -y install gcc
```
对解压好的Redis目录执行编译，
```shell
make
```
注意：make命令执行后如果发生-jemalloc/jemalloc.h没有那个文件或目录这个错误，执行命令 make distclean编译完成之后进行安装
```shell
make install
```
默认安装在以下目录 /usr/local/bin

![安装目录](https://pic1.imgdb.cn/item/67eb52ad0ba3d5a1d7e8b11b/image.png)

安装完启动Redis,Redis启动有两种方式启动,如下第一种方式
```shell
redis-server
```
启动之后不能执行其他命令，通过Ctrl+c强制关闭，但是redis也会关闭。第二种方式:  
首先把/opt/redis-7.0.15目录下的redis.conf文件拷贝到指定路径，这里我复制到etc下
```shell
cp redis.conf /etc/redis.conf
```
对etc下的redis.conf修改
```text
1、默认daemonize no 改为 daemonize yes
2、默认protected-mode yes 改为 protected-mode no
3、默认bind 127.0.0.1 改为 直接注释掉(默认bind 127.0.0.1只能本机访问)或改成本机IP，否则影响远程IP连接
4、默认redis密码 改为 requirepass 自己设定的密码
```
再进入/usr/local/bin目录下启动redis
```shell
redis-server /etc/redis.conf
```
测试是否启动成功 ，进入/usr/local/bin目录下执行
```shell
redis-cli
```
执行ping命令查看结果

第二种方式启动的Redis要如何关闭呢？有以下两种方式
1. 单实例关闭：在Redis服务器外面关闭命令：redis-cli -a 123456 shutdown，如果在Redis服务器里面可以直接使用shutdown命令
2. 多实例关闭，指定端口关闭：redis-cli -p 6379 shutdown

## 二、Windows安装Redis
Redis 官方不建议在 Windows 下使用 Redis，所以官网没有 Windows 版本可以下载，但是我们可以找到github上维护了开源的 Windows 版本，如：
[https://github.com/tporadowski/redis/releases](https://github.com/tporadowski/redis/releases),下载之后解压即可  
![安装目录](https://pic1.imgdb.cn/item/67eb53d70ba3d5a1d7e8b4c0/image.png)

双击 redis-server.exe 启动redis服务，然后通过客户端去访问上面存在得问题，每次都要打开redis启动服务cmd窗口才能运行，
解决方法：安装成Windows服务—开机自启，打开cmd窗口，切换到redis目录，执行命令
```shell
redis-server --service-install redis.windows.conf
```
打开cmd窗口输入services.msc，自行开启redis服务器即可  
![服务](https://pic1.imgdb.cn/item/67eb543a0ba3d5a1d7e8b602/image.png)

## 三、Redis可视化工具
### 1、RedisView
功能概述
* Redis数据库视图工具，提供CURD功能
* 提供基本命令运行
* 支持单例、复制集、哨兵、集群模式
* 支持订阅发布模式
* 支持批量删除、oracle与mysql导入导出、Oracle与mysql表键删除
* 支持中英文、设置编码、设置皮肤
* 支持千万级数据操作

下载地址
* github搜索[https://github.com/cc20110101/RedisView/releases](https://github.com/cc20110101/RedisView/releases)

界面  
![界面 ](https://pic1.imgdb.cn/item/67eb55dd0ba3d5a1d7e8bb06/image.png)

### 2、QuickRedis
支持直连、哨兵、集群，支持亿万数量级的key，还有令人兴奋的UI。 官网地址[https://quick123.net/](https://quick123.net/)

### 3、AnotherRedisDesktopManager
AnotherRedisDesktopManager作为一款基于nodejs开发的免费的Redis可视化管理工具，可以运行在Windows、Linux、Mac平台，而且是开源免费应用，就很推荐使用了
地址[https://github.com/qishibo/AnotherRedisDesktopManager/](https://github.com/qishibo/AnotherRedisDesktopManager/)

### 4、RedisPlus
RedisPlus是为Redis可视化管理开发的一款开源免费的桌面客户端软件，支持Windows 、Linux 、Mac三大系统平台，RedisPlus提供更加高效、方便、快捷的使用体验，
有着更加现代化的用户界面风格。该软件支持单机、集群模式连接，同时还支持SSH（单机、集群）通道连接。RedisPlus目前是由Java开发的，在后面的4.0版本总会采用nodejs+vue+iview+electron开发，现在还没发布！而且3.0版本的我觉得已经很好用了！
下载地址[https://gitee.com/MaxBill/RedisPlus](https://gitee.com/MaxBill/RedisPlus)