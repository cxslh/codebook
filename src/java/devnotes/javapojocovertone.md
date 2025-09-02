---
title: Java Pojo之间的转换(1)
headerDepth: 4
order: 20
---
日常编程中，经常会碰到对象属性复制的场景，比如  VO、DTO、PO、VO 等之间的转换，关于什么是VO、DTO、PO、VO 等可以看上篇文章，VO、DTO、PO、VO 等对象具体有哪些方式可以使用呢？

## set/get 方式
性能最好的方式，但是当类的属性数量只有简单的几个，通过手写set/get即可完成，但是属性有十几个，甚至几十个的时候，通过set/get的方式，可能会占用大量的编程时间，关键是像这样的代码，基本上是机械式的操作。面对这种重复又枯燥的编程工作，可以使用一些通用的对象属性复制工具，常用的有如下几种

## ApacheBeanUtils
Apache 提供的一个用于 bean 拷贝的工具，早期使用的非常广泛，使用上也非常简单，首先项目中导入 apache beanutils 包，如下

```plain
<!--Apache BeanUtils-->
<dependency>
  <groupId>commons-beanutils</groupId>
  <artifactId>commons-beanutils</artifactId>
  <version>1.9.4</version>
</dependency>
```

然后直接使用工具类即可，如下

```plain
// 原始对象
UserInfo source = new UserInfo();
// set...

// 目标对象
UserInfo target = new UserInfo();
BeanUtils.copyProperties(target, source);
System.out.println(target.toString());
```

Apache BeanUtils 工具从操作使用上还是非常方便的，不过其底层源码为了追求完美，加了过多的包装，使用了很多反射，做了很多校验，导致属性复制时性能较差，因此阿里巴巴开发手册上强制规定避免使用 Apache BeanUtils

## SpringBeanUtils
spring 提供的一个 bean 转换工具，首先项目中导入依赖

```plain
<!--spring BeanUtils-->
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-beans</artifactId>
  <version>4.3.30.RELEASE</version>
</dependency>
```

在代码中直接导入org.springframework.beans.BeanUtils工具进行对象属性复制

```java
/**
 * 对象属性拷贝 <br>
 * 将源对象的属性拷贝到目标对象
 *
 * @param source 源对象
 * @param target 目标对象
 */
public static void copyProperties(Object source, Object target) {
    try {
        BeanUtils.copyProperties(source, target);
    } catch (BeansException e) {
        LOGGER.error("BeanUtil property copy  failed :BeansException", e);
    } catch (Exception e) {
        LOGGER.error("BeanUtil property copy failed:Exception", e);
    }
}
```

初次之外，spring BeanUtils 还提供了重载方法

```plain
public static void copyProperties(Object source, Object target, String... ignoreProperties);
```

如果不想某些属性复制过去，可以使用如下方式实现

```plain
BeanUtils.copyProperties(source, target, "userPwd");
```

也可以实现 List 集合之间的对象属性赋值

```java
/**
 * @param input 输入集合
 * @param clzz  输出集合类型
 * @param <E>   输入集合类型
 * @param <T>   输出集合类型
 * @return 返回集合
 */
public static <E, T> List<T> convertList2List(List<E> input, Class<T> clzz) {
    List<T> output = Lists.newArrayList();
    if (CollectionUtils.isNotEmpty(input)) {
        for (E source : input) {
            T target = BeanUtils.instantiate(clzz);
            BeanUtil.copyProperties(source, target);
            output.add(target);
        }
    }
    return output;
}

@RunWith(PowerMockRunner.class)
public class TestUtil
{
    @Test
    public void test(){
        Employee ee1=new Employee("A",33,"abc");
        Employee ee2=new Employee("B",44,"abcd");
        User user=new User();
        BeanUtil.copyProperties(ee1, user);
        System.out.println(user);
       
        List<User> output=new ArrayList<>();
        List<Employee> source= Arrays.asList(ee1,ee2);
        output=BeanUtil.convertList2List(source,User.class);
        for (User str:output) {
            System.out.println(str);
        }
    }
}
```

虽然Apache BeanUtils和Spring BeanUtils使用起来都很方便，但是两者性能差异非常大，Spring BeanUtils的对象属性复制速度比Apache BeanUtils要快很多，主要原因在于 Spring 并没有像 Apache 一样使用反射做过多的参数校验，Spring BeanUtils的实现原理也比较简答，就是通过Java的Introspector获取到两个类的PropertyDescriptor，对比两个属性具有相同的名字和类型，如果是，则进行赋值（通过ReadMethod获取值，通过WriteMethod赋值），否则忽略。为了提高性能Spring对BeanInfo和PropertyDescriptor进行了缓存，源码如下（4.3.9 版本）

