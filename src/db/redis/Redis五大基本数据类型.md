---
title: Redis数据类型
breadcrumb: false
headerDepth: 4
pageInfo: false
order: 3
---

## 一、概述
首先对redis来说，所有的key（键）都是字符串。我们在谈基础数据结构时，
讨论的是存储值的数据类型，主要包括常见的5种数据类型，分别是：String、List、Set、Zset、Hash，还有其他几种特殊数据类型  
具体可参考官网文档地址：[https://redis.io/docs/data-types/](https://redis.io/docs/data-types/)

## 二、redis key（键）操作
正如概述所说，首先对redis来说，所有的key（键）都是字符串，下面就来学习一下有哪些key操作
* 查看所有key
```shell
127.0.0.1:6379> keys *
1) "1"
2) "a"
```
::: info
对于keys *命令，生产慎用，因为KEYS进行key查询需要遍历当前db的所有数据，以及当该命令执行完成的时候后续命令都会被堵塞。
因此在redis中执行的命令，尽量避免长时间堵塞命令。建议使用Scan代替 keys 
:::

* 判断某个key是否存在
```shell
127.0.0.1:6379> exists a
(integer) 1
127.0.0.1:6379> exists b
(integer) 0
```
存在key返回1 不存返回0
* type key 查看你的key是什么类型
```shell
127.0.0.1:6379> type a
string
```
* del key 删除指定的key数据
```shell
127.0.0.1:6379> del 1
(integer) 1
127.0.0.1:6379> del xxx
(integer) 0
```
删除成功返回1 删除不存在的key返回0
::: info
del key 是原子的删除，只有删除成功了才会返回删除结果，
如果是删除大key用del会将后面的操作都阻塞，可以使用 unlink key非阻塞删除，仅仅将keys从keyspace元数据中删除，真正的删除会在后续异步中操作
:::
* ttl key 查看还有多少秒过期，-1表示永不过期，-2表示已过期
```shell
127.0.0.1:6379> ttl a
(integer) -1
```

* expire key 秒钟 为给定的key设置过期时间,如下设置5秒过期
```shell
127.0.0.1:6379> expire a 5
(integer) 0
```

* move key dbindex[0-15] 将当前数据库的key移动到给定的数据库DB当中
```shell
127.0.0.1:6379> move a 2
(integer) 1
127.0.0.1:6379> keys *
(empty list or set)
127.0.0.1:6379> select 2
OK
127.0.0.1:6379[2]> keys *
1) "a"
```
将a移动到3库了

* select dbindex 
切换数据库【0-15】，默认为0
* dbsize
  查看当前数据库key的数量
* flushdb
  清空当前库
* flushall
  通杀全部库

::: info
以上就是所有常用的key操作命令 ,在redis中,命令是不区分大小写的，而key是区分大小写的
:::

下面分别介绍5种基本数据类型:String、List、Set、Zset、Hash，每种数据类型命令比较多，记不住的话可以使用help命令，比如
```shell
127.0.0.1:6379[2]> help @string

  APPEND key value
  summary: Append a value to a key
  since: 2.0.0

  BITCOUNT key [start end]
  summary: Count set bits in a string
  since: 2.6.0

  BITFIELD key [GET type offset] [SET type offset value] [INCRBY type offset increment] [OVERFLOW WRAP|SAT|FAIL]
  summary: Perform arbitrary bitfield integer operations on strings
  since: 3.2.0

  BITOP operation destkey key [key ...]
  summary: Perform bitwise operations between strings
  since: 2.6.0

  BITPOS key bit [start] [end]
  summary: Find first bit set or clear in a string
  since: 2.8.7

  DECR key
  summary: Decrement the integer value of a key by one
  since: 1.0.0

  DECRBY key decrement
  summary: Decrement the integer value of a key by the given number
  since: 1.0.0

  GET key
  summary: Get the value of a key
  since: 1.0.0

  GETBIT key offset
  summary: Returns the bit value at offset in the string value stored at key
  since: 2.2.0

  GETRANGE key start end
  summary: Get a substring of the string stored at a key
  since: 2.4.0

  GETSET key value
  summary: Set the string value of a key and return its old value
  since: 1.0.0

  INCR key
  summary: Increment the integer value of a key by one
  since: 1.0.0
```
## 三、字符串(String)
### 1、介绍
String是redis最基本的数据类型，一个key对应一个value。 并且类型是二进制安全的，意思是redis的string可以包含任何数据，比如jpg图片或者序列化的对象。
但是一个redis中字符串value最多可以是512M
### 2、命令
* 数值增减
一定要是数据才能进行加减
递增数字：INCR key
增加指定的整数：INCRBY key increment
递减数值：DECR key
减少指定的整数：DECRBY key decrement

* 分布式锁
setnx key value
setex(set with expire)键秒值/setnx(set if not exist)

* 获取字符串长度和内容追加
获取字符串长度：strlen key
字符串内容追加：append key value

* getset(先get再set)
getset：将给定key的值设为value，并返回key的旧值(old value)。 简单一句话：先get然后立即set
```shell
127.0.0.1:6379[2]> getset aaa bbb
"ccc"
```

### 3、内部实现

### 4、应用场景

## 四、列表（List）
Redis列表是最简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边），它的底层实际是个双端链表，最多可以包含2^32-1个元素（4294967295，每个列表超过40亿个元素）

## 五、哈希表（Hash）
Redis Hash是一个string类型的field（字段）和value（值）的映射表，Hash特别适合用户存储对象。
Redis中每个Hash可以存储2^32-1个键值对（40多亿）

## 六、集合（Set）
Redis的Set是string类型的无序集合。集合成员是唯一的，这就意味着集合中不能出现重复的数据，集合对象的编码可以是intset或者Hashtable。
Redis中Set集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是O(1)。 集合中最大的成员数为2^32-1（4294967295，每个集合可存储40多亿个成员）

## 七、有序集合（ZSet）
zset(sorted set：有序集合),和Set一样也是string类型元素的集合，且不允许重复的成员。
不同的是每个元素都会关联一个double类型的分数,redis正是通过分数来为集合中的成员进行从小到大的排序。
zset的成员是唯一的，但是分数（score）却可以重复。
zset集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是O(1)。集合中最大的成员数是2^.32-1

