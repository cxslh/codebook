---
title: java如何写注释
headerDepth: 4
order: 3
---
java中有三种注释方式，分别是单行注释、多行注释和文档注释  
## 单行注释
单行注释通常用于解释方法内某单行代码的作用，另起一行写在被注释语句上方，使用 // 注释，也可以写在行尾，但是不符合阿里巴巴的开发规约
```java
public void method() {
    // age 用于表示年龄
    int age = 18;
}
```
## 多行注释
多行注释通常用于解释一段代码的作用,使用/* */注释
```java
/*
age 用于表示年纪
name 用于表示姓名
*/
int age = 18;
String name = "test";
```
## 文档注释
文档注释可用在三个地方，类、字段和方法，用来解释它们是干嘛的，使用/** */注释
```java
/**
 * 文档注释演示
 */
public class Demo {
    /**
     * 姓名
     */
    private int age;

    /**
     * main 方法作为程序的入口
     *
     * @param args 参数
     */
    public static void main(String[] args) {

    }
}
```