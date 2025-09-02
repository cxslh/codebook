---
title: java中的VO、DAO、BO、PO、DO、DTO
headerDepth: 4
order: 17
---

## VO、DAO、BO 等对象
在了解这里 po、vo、dao、之前先介绍下 MVC 开发模式

+ M层负责与数据库打交道；
+ C层负责业务逻辑的编写；
+ V层负责给用户展示（针对于前后端不分离的项目，不分离项目那种编写模版的方式，理解V的概念更直观）。

而VO，BO，PO，DO，DTO呢，就是穿梭在这M、V、C层之间的实体传输对象

![](https://pic1.imgdb.cn/item/68b2f60d824db260b88a8dd6/1756558770.png)

阿里巴巴规范手册关于VO，BO，PO，DO，DTO这些的描述

**分层领域模型规约：**

+ DO(Data Object)：此对象与数据库表结构一一对应，通过 DAO 层向上传输数据源对象。
+ DTO(Data Transfer Object)：数据传输对象，Service 或 Manager 向外传输的对象。
+ BO(Business Object)：业务对象，由 Service 层输出的封装业务逻辑的对象。
+ AO(ApplicationObject)：应用对象，在Web层与Service层之间抽象的复用对象模型，极为贴近展示层，复用度不高。
+ VO(View Object)：显示层对象，通常是 Web 向模板渲染引擎层传输的对象。
+ Query：数据查询对象，各层接收上层的查询请求。注意超过 2 个参数的查询封装，禁止使用 Map 类来传输。

**领域模型命名规约：**

+ 数据对象：xxxDO，xxx即为数据表名
+ 数据传输对象：xxxDTO，xxx为业务领域相关的名称。
+ 展示对象：xxxVO，xxx一般为网页名称。
+ POJO是DO/DTO/BO/VO的统称，禁止命名成xxxPOJO。

## Pojo 和 javabean
POJO是 Plain Old Java Object 的简写，大概意思就是“淳朴的Java对象”。这个词是国外一家外包公司的员工创造的。哪些类是POJO类还是有说法的，需要同时满足以下几个条件：

1. 不实现任何接口的类。

2. 不继承任何其它类的类。

3. 不使用任何外部注解的类。

这种类其实就是切断了和外界联系的Java类，下面这个类肯定不是：

```xml
@Data
public class Dog {
	private String name;
	private Integer age;
}
```

这个类才是

```xml
public class Dog {
	private String name;
	private Integer age;
}
```

Java Bean也经常出现在各种技术文献中，也不是随便什么类都能叫做Java Bean的，它需要有以下定义：

● 有无参数构造。

● 所有的属性必须是私有属性（private）。

● 所有的属性必须有公共的（public）的Getter和Setter。

● 它必须是可以被序列化的，也就是实现 java.io.Serializable接口。

按照这个定义，POJO类如果想成为Java Bean，需要改造成下面的形式

```java
import java.io.Serializable;

public class Dog implements Serializable {
    private static final long serialVersionUID = 6723564465081191620L;
    private String name;
    private Integer age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}
```

其实在Spring 中对于 Bean的要求就低多了，只要这个类（接口）被注入了Spring IoC，那么这个类（接口）都可以被称作一个Spring Bean。所以一个POJO总是孤孤单单的，它不可能成为一个Java Bean或者Spring Bean，但是Java Bean可以同时是一个Spring Bean；Spring Bean也可以是一个Java Bean

## 项目中真的有必要定义VO，BO，PO，DO，DTO吗？
还是要理性看待这个问题，要看项目“目的地”是什么。

如果项目比较小，是一个简单的MVC项目，又是单兵作战，不建议使用VO，BO，PO，DO，DTO，直接用POJO负责各个层来传输就好，因为这种项目的“目的地”是快速完成。

而更多的时候，是持续迭代的团队协作项目，这个时候就建议用VO，BO，PO，DO，DTO，而且团队内要达成共识，形成一个标准规范。

不管用哪种方式，只要团队内定义好一种适应的协同规范就行。没有一个绝对好与绝对坏的方式方法，团队规范的尽头能提升项目的可扩展性、可维护性与可阅读性，从而降低bug率。

