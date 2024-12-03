---
title: redis7新特性概述
breadcrumb: false
headerDepth: 4
pageInfo: false
order: 2
---

## 一、redis历史版本
如下图是redis历史版本   
![版本](https://codelearning-9gtr246hb9b78416-1316243198.ap-shanghai.app.tcloudbase.com/pic/redis/bb.png)  
5.0版本是直接升级到6.0版本，对于这个激进的升级，Redis之父antirez表现得很有信心和兴奋，
所以第一时间在他的个人博客发文来阐述6.0的一些重大功能"Redis 6.0.0 GA is out!"  

2022年4月27日Redis正式发布了7.0更新
(其实早在2022年1月31日，Redis已经预发布了7.0rc-1，近过社区的考验后，确认没有重大Bug才会正式发布)

Redis从发布至今，已经有十余年的时光了，一直遵循着自己的命名规则:
1. 版本号第二位如果是奇数，则为非稳定版本，如2.7、2.9、3.1
2. 版本号第二位如果是偶数，则为稳定版，如、、
3. 当前奇数版本就是下一个稳定版本的开发版，如2.9版本就是3.0版本的开发版本
4. 我们可以通过redis.io官网来下载自己感兴趣的版本进行源码阅读
5. 历史发布版本的源码：https://download.redis.io/releases/
## 二、redis7新特性概述
通过github仓库可以看到redis7更新的新特性  
[redis7新特性](https://github.com/redis/redis/releases)  
2022年4月正式发布的Redis7.0是目前Redis历史版本中变化最大的版本。首先它有超过50个以上的新增命令，其次，它有大量核心特性的新增和改进。
* 特性1、Redis Functions  
![Redis Functions](https://codelearning-9gtr246hb9b78416-1316243198.ap-shanghai.app.tcloudbase.com/pic/redis/tx1.png)  

Redis函数，一种新的通过服务端脚本扩展Redis的方式，函数与数据本身一起存储。简言之，redis自己要去抢夺Lua脚本的饭碗
* 特性2、Client-eviction  
![Client-eviction](https://codelearning-9gtr246hb9b78416-1316243198.ap-shanghai.app.tcloudbase.com/pic/redis/tx2.png)    
一旦 Redis 连接较多，再加上每个连接的内存占用都比较大的时候， Redis总连接内存占用可能会达到maxmemory的上限，可以增加允许限制所有客户端的总内存使用量配置项，redis.config 中对应的配置项   
//两种配置形式:指定内存大小、基于 maxmemory 的百分比。
```shell
  maxmemory-client 1g
  maxmemory-client 10%
```
* 特性3、Multi-part AOF  
![Client-eviction](https://codelearning-9gtr246hb9b78416-1316243198.ap-shanghai.app.tcloudbase.com/pic/redis/tx3.png)  
7.0 版本中一个比较大的变化就是 aof 文件由一个变成了多个，主要分为两种类型:基本文件(base files)、增量文件(incr files)，请注意这些文件名称是复数形式说明每一类文件不仅仅只有一个。
在此之外还引入了一个清单文件(manifest) 用于跟踪文件以及文件的创建和应用顺序(恢复)

* 特性4、访问安全性增强 ACL V2  
![Client-eviction](https://codelearning-9gtr246hb9b78416-1316243198.ap-shanghai.app.tcloudbase.com/pic/redis/tx4.png)  
  在redis.conf配置文件中protected-mode默认为yes，只有当你希望你的客户端在没有授权的情况下可以连接到Redis server的时候可以将protect-mode设置为no
* 特性5、新增命令  
Zset (有序集合)增加 ZMPOP、BZMPOP、ZINTERCARD 等命令  
Set (集合)增加 SINTERCARD 命令  
LIST(列表)增加 LMPOP、BLMPOP ，从提供的键名列表中的第一个非空列表键中弹出一个或多个元素。  

* 特性6、listpack替代ziplist  
listpack 是用来替代 ziplist 的新数据结构，在 7.0 版本已经没有 ziplist 的配置了 (6.0版本仅部分数据类型作为过渡阶段在使用）
listpack已经替换了ziplist类似hash-max-ziplist-entries 的配置

* 特性7、config命令增强  
对于Config Set 和Get命令，支持在一次调用过程中传递多个配置参数。例如，现在我们可以在执行一次Config Set命今中更改多个参数: config set maxmemory 10000001 maxmemory-clients 50% port 6399

* 特性8、RDB保存时间调整  
将持久化文件RDB的保存规则发生了改变，尤其是时间记录频度变化

* 特性9、底层性能以及资源利用率提升  
-- 自身底层部分优化改动，Redis核心在许多方面进行了重构和改进主动碎片整理，更快更智能，延时更低  
-- 集群模式下显著节省内存和延迟 
-- 如果有多个哈希或set键，则可以显著节省内  
-- 复制积压工作和副本使用一个全局共享复制缓冲区  
-- 显著降低了写入时拷贝内存开销  
-- 释放集群发送缓冲区中未使用的容量  
-- 内存效率，充分利用客户端结构内存作为应答缓冲区  
-- 添加对列表类型的支持，以存储大于4GB的元素  
-- 按模块为被阻止的客户端重用临时客户端对象  
-- 优化列表类型操作以从最近的一端搜索  
-- 删除命令参数计数限制，动态增长argv缓冲区  

* 特性10、HyperLogLog改进  
HyperLogLog改进:在Redis5.0中，HyperLogLog算法得到改进，优化了计数统计时的内存使用效率，7更加优秀更好的内存统计报告


**总结**  
大体和之前的redis版本保持一致和稳定，主要是自身底层性能和资源利用率上的优化和提高，
如果生产上系统稳定，不用着急升级到最新redis7版本，如果从零开始新系统，直接上redis7.0-GA版。