```java
/**  
  * Copy the property values of the given source bean into the given target bean.  
  * <p>Note: The source and target classes do not have to match or even be derived  
  * from each other, as long as the properties match. Any bean properties that the  
  * source bean exposes but the target bean does not will silently be ignored.  
  * @param source the source bean  
  * @param target the target bean  
  * @param editable the class (or interface) to restrict property setting to  
  * @param ignoreProperties array of property names to ignore  
  * @throws BeansException if the copying failed  
  * @see BeanWrapper  
  */  
private static void copyProperties(Object source, Object target, Class<?> editable, String... ignoreProperties)  
throws BeansException {  

    Assert.notNull(source, "Source must not be null");  
    Assert.notNull(target, "Target must not be null");  

    Class<?> actualEditable = target.getClass();  
    if (editable != null) {  
        if (!editable.isInstance(target)) {  
            throw new IllegalArgumentException("Target class [" + target.getClass().getName() +  
                                               "] not assignable to Editable class [" + editable.getName() + "]");  
        }  
        actualEditable = editable;  
    }  
    //获取target类的属性（有缓存）  
    PropertyDescriptor[] targetPds = getPropertyDescriptors(actualEditable);  
    List<String> ignoreList = (ignoreProperties != null ? Arrays.asList(ignoreProperties) : null);  

    for (PropertyDescriptor targetPd : targetPds) {  
        Method writeMethod = targetPd.getWriteMethod();  
        if (writeMethod != null && (ignoreList == null || !ignoreList.contains(targetPd.getName()))) {  
            //获取source类的属性（有缓存）  
            PropertyDescriptor sourcePd = getPropertyDescriptor(source.getClass(), targetPd.getName());  
            if (sourcePd != null) {  
                Method readMethod = sourcePd.getReadMethod();  
                if (readMethod != null &&  
                    //判断target的setter方法入参和source的getter方法返回类型是否一致  
                    ClassUtils.isAssignable(writeMethod.getParameterTypes()[0], readMethod.getReturnType())) {  
                    try {  
                        if (!Modifier.isPublic(readMethod.getDeclaringClass().getModifiers())) {  
                            readMethod.setAccessible(true);  
                        }  
                        //获取源值  
                        Object value = readMethod.invoke(source);  
                        if (!Modifier.isPublic(writeMethod.getDeclaringClass().getModifiers())) {  
                            writeMethod.setAccessible(true);  
                        }  
                        //赋值到target  
                        writeMethod.invoke(target, value);  
                    }  
                    catch (Throwable ex) {  
                        throw new FatalBeanException(  
                            "Could not copy property '" + targetPd.getName() + "' from source to target", ex);  
                    }  
                }  
            }  
        }  
    }  
}  
```

还有一个需要注意的地方是，Apache BeanUtils和Spring BeanUtils的类名和方法基本上相同，但是它们的原始对象和目标对象的参数位置是相反的，如果直接从Apache BeanUtils切换到Spring BeanUtils有巨大的风险

虽然使用起来很方便，但是有几个坑得注意

1、类型不匹配

```java
@Data
public class SourceBean {
    private Long age;
}

@Data
public class TargetBean {
    private String age;
}

public class Test {

    public static void main(String[] args) {
        SourceBean source = new SourceBean();
        source.setAge(25L);

        TargetBean target = new TargetBean();
        BeanUtils.copyProperties(source, target);

        System.out.println(target.getAge());  //拷贝赋值失败，输出null
    }
}
```

2、是浅拷贝

什么是深拷贝？什么是浅拷贝？

● 浅拷贝是指创建一个新对象，该对象的属性值与原始对象相同，但对于引用类型的属性，仍然共享相同的引用。换句话说，浅拷贝只复制对象及其引用，而不复制引用指向的对象本身。

● 深拷贝是指创建一个新对象，该对象的属性值与原始对象相同，包括引用类型的属性。深拷贝会递归复制引用对象，创建全新的对象，以确保拷贝后的对象与原始对象完全独立

```java
public class Address {
    private String city;
    //getter 和 setter 方法省略
}

public class Person {
    private String name;
    private Address address;
    //getter 和 setter 方法省略
}

Person sourcePerson = new Person();
sourcePerson.setName("John");
Address address = new Address();
address.setCity("New York");
sourcePerson.setAddress(address);

Person targetPerson = new Person();
BeanUtils.copyProperties(sourcePerson, targetPerson);

sourcePerson.getAddress().setCity("London");

System.out.println(targetPerson.getAddress().getCity());  // 输出为 "London"
```

