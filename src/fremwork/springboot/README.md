---
title: Springboot概述
headerDepth: 4
order: 2
category:
  - springboot
---

## 一、什么是springboot
Springboot是Spring开源组织下的子项目，是Spring组件一站式解决方案，主要是简化了使用Spring的难度，简省了繁重的配置，提供了各种启动器，开发者能快速上手。

如今的java开发更加趋向

* Springboot用于解决javaEE一站式解决方案
* Springcloud用于分布式整体解决方案

目前Springboot官网已经更新值2.x，所以本系列文章也是基于最新版本想2.x来写的。  
springboot官方网站：[http://projects.spring.io/spring-boot/](http://projects.spring.io/spring-boot/)  
GitHub springboot源码地址 [https://github.com/spring-projects/spring-boot](https://github.com/spring-projects/spring-boot)

## 二、Springboot的优点
独立运行  
Spring Boot而且内嵌了各种servlet容器，Tomcat、Jetty等，现在不再需要打成war包部署到容器中，Spring Boot只要打成一个可执行的jar包就能独立运行，所有的依赖包都在一个jar包内。

简化配置  
spring-boot-starter-web启动器自动依赖其他组件，简少了maven的配置。

自动配置  
Spring Boot能根据当前类路径下的类、jar包来自动配置bean，如添加一个spring-boot-starter-web启动器就能拥有web的功能，无需其他配置。

无代码生成和XML配置  
Spring Boot配置过程中无代码生成，也无需XML配置文件就能完成所有配置工作，这一切都是借助于条件注解完成的，这也是Spring4.x的核心功能之一。

应用监控  
Spring Boot提供一系列端点可以监控服务及应用，做健康检测。

## 三、SpringBoot的缺点
Spring Boot虽然上手很容易，但如果你不了解其核心技术及流程，所以一旦遇到问题就很棘手，而且现在的解决方案也不是很多，需要一个完善的过程。

## 四、springboot学习地址
文档地址：

* [Spring Boot中文社区](https://springboot.io/)

* [Spring Boot 中文导航](http://springboot.fun/)

视频推荐：

* [尚硅谷SpringBoot3零基础教程](https://www.bilibili.com/video/BV1Es4y1q7Bf/?vd_source=f795d6b757455528005051cfa124da7f)

* [动力节点SpringBoot3从入门到项目实战](https://www.bilibili.com/video/BV1Km4y1k7bn)

## 五、idea创建springboot项目
由于springboot项目，不管是java工程还是web工程都可以直接以jar方式运行，所以推荐创建jar工程，这里创建jar工程项目为例。
有两种方式创建springboot项目 

第一种方式：
手动在idea中new一个新的项目,选择maven工程  
![完成的结构如图](https://codelearning-9gtr246hb9b78416-1316243198.tcloudbaseapp.com/pic/springboot/springbootgaishu1.png)  
![完成的结构如图](https://codelearning-9gtr246hb9b78416-1316243198.tcloudbaseapp.com/pic/springboot/springbootgaishu2.png)  
![完成的结构如图](https://codelearning-9gtr246hb9b78416-1316243198.tcloudbaseapp.com/pic/springboot/springbootgaishu3.png)   
项目创建完的结构如图  
![完成的结构如图](https://codelearning-9gtr246hb9b78416-1316243198.tcloudbaseapp.com/pic/springboot/springbootgaishu4.png)  
然后在pom文件继承spring-boot-starter-parent依赖接口完成创建
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http:
//maven.apache.org/xsd/maven-4.0.0.xsd">
<modelVersion>4.0.0</modelVersion>

    <groupId>com.javayihao.top</groupId>
    <artifactId>bootdemo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
        <version>2.1.5.RELEASE</version>
    </parent>
</project>
```
2.第二种方式：快捷方式创建Springboot项目(推荐)  
![快捷方式创建Springboot](https://codelearning-9gtr246hb9b78416-1316243198.tcloudbaseapp.com/pic/springboot/springbootgaishu5.png)  
![快捷方式创建Springboot](https://codelearning-9gtr246hb9b78416-1316243198.tcloudbaseapp.com/pic/springboot/springbootgaishu7.png)    
接着引入一些项目场景所涉及到的依赖statrter，也就是选择项目开发所用到的依赖。这里目前不选择，采取直接在pom文件使用手动导入的方式，完整的项目结构如图所示。
 
![快捷方式创建Springboot](https://codelearning-9gtr246hb9b78416-1316243198.tcloudbaseapp.com/pic/springboot/springbootgaishu8.png)  
这样就创建完成了  
![快捷方式创建Springboot](https://codelearning-9gtr246hb9b78416-1316243198.tcloudbaseapp.com/pic/springboot/springbootgaishu9.png)

运行项目，
接下来我们写一个简单的案例，浏览器返回字符串hello world，新建一个controller包，场景IndexController类，处理前端请求。
```java
@Controller
public class IndexController {
    @RequestMapping("/index")
    @ResponseBody
    public String index() {
        return "helloword!";
    }
}
```

启动入口类，查看控制台，可以看到在8080端口启动完成

通过浏览器访问

我们启动项目可以看到  
![启动项目](https://codelearning-9gtr246hb9b78416-1316243198.tcloudbaseapp.com/pic/springboot/springbootgaishu10.png)
如何修改上面展示的banner

首先打开网址  
[patorjk.com](http://patorjk.com/software/taag/#p=display&h=3&v=3#f=4Max&t=qf%20Sping%20Boor)  
然后copy生成的字符串到一个txt文件中，将其命名为banner.txt,将这个文件拷贝到resoures目录中即可  
![如何修改上面展示的banner](https://codelearning-9gtr246hb9b78416-1316243198.tcloudbaseapp.com/pic/springboot/springbootgaishu11.png)