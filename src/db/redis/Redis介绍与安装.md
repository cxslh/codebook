---
title: Redis介绍与安装
breadcrumb: false
headerDepth: 4
pageInfo: false
order: 1
---

## 一、介绍
直接看官网方介绍  
官网地址:[https://redis.io/](https://redis.io/)  
![介绍](https://codelearning-9gtr246hb9b78416-1316243198.ap-shanghai.app.tcloudbase.com/pic/redis/1.png)  
翻译成中文  
Remote Dictionary Server(远程字典服务)是完全开源的，使用ANSIC语言编写遵守BSD协议，
是一个高性能的Key-Value数据库提供了丰富的数据结构，例如String、Hash、List、Set、SortedSet等等。
数据是存在内存中的，同时Redis支持事务、持久化、LUA脚本、发布/订阅、缓存淘汰、流技术等多种功能特性提供了主从模式、
Redis Sentinel和Redis Cluster集群架构方案。

从介绍中可以了解到  
* redis的性能是极高的,据测试Redis读的速度可以达到110000次/秒，写的速度可以达到81000次/秒
* Redis数据类型丰富，不仅仅支持简单的Key-Value类型的数据，同时还提供list，set，zset，hash等数据结构的存储
* Redis支持数据的持久化，可以将内存中的数据保持在磁盘中，重启的时候可以再次加载进行使用
* Redis支持数据的备份，即master-slave模式的数据备份

这么伟大的作品，作者是谁呢？真是下面这位发如乌云的大神安特雷兹(antirez)
![作者](https://codelearning-9gtr246hb9b78416-1316243198.ap-shanghai.app.tcloudbase.com/pic/redis/zz.png)  
个人github：github.com/antirez  
个人博客：antirez.com/latest/0

几个重要的地址，用来学习redis  
* 官网地址:[https://redis.io/](https://redis.io/)  
* 中文地址:[http://www.redis.cn/](http://www.redis.cn/)  
* Redis源码地址:[https://github.com/redis/redis](https://github.com/redis/redis)
* Redis在线测试地址:[https://try.redis.io/](https://try.redis.io/)
* Redis命令参考:[http://doc.redisfans.com/](http://doc.redisfans.com/)

## 二、Redis应用场景
平时我们开发中用到redis的地方蛮多的，下面就了解的应用场景做个总结：
### 1、热点数据问题缓存
缓存是Redis最常见的应用场景，之所有这么使用，主要是因为Redis读写性能优异，读的速度可以达到110000次/秒，写的速度可以达到81000次/秒。而且逐渐有取代memcached，
成为首选服务端缓存的组件。而且Redis内部是支持事务的，在使用时候能有效保证数据的一致性。作为缓存使用时， 一般有两种方式保存数据：
* 方式一:读取前，先去读Redis，如果没有数据，读取数据库，将数据拉入Redis。  

这种方式实施起来简单，但是有两个需要注意的地方：
1.避免缓存击穿（数据库没有就需要命中的数据，导致Redis一直没有数据，而一直命中数据库。）
2.数据的实时性相对会差一点。

* 方式二:插入数据时，同时写入Redis。  

这种方式数据实时性强，但是开发时不便于统一处理。
当然，两种方式根据实际情况来适用。比如方案一适用于对于数据实时性要求不是特别高的场景。方案二适用于字典表、数据量不大的数据存储。


### 2、限时业务的运用
redis中可以使用expire命令设置一个键的生存时间，到时间后redis会删除它。利用这一特性可以运用在限时的优惠活动信息、
手机验证码等业务场景。
### 3、计数器相关问题
redis由于incrby命令可以实现原子性的递增，所以可以运用于高并发的秒杀活动、分布式序列号的生成、
具体业务还体现在比如限制一个手机号发多少条短信、一个接口一分钟限制多少请求、一个接口一天限制调用多少次等等。
### 4、分布式锁
这个主要利用redis的setnx命令进行，setnx："set if not exists"就是如果不存在则成功设置缓存同时返回1，否则返回0 ，
这个特性在很多后台中都有所运用，比如在集群中执行一些定时任务时，可能在两台机器上都会运行，
所以在定时任务中首先 通过setnx设置一个lock， 如果成功设置则执行，如果没有成功设置，则表明该定时任务已执行。 当然结合具体业务，我们可以给这个lock加一个过期时间，
比如说30分钟执行一次的定时任务，那么这个过期时间设置为小于30分钟的一个时间就可以，这个与定时任务的周期以及定时任务执行消耗时间相关。
在分布式锁的场景中，主要用在比如秒杀系统等。
### 5、延时操作
比如在订单生产后我们占用了库存，10分钟后去检验用户是否真正购买，如果没有购买将该单据设置无效，同时还原库存。 
由于redis自2.8.0之后版本提供Keyspace Notifications功能，允许客户订阅Pub/Sub频道，
以便以某种方式接收影响Redis数据集的事件。 所以我们对于上面的需求就可以用以下解决方案，
我们在订单生产时，设置一个key，同时设置10分钟后过期， 我们在后台实现一个监听器，监听key的实效，
监听到key失效时将后续逻辑加上。当然我们也可以利用rabbitmq、activemq等消息中间件的延迟队列服务实现该需求。
### 6、排行榜相关问题
关系型数据库在排行榜方面查询速度普遍偏慢，所以可以借助redis的SortedSet进行热点数据的排序。
比如点赞排行榜，做一个SortedSet, 然后以用户的openid作为上面的username, 
以用户的点赞数作为上面的score, 然后针对每个用户做一个hash, 
通过zrangebyscore就可以按照点赞数获取排行榜，
然后再根据username获取用户的hash信息，
### 7、点赞、好友等相互关系的存储
Redis利用集合的一些命令，比如求交集、并集、差集等。在微博应用中，每个用户关注的人存在一个集合中，
就很容易实现求两个人的共同好友功能。
### 8、简单队列
由于Redis有list push和list pop这样的命令，所以能够很方便的执行队列操作

## 三、redis下载、安装、卸载
### 1、Linux版本下载安装
安装包：[https://redis.io/download/](https://redis.io/download/)，选择redis7.0版本即可  

下载之后上传到系统指定目录下，这里我上传到opt目录下并进行解压
```shell
tar -zxvf redis-7.0.15.tar.gz
```
```text
redis-benchmark:性能测试工具，服务启动后运行该命令，看看自己电脑性能如何
redis-check-aof:修复有问题的AOF文件，RDB和AOF后续问介绍
redis-check-dump:修复有问题的dump.rdb文件
redis-cli:客户端操作入口
redis-sentinel:redis集群使用
reids-server:redis服务器启动命令
```

因为tar文件类似java源码，需要经过编译，所以要先安装编译c源码的编译器gcc
```shell
yum -y install gcc
```
进入解压好的redis目录执行编译
```shell
make
```
注意：make命令执行后如果发生-jemalloc/jemalloc.h没有那个文件或目录这个错误，执行命令 make distclean  
编译完成之后进行安装
```shell
make install
```
默认安装在以下目录 /usr/local/bin  

![安装](https://codelearning-9gtr246hb9b78416-1316243198.ap-shanghai.app.tcloudbase.com/pic/redis/az.png)  
安装完之后就是启动redis,redis启动有前台和后台两种方式启动，推荐后台启动

* 前台启动：在 /usr/local/bin下执行
```shell
redis-server
```
启动之后不能执行其他命令，通过Ctrl+c强制关闭，但是redis也会关闭
* 后台启动：
进入 /opt/redis-7.0.15下，将redis.conf文件拷贝到指定路径，这里我复制到etc下
```shell
cp redis.conf /etc/redis.conf
```
进入etc对redis.conf修改
```shell
vim redis.conf
```

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
::: info
Redis端口为什么是6379？  
Redis的默认端口是6379，是由手机键盘字母MERZ的位置决定的。MERZ在Antirez的朋友圈语言中是"愚蠢和傻B"的代名词，
源于意大利广告女郎Alessia Merz在电视节目上说了一堆愚蠢的话，redis之父对她有"特殊"印象，就给她弄成端口号了
:::

ping
查看结果  

后台启动的redis要如何关闭呢？有以下两种方式
* 单实例关闭：在Redis服务器外面关闭命令：redis-cli -a 123456 shutdown，如果在Redis服务器里面可以直接使用shutdown命令
* 多实例关闭，指定端口关闭：redis-cli -p 6379 shutdown

### 2、window版本下载
Redis 官方不建议在 windows 下使用 Redis，所以官网没有 windows 版本可以下载，但是我们可以找到github上维护了开源的 windows 版本，如：
[https://github.com/tporadowski/redis/releases](https://github.com/tporadowski/redis/releases)  
下载之后解压即可  
![安装](https://codelearning-9gtr246hb9b78416-1316243198.ap-shanghai.app.tcloudbase.com/pic/redis/azwin.png)  
双击 redis-server.exe 启动redis服务，然后通过客户端去访问  
上面存在得问题，每次都要打开redis启动服务cmd窗口才能运行。 解决方法：安装成Windows服务—开机自启，打开cmd窗口，切换到redis目录，执行命令
```shell
redis-server --service-install redis.windows.conf
```
打开cmd窗口输入services.msc，自行开启redis服务器即可  
![安装](https://codelearning-9gtr246hb9b78416-1316243198.ap-shanghai.app.tcloudbase.com/pic/redis/azwin2.png) 

### 3、卸载
1.停止redis-server服务
2.删除/usr/local/bin目录下与redis相关的文件
```shell
ls -l /usr/local/bin/redis-*
rm -rf /usr/local/bin/redis-*
```

## 四、推荐几个好用的redis可视化工具
[参考地址](https://blog.csdn.net/qq_34491508/article/details/125868365)