3、属性名称不一致

```java
public class SourceBean {
    private String username;

    // getter 和 setter 方法省略
}

public class TargetBean {
    private String userName;
    // getter 和 setter 方法省略
}

SourceBean source = new SourceBean();
source.setUsername("男孩");

TargetBean target = new TargetBean();
BeanUtils.copyProperties(source, target);

System.out.println(target.getUserName());   // 输出为 null
```

4、null 覆盖



## Hutool BeanUtil
hutool是平常使用比较频繁的一个工具包，对文件、加密解密、转码、正则、线程、XML等JDK方法进行封装，并且也可以进行对象的拷贝。在使用前引入坐标：

```plain
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.1.0</version>
</dependency>
```

使用方式

```plain
BeanUtil.copyProperties(UserPo,UserDto);
```

也可以忽略指定的属性

```plain
void copyProperties(Object source, Object target, String... ignoreProperties);
```

除此之外，hutool的BeanUtil还提供了很多其他实用的方法

## Cglib BeanCopier
Cglib BeanCopier 对象属性复制工具，首先项目中导入 cglib 包

```plain
<!--cglib-->
<dependency>
  <groupId>cglib</groupId>
  <artifactId>cglib</artifactId>
  <version>3.3.0</version>
</dependency>
```

然后在代码中直接导入net.sf.cglib.beans.BeanCopier工具进行对象属性复制，样例代码如下：

```plain
// 原始对象
UserInfo source = new UserInfo();
// set...

// 获取一个复制工具
BeanCopier beanCopier = BeanCopier.create(UserInfo.class, UserInfo.class, false);

// 对象属性值复制
UserInfo target = new UserInfo();
beanCopier.copy(source, target, null);
System.out.println(target.toString());
```

如果遇到字段名相同，但是类型不一致的对象复制，可以引入转换器，进行类型转换，比如这样：

```plain
UserInfo source = new UserInfo();
// set...

// 创建一个复制工具
BeanCopier beanCopier = BeanCopier.create(UserInfo.class, UserInfo.class, true);

// 自定义对象属性值复制
UserInfo target = new UserInfo();
beanCopier.copy(source, target, new Converter() {
    @Override
    public Object convert(Object source, Class target, Object context) {
        if(source instanceof Integer){
            return String.valueOf(source);
        }
        return source;
    }
});
System.out.println(target.toString());
```

Cglib BeanCopier 的工作原理与 apache Beanutils 和 spring beanutils 原理不太一样，其主要使用字节码技术动态生成一个代理类，通过代理类来实现get/set方法。

虽然生成代理类过程存在一定开销，但是一旦生成可以重复使用，因此 Cglib  性能相比以上两种 Beanutils 性能都要好。另外就是，如果工程是基于 Spring 框架开发的，查找 BeanCopier 这个类的时候，可以发现两个不同的包，一个属于Cglib，另一个属于Spring-Core。

其实Spring-Core内置的BeanCopier引入了 Cglib 中的类，这么做的目的是为保证 Spring 中使用 Cglib 相关类的稳定性，防止外部 Cglib 依赖不一致，导致 Spring 运行异常，因此无论你引用那个包，本质都是使用 Cglib

## MapStuct
MapStruct官网：[https://mapstruct.org/](https://mapstruct.org/)

MapStruct官网示例：[https://github.com/mapstruct/mapstruct-examples](https://github.com/mapstruct/mapstruct-examples)

MapStruct 也是一款对象属性复制的工具，但是它跟上面介绍的几款工具技术实现思路都不一样，主要区别在于无论是Beanutils还是BeanCopier，都是程序运行期间去执行对象属性复制操作。而MapStruct是在程序编译期间，就已经生成好了对象属性复制相关的逻辑。因此可以想象的到，MapStruct的复制性能要快很多！MapStruct工具的使用参考第二篇文章

## 总结
几种方式性能测试对比

![](https://pic1.imgdb.cn/item/68b312c9824db260b88bd157/1756566200.png)



以上几种对象属性复制的方式

1. 如果当前类只有简单的几个属性，建议直接使用set/get，原生编程性能最好
2. 如果类属性很多，可以使用Spring BeanUtils或者Cglib BeanCopier工具，可以省下很多的机械式编程工作
3. 如果当前类属性很多，同时对复制性能有要求，推荐使用MapStruct

最后，以上的对象属性复制工具都是浅拷贝的实现方式，如果要深拷贝，可以使用对象序列户和反序列化技术实现！ 

