---
title: 48个关键字及2个保留字
headerDepth: 4
order: 2
---

## 48个关键字
| 访问控制 | 类、接口、方法、变量、代码块修饰符 | 程序控制 | 错误处理 | 基本类型 | 变量引用 | 包相关 | 保留字 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| private | class | for | try | boolean | new | import | goto |
| protected | abstract | break | catch | byte | super | package | const |
| default (缺省) | extends | continue | finally | char | this |  |  |
| public | implements | do | throw | short | void |  |  |
|  | interface | while | throws | int | null |  |  |
|  | final | if |  | long | true |  |  |
|  | strictfp | else |  | float | false |  |  |
|  | static | switch |  | double |  |  |  |
|  | synchronized | case |  |  |  |  |  |
|  | transient | default |  |  |  |  |  |
|  | volatile | instanceof |  |  |  |  |  |
|  | native | return |  | | | | |
|  | enum |  | | | | | |


### 访问控制
✅表示可以访问 ❌表示不能访问

| 作用域             | 当前类 | 当前包 | 子类 | 其他包 |
|-----------------| --- | --- | --- | --- |
| private(私有化)    | ✅ | ❌ | ❌ | ❌ |
| default(缺省)     | ✅ | ✅ | ❌ | ❌ |
| protected(受保护的) | ✅ | ✅ | ✅ | ❌ |
| public(公共的)        | ✅ | ✅ | ✅ | ✅ |


+ private：private关键字是访问控制修饰符，可以应用于内部类、方法或类的变量字段。只能在声明 private（内部）类、方法或字段的类中引用这些类、方法或字段。在类的外部或者对于子类而言，它们是不可见的。
+ default：default关键字是可以应用于类、方法或类的变量字段的访问控制修饰符。当没有指定类的访问权限的时候，虚拟机就会默认的形式给类划定界限！默认修饰的类无法被其他包的类继承！
+ protected：protected关键字是可以应用于内部类、方法或类的变量字段的访问控制修饰符。可以在声明 protected 类、方法或字段的类、同一个包中的其他任何类以及任何子类（无论子类是在哪个包中声明的）中引用这些类、方法或字段。
+ public：public关键字是可以应用于类、方法或类的变量字段的访问控制修饰符。可以在其他任何类或包中引用 public 类、方法或字段。

### 类、接口、方法修饰符
| 关键字 | 名称 | 作用域 |
| --- | --- | --- |
| class | 类 | 声明一个类 |
| abstract | 抽象 | 用来定义抽象类和抽象方法 |
| extends | 继承 | 用在类或接口声明中，一个类只能继承一个父类，一个接口可以继承多个接口 |
| implements | 实现 | 在类声明中使用，实现某接口，一个类可以实现多个接口 |
| interface | 接口 | 声明一个接口 |
| final | 不可改变 | 用来修饰类、方法和变量(包括成员变量和局部变量) |
| strictfp | 严格，精准 | 可以将一个类、接口以及方法声明为`strictfp` |
| static | 静态 | 可以用于修饰属性，可以修饰代码块，也可以用于修饰方法，还可以用于修饰类 |
| synchronized | 线程锁 | 可以应用于方法或语句块 |
| transient | 短暂 | 可以应用于类的成员变量，以便指出该成员变量不应在包含它的类实例已序列化时被序列化 |
| volatile | 易失 | 用于表示可以被多个线程异步修改的成员变量 |
| native | 本地 | 可以应用于方法，以指示该方法是用Java以外的语言实现的 |
| enum | 枚举 | 声明一个枚举，一般用子静态数据字典 |


### 程序控制
+ if： 用于指定条件，如果条件为真，则执行对应代码。
+ else： 用于指示 if 语句中的备用分支。
+ for：用于声明一个 for 循环，如果循环次数是固定的，建议使用 for 循环
+ do：通常和 while 关键字配合使用，do 后紧跟循环体
+ while：如果循环次数不固定，建议使用 while 循环
+ switch： 用于根据某个变量的值选择执行不同的代码块。通常与 case 和 default 一起使用
+ case:  通常与 switch 语句一起使用。switch 语句允许根据某个变量的值来选择执行不同的代码块。在 switch 语句中，case 用于标识每个可能的值和对应的代码块。
+ break：用于跳出循环结构（如 for、while 和 do-while 循环）或 switch 语句。当遇到 break 语句时，程序将立即跳出当前循环或 switch 语句，继续执行紧跟在循环或 switch 语句后面的代码。
+ default：用于指定 switch 语句中除去 case 条件之外的默认代码块
+ continue：用于继续下一个循环，可以在指定条件下跳过其余代码
+ return：用于从方法中返回一个值或终止方法的执行
+ instanceof：用于判断某个对象是否属于某个类型

### 错误处理
+ catch：在 try 块中可能会抛出异常，而在 catch 块中可以捕获这些异常并进行处理。catch 块可以有多个，每个 catch 块可以捕获特定类型的异常。在 catch 块中，可以根据需要进行异常处理，例如输出错误信息、进行日志记录、恢复程序状态等
+ try：用于包裹要捕获异常的代码块
+ finally：和 try-catch 配合使用，表示无论是否处理异常，总是执行 finally 块中的代码
+ throw：主动抛出异常
+ throws：用于声明异常

### 基本数据类型
| 关键字 | 类型 | 大小/位 | 默认值 | 可表示数据范围 |
| --- | --- | --- | --- | --- |
| boolean | 布尔型 | 8 | false | true或false |
| byte | 字节型 | 8 | 0 | -128~127 |
| char | 字符型 | 16 | 空 | 0~65535 |
| short | 短整型 | 16 | 0 | -32768~32767 |
| int | 整型 | 32 | 0 | -2147483648~2147483647 |
| long | 长整型 | 64 | 0L | -9223372036854775808~9223372036854775807 |
| float | 浮点 | 32 | 0F | 1.4E-45~3.4028235E38 |
| double | 双精度 | 64 | 0D | 4.9E-324~1.7976931348623157E308 |


### 变量引用
| 关键字 | 作用 |
| :--- | :--- |
| new | 用于实例化一个对象 |
| super | 父类，超类 |
| this | 当前对象 |
| void | 无返回值，用于方法返回类型上 |
| null | 什么都没有，用于参数返回，或者变量定义 |
| true | 布尔类型的值，true |
| false | 布尔类型的值，false |


### 包相关
package：用于声明类所在的包 

import：用于导入对应的类或者接口

## 2个保留字
goto：goto 在 C语言中叫做‘无限跳转’语句，在 Java 中，不再使用 goto 语句，因为无限跳转会破坏程序结构。可以使用使用 if 和 for 语句替代

const：const 在 c 中是声明常量的关键字，在 Java 中可以使用 public static final 三个关键字的组合来达到常量的效果

