---
title: 序列化(1)
headerDepth: 4
order: 15
---

## 什么是序列化/反序列化？
计算机中最基本的存储单位是字节 Byte, 任何数据最终都会被编码成字节序列，1byte=8bit, 一个字节等于八位，每一位都是用0 和 1 组成。在内存中，数据就是以 0 和 1 组成的二进制形式存储的，而字节数据在传输（如网络传输）或读写（如文件操作、数据库操作）时，通常以 "流"（的形式处理（即按顺序逐个字节传输 / 读写），这个流称为二进制流 (注: IO 支持的数据格式就是字节数组)。

我们平时写程序的时侯，如果要把运行中的 java 对象保存到数据库、文件或者通过网络传输，就需要把这些对象转成字节数据格式（少数情况是文本格式，如 JSON，但文本最终也会被编码为字节），再进行存储或者传输。这个转化过程就是序列化，序列化出来的是一个二进制内容，就是对象在内存中的存储形式。相反，把从文件、数据库读取到的字节数据或者从网络接收的字节数据还原成 java 对象的过程称为反序列化。

总结：

● 序列化：把对象转换为字节序列的过程称为对象的序列化。

● 反序列化：把字节序列恢复为对象的过程称为对象的反序列化

它们通过字节数据（二进制流）实现了对象在内存、存储、网络之间的 "穿梭"，是现代编程中数据交互的基础能力。

## 为什么要序列化反序列化？
平时如果只在本地 jvm 运行 java 实列，这个时候是不需要什么序列化和反序列化的，只要当内存中的对象持久化到文件、数据库或者要网络传输交互的时候，这个时候就需要序列化和反序列了。因为网络传输的对象二进制字节流，是无法传输一个 java 对象给一个应用的。但是可能有疑问，在与浏览器交互时，还有将内存中的对象持久化到数据库中时，好像都没有去进行序列化和反序列化，因为都没有实现Serializable接口，但一直正常运行。

可是服务器与浏览器交互时真的没有用到Serializable接口吗? JSON格式实际上就是将一个对象转化为字符串，所以服务器与浏览器交互时的数据格式其实是字符串，来看来String类型的源码:

```java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];

    /** Cache the hash code for the string */
    private int hash; // Default to 0

    /** use serialVersionUID from JDK 1.0.2 for interoperability */
    private static final long serialVersionUID = -6849794470754667710L;

    ......
}
```

可以看到 String 是实现了Serializable接口的，并显式指定serialVersionUID的值。

然后再来看把对象持久化到数据库中的时候， Mybatis数据库映射文件里的insert代码：

```java
<insert id="insertUser" parameterType="org.tyshawn.bean.User">
    INSERT INTO t_user(name, age) VALUES (#{name}, #{age})
</insert>
```

实际上并不是将整个对象持久化到数据库中，而是将对象中的属性持久化到数据库中，而这些属性都是实现了Serializable接口的基本属性。

总结：序列化最终的目的是为了对象可以跨平台存储和进行网络传输，而进行跨平台存储和网络传输的方式就是 IO，而 IO 支持的数据格式就是字节数组

## 实现序列化和反序列化为什么要实现Serializable接口?
可以发现，这就是一个空接口，在Java中这样的接口叫做**“标记接口”英文叫做Marker Interface**，一般来说，一个类如果实现了一个标记接口，起到的作用仅仅是给自己增加一个标签，比如上述这个，如果一个类实现了这个接口，那就会给自己身增加一个“序列化”的标签，说明这个类可以实现序列化相关功能!

查看Serializable 接口内部，发现是一个空接口



![](https://pic1.imgdb.cn/item/68a1ac20ac2a2653fea52877/1755425783.png)

如果上面在定义Student类时忘了加implements Serializable时会发生什么呢？

实验结果是：此时的程序运行会报错，并抛出NotSerializableException异常，按照错误提示，由源码一直跟到ObjectOutputStream的writeObject0()方法底层一看，才恍然大悟

![](https://pic1.imgdb.cn/item/68a1ac75ac2a2653fea52896/1755425894.jpg)

如果一个对象既不是字符串、数组、枚举，而且也没有实现Serializable接口的话，在序列化时就会抛出NotSerializableException异常！原来Serializable接口也仅仅只是做一个标记用！！！

它告诉代码只要是实现了Serializable接口的类都是可以被序列化的！然而真正的序列化动作不需要靠它完成，

如果不实现Serializable接口，那自己去写一套序列化和反序列化代码也行。

## 为什么还要显式指定serialVersionUID的值?
如果不显式指定serialVersionUID，JVM在序列化时会根据属性自动生成一个serialVersionUID，然后与属性一起序列化，再进行持久化或网络传输。 在反序列化时，JVM会再根据属性自动生成一个新版serialVersionUID，然后将这个新版serialVersionUID与序列化时生成的旧版serialVersionUID进行比较，如果相同则反序列化成功，否则报错。如果显式指定了serialVersionUID，JVM在序列化和反序列化时仍然都会生成一个serialVersionUID，但值为显式指定的值，这样在反序列化时新旧版本的serialVersionUID就一致了。

在实际开发中，不显式指定serialVersionUID的情况会导致什么问题? 如果类写完后不再修改，那当然不会有问题，但这在实际开发中是不可能的，类会不断迭代，一旦类被修改了，那旧对象反序列化就会报错。 所以在实际开发中，都会显式指定一个serialVersionUID，值是多少无所谓，只要不变就行。写个实例测试下：



```java
public class User implements Serializable {

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

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

测试类先进行序列化，再进行反序列化

```java
public class SerializableTest {

    private static void serialize(User user) throws Exception {
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(new File("D:\\111.txt")));
        oos.writeObject(user);
        oos.close();
    }

    private static User deserialize() throws Exception{
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream(new File("D:\\111.txt")));
        return (User) ois.readObject();
    }


    public static void main(String[] args) throws Exception {
        User user = new User();
        user.setName("tyshawn");
        user.setAge(18);
        System.out.println("序列化前的结果: " + user);

        serialize(user);

        User dUser = deserialize();
        System.out.println("反序列化后的结果: "+ dUser);
    }
}
```



先注释掉反序列化代码，执行序列化代码，然后User类新增一个属性sex

```java
public class User implements Serializable {

    private String name;
    private Integer age;
    private String sex;

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

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", sex='" + sex + '\'' +
                '}';
    }
}
```

再注释掉序列化代码执行反序列化代码，最后结果如下

```java
序列化前的结果：User{name='tyshawn', age=18} 
Exception in thread "main" java.io.InvalidClassException: org.tyshawn.SerializeAndDeserialize.User; local class incompatible: stream classdesc serialVersionUID = 1035612825366363028, local class serialVersionUID = -1830850955895931978

```

报错结果为序列化与反序列化产生的serialVersionUID不一致。接下来在上面User类的基础上显式指定一个serialVersionUID

private static final long serialVersionUID = 1L;

再次执行上面步骤，测试结果如下

```java
序列化前的结果：User{name='tyshawn', age=18} 
反序列化后的结果：User{name='tyshawn', age=18, sex='null'}
```

显式指定serialVersionUID后就解决了序列化与反序列化产生的serialVersionUID不一致的问题。所以建议所有实现了 Serializable 接口的类都显示申明 serialVersionUID 版本号

这个 serialVersionUID 的值到底怎么设置才OK。首先，可以不用自己去赋值，Java会赋值，但是，这个就会出现上面的bug，很不安全，所以，还得自己手动的来。那么，该怎么赋值，eclipse可能会自动赋值个一长串数字。这个是没必要的。可以简单的赋值个 1L，这就可以了。。这样可以确保代码一致时反序列化成功。不同的serialVersionUID的值，会影响到反序列化，也就是数据的读取，写1L，注意L大些。计算机是不区分大小写的，所以说，这个值不要乱动，不然一个版本升级，旧数据就不兼容了，还不知道问题在哪。。。

## 序列化协议对应于 TCP/IP 4 层模型的哪一层？
网络通信双方必须采用和遵守相同的协议，TCP/IP 四层模型如下

![](https://pic1.imgdb.cn/item/68a1ac97ac2a2653fea5289a/1755425930.jpg)

如上图所示，OSI 七层协议模型中，表示层做的事情主要就是对应用层的用户数据进行处理转换为二进制流。反过来的话，就是将二进制流转换成应用层的用户数据。这不就对应的是序列化和反序列化么？

因为，OSI 七层协议模型中的应用层、表示层和会话层对应的都是 TCP/IP 四层模型中的应用层，所以序列化协议属于 TCP/IP 协议应用层的一部分。

## 序列化方式
序列化只是定义了对象和字节序列之间的转换，那转换的规则肯定也是多种多样的，也就是该如何实现把对象序列化成字节序列，然后再把字节序列反序列化成对象，这其中必然存在一种规则，序列化和反序列化都必须按照这个规则来！

那这个规则就是序列化协议，那由此基本可以得出，可能存在不同的序列化协议，然后有不同的方式去实现序列化。

也就是不管怎么处理，最终实现的目的是对象和字节序列的互相转换即可，比如Java就有其自己实现的一套序列化机制，可以把Java对象序列化成字节序列，还可以把自己序列再通过反序列化还原成原来的对象！

除了Java，像熟知的json也有其自己的序列化技术，用Java的序列化技术把一个对象序列化成了字节序列，那用json的反序列化技术是无法将其还原成原本的Java对象的！其他序列化技术还有常见的 ProtoBuf、Kryo 等，

### JDK 原生
#### 实现Serializable接口
作为一个成熟的编程语言，JDK自带了序列化方法，只需要类实现了Serializable接口，即可以将对象的状态转换成字节流，以便在网络上传输或持久化到磁盘，Serializable接口是一个标记接口，不包含任何方法。它的存在是为了告诉Java虚拟机这个类的对象可以被序列化，实现后就可以通过ObjectOutputStream类将对象变成byte[]字节数组。实现步骤

```java
/**
1. 对象实现 Serializable 接口
2. 创建一个 ObjectOutputStream 输出流
3. 调用 ObjectOutputStream 对象的 writeObject() 输出可序列化对象
*/
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class Person implements Serializable {

    private String name;

    private Integer age;

    private Float height;
}

public class Serializable01 {
    public static void main(String[] args) throws Exception {
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("person01.txt"));
        Person person01 = new Person("张三",35,175.4F);
        oos.writeObject(person01);
    }
}
```

用 idea 打开 person01.txt 文件可以看到如下内容，以 txt 形式打开发现是乱码的

![](https://pic1.imgdb.cn/item/68a1ace7ac2a2653fea528cb/1755426009.jpg)

可以以二进制内容查看

![](https://pic1.imgdb.cn/item/68a1ad13ac2a2653fea52900/1755426036.jpg)

这些二进制内容就是该 person 对象在内存中的存储形式，这也是 java 对象序列化出来的二进制内容，

到了这里再来看看，什么是Java的序列化：把Java对象在内存中的状态给存储下来的一个过程，会得到一个该Java对象的字节序列，可以说是一个二进制内容，本质上是一个byte[]数组！

为什么说是byte[]数组呢？1byte = 8bit，也就是8位一组，也就是一个字节，而二进制内存都是0和1这种8位8位的



反序列步骤如下

```java
/*
*1. 对象实现 Serializable 接口
2. 创建一个 ObjectInputStream 对象
3. 调用 ObjectInputStream 对象的 readObject()
*/
ObjectInputStream ois = new ObjectInputStream(new FileInputStream("person01.txt"));
Person person011 = (Person01) ois.readObject();
System.out.println("person01.txt 反序列化内容：" + person011.toString());
```

运行结果

```java
person01.txt 反序列化内容：Person01(name=张三, age=35, height=175.4)
```



#### 实现Externalizable 接口
一个类除了实现 Serializable 接口外来实现序列化，还有一种更加灵活的方式来实现序列化：实现 Externalizable 接口，Externalizable 接口是 Serializable 的子类，它提供了 writeExternal() 和 readExternal() 方法让类能够更加灵活地实现序列化。

接口源码

```java
public interface Externalizable extends java.io.Serializable {
    void writeExternal(ObjectOutput out) throws IOException;

    void readExternal(ObjectInput in) throws IOException, ClassNotFoundException;
}
```

一个类如果实现了 Externalizable 接口，即必须要实现 writeExternal() 和 readExternal() 两个方法。在这两个方法里面可以做自己任何想做的事情。

```java
public class Student implements Externalizable {
    private String name;
    private int age;
    private int grade;

    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeObject(name);
        out.writeInt(age - 2);      // 年龄我虚报 2 岁
        // 成绩我不报了
    }

    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        this.name = (String) in.readObject();
        this.age = in.readInt();
    }
}

public class Serializable04 {
    public static void main(String[] args) throws Exception {
        // 先序列化
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("student.txt"));
        Student student = new Student("小明",15,55);
        oos.writeObject(student);
        System.out.println("序列化对象内容：" + student);

        ObjectInputStream ois = new ObjectInputStream(new FileInputStream("student.txt"));
        Student student1 = (Student) ois.readObject();
        System.out.println("序列化后的内容：" + student1);
    }
}
```

运行结果

```java
序列化对象内容：Student(name=小明, age=15, grade=55)
序列化后的内容：Student(name=小明, age=13, grade=0)
```

根据运行结果看到，Externalizable 接口可以实现自定义的序列化和反序列化。

但是使用 Externalizable 接口时要注意，writeExternal() 方法和 readExternal() 的顺序要一致，即 writeExternal() 是按照怎么样的顺序来 write 值的，readExternal() 就必须严格按照这个顺序来 read ，否则会报错。有兴趣的小伙伴可以 name 和 age 的顺序调整下，就知道了。

对比

+ serializable系统自动存储Java 对象必要的信息，Externalizable程序员自己来实现 Java 对象的序列化，灵活度更加高
+ serializable不需要的属性使用 transient 修饰，	Externalizable不需要的属性可以不写入对象
+ serializable在反序列化的时候不走构造方法，Externalizable反序列化时，先走无参构造方法得到一个空对象，在调用 readExternal() 方法来读取序列化文件中的内容给该空对象赋值

#### 很少使用 jdk
现在 jdk 原生序列化很少使用，主要有如下几个原因

1、无法跨语言

通过 Java 原生 Serializable 接口与 ObjectOutputStream 实现的序列化，只能通过 Java 语言自己的ObjectInputStream 来反序列化，其他语言，如 C、Python、Go 等等都无法对其进行反序列化，这不很坑么？

同时，跨平台支持也不是很好，客户端与服务端如果因为 JDK 的版本不同都有可能导致无法进行反序列化，这个就更加坑了。

2、序列化字节流太大

Java 序列化它需要将类的描述信息和属性进行序列化，如果不这样做，它根本无法还原，这就会导致序列化字节流变得很大。来做一个比较，一个是 Java 原生序列化，一个是通用的二进制编码。

```java
public class UserInfo implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;

    private String userName;

    private String nickName;

    //该方法返回 UserInfo 的字节流。
    public byte[] codeC() {
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        byte[] userNameBytes = this.userName.getBytes();
        buffer.putInt(userNameBytes.length);
        buffer.put(userNameBytes);
        byte[] nickNameBytes = this.nickName.getBytes();
        buffer.putInt(nickNameBytes.length);
        buffer.put(nickNameBytes);
        buffer.putLong(this.id);
        buffer.flip();
        byte[] result = new byte[buffer.remaining()];
        buffer.get(result);
        return result;
    }
}
```



```java
public class Serializable01 {
    public static void main(String[] args) throws Exception {
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("person01.txt"));
        Person person01 = new Person("张三",35,175.4F);
        oos.writeObject(person01);
        oos.close();

        ObjectInputStream ois = new ObjectInputStream(new FileInputStream("person01.txt"));
        Person person011 = (Person) ois.readObject();
        System.out.println("person01.txt 反序列化内容：" + person011.toString());
    }
}
```



经过对比字节流方法比原生 jdk 序列化快了差不多 8 倍

3、序列化时间长

上面代码修改

```java
public class Serializable05 {
    public static void main(String[] args) throws Exception {
        UserInfo userInfo = new UserInfo(1001L,"zhangshan","张三");

        // 序列化
        long startTime = System.currentTimeMillis();
        ByteArrayOutputStream bout = new ByteArrayOutputStream();
        ObjectOutputStream out = new ObjectOutputStream(bout);
        out.writeObject(userInfo);
        out.flush();
        out.close();
        System.out.println("原生 JDK 序列化消耗时间：" + (System.currentTimeMillis() - startTime));
        bout.close();

        // 原生字节码
        startTime = System.currentTimeMillis();
        userInfo.codeC();
        System.out.println("UserInfo#codeC 消耗时间：" + (System.currentTimeMillis() - startTime));
    }
}
```

运行结果

```java
原生 JDK 序列化消耗时间：9
UserInfo#codeC 消耗时间：1
```

可以看到 jdk 原生序列化耗时很长



### ProtoBuf
Protobuf 是谷歌提出的一种序列化协议，Protobuf 是一种接口定义语言，它与语言和平台无关。它是一种序列化结构化数据并通过网络传输的方式，使用 Protobuf 传输二进制文件，与 JSON 的字符串格式相比，它提高了传输速度。

这里提到 Protobuf 是一种接口定义语言，说明也是一种语言，既然是语言那就有自己的关键字以及规则，所以对于Protobuf 协议，需要创建一个后缀为 .proto  的文件，在文件里面需要定义出的协议内容。

```java
syntax = "proto2";
package com.demo;
message Request {
    required int32 version = 1;
    required string id = 2;
    message Model  {
        required int32 id = 1;
        required string pid = 2;
        optional int32 width = 3;
        optional int32 height = 4;
        optional int32 pos = 5;
    }
    repeated Model model = 3;
}
```

message 关键字表示定义一个结构体，required 表示必须，optional 表示可选，此外还有字段的名称和类型。这个原始的 proto 文件是通用的，只要定义一次就好，不管使用哪种语言都可以通过 proto 工具自动生成对应语言的代码。比如要生成 Java 代码，可以执行下面的命令

protoc --java_out=. demo.proto 就会在指定的目录下，生成对应的 Demo.java，想生成其他语言的代码，只需要修改命令执行的参数即可，生成的代码内容会有很多，可以不用管直接使用就行。

定义模型的结构一次，然后就可以使用生成的源代码轻松地使用 Java、Python、Go、Ruby 和 C++ 等各种语言在各种数据流中写入和读取结构化数据。

Protobuf 的优点主要是性能高，体积小，缺点就是要学习一下特定的关键词以及要下载按照 Protobuf 命令工具。

### protoStuff
由于 Protobuf 的易用性，它的哥哥 Protostuff 诞生了。protostuff 基于 Google protobuf，但是提供了更多的功能和更简易的用法。虽然更加易用，但是不代表 ProtoStuff 性能更差。

Github 地址：[https://github.com/protostuff/protostuff](https://github.com/protostuff/protostuff)

### Hessian
Hessian 是一个轻量级的二进制 web service 协议，主要用于传输二进制数据。算是一个比较老的序列化实现了，在传输数据前 Hessian 支持将对象序列化成二进制流，Dubbo Rpc 默认启用的序列化方式就是 hessian2，但是对 hessian2 进行了修改。相对于 JDK 原生序列化，Hessian序列化之后体积更小，性能更优。

### Kryo
Kryo 是一个 Java 序列化框架，号称 Java 最快的序列化框架。Kryo 在序列化速度上很有优势，底层依赖于字节码生成机制。已经在 Twitter、Groupon、Yahoo 以及多个著名开源项目（如 Hive、Storm）中广泛的使用。

guide-rpc-framework 就是使用的 kyro 进行序列化，序列化和反序列化相关的代码如下：

```java
/**
* Kryo serialization class, Kryo serialization efficiency is very high, but only compatible with Java language
*/
@Slf4j
public class KryoSerializer implements Serializer {
	
	/**
	* Because Kryo is not thread safe. So, use ThreadLocal to store Kryo objects
	*/
	private final ThreadLocal<Kryo> kryoThreadLocal = ThreadLocal.withInitial(() -> {
		Kryo kryo = new Kryo();
		kryo.register(RpcResponse.class);
		kryo.register(RpcRequest.class);
		return kryo;
	});
	
	@Override
	public byte[] serialize(Object obj) {
		try (ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
			 Output output = new Output(byteArrayOutputStream)) {
			Kryo kryo = kryoThreadLocal.get();
			// Object->byte:将对象序列化为byte数组
			kryo.writeObject(output, obj);
			kryoThreadLocal.remove();
			return output.toBytes();
		} catch (Exception e) {
			throw new SerializeException("Serialization failed");
		}
	}
	
	@Override
	public <T> T deserialize(byte[] bytes, Class<T> clazz) {
		try (ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
			 Input input = new Input(byteArrayInputStream)) {
			Kryo kryo = kryoThreadLocal.get();
			// byte->Object:从byte数组中反序列化出对对象
			Object o = kryo.readObject(input, clazz);
			kryoThreadLocal.remove();
			return clazz.cast(o);
		} catch (Exception e) {
			throw new SerializeException("Deserialization failed");
		}
	}
	
}
```

Github 地址：[https://github.com/EsotericSoftware/kryo](https://github.com/EsotericSoftware/kryo) 由于只能限定在 JVM 语言上，所以 Kryo 不支持跨语言使用。

### Thrift
Thrift 也是一种序列化协议，具体的使用方式跟 Protobuf 类似，只不过 Thrift 是 Facebook 提出来的一种协议。也是一种接口描述语言和二进制通讯协议，原由Facebook于2007年开发，2008年正式提交Apache基金会托管，成为Apache下的开源项目。

Thrift 是一个 RPC 通讯框架，采用自定义的二进制通讯协议设计。相比于传统的HTTP协议，效率更高，传输占用带宽更小。另外，Thrift是跨语言的。Thrift的接口描述文件，通过其编译器可以生成不同开发语言的通讯框架。

Thrift 的使用方式跟 Protobuf 类似，也是有一个 .thrift 后缀的文件，然后通过命令生成各种语言的代码，这里就不演示了

### JSON
上面讲的几种序列化方式都是直接将对象变成二进制，也就是byte[]字节数组，这些方式都可以叫二进制方式。

 JSON 、xml 序列化方式生成的是一串有规则的字符串(文本类方式)，在可读性上要优于上面几种方式，但是在体积上就没什么优势了。另外 JSON 是有规则的字符串，不跟任何编程语言绑定，天然上就具备了跨平台，但是有个缺点那就是体积较大，很存在很多冗余内容，比如双引号，花括号。

JSON 序列化常见的框架有：fastJSON、Jackson、Gson 等。

### xml
前些年不管是使用 SSM，还是使用 Spring 都会有很多 XML 的配置文件，现在很多被注解代替了，但是 XML 还是支持使用的。另外有一些银卡等老系统里面会有很多基于 XML 的协议开发的系统和服务。

XML 协议的优缺点跟 JSON 类似，优点也是可读性很强，跨平台跨语言支持，缺点也是体积大，容易内容多。可以看到为了记录一个字段的值，每个标签都需要成对存在，过于冗余了。

## 如何选择序列化方式
互联网早期的序列化方式主要有COM和CORBA。COM主要用于Windows平台，并没有真正实现跨平台，另外COM的序列化的原理利用了编译器中虚表，使得其学习成本巨大（想一下这个场景， 工程师需要是简单的序列化协议，但却要先掌握语言编译器）。由于序列化的数据与编译器紧耦合，扩展属性非常麻烦。

CORBA是早期比较好的实现了跨平台，跨语言的序列化协议。COBRA的主要问题是参与方过多带来的版本过多，版本之间兼容性较差，以及使用复杂晦涩。这些政治经济，技术实现以及早期设计不成熟的问题，最终导致COBRA的渐渐消亡。J2SE 1.3之后的版本提供了基于CORBA协议的RMI-IIOP技术，这使得Java开发者可以采用纯粹的Java语言进行CORBA的开发。

随着软件技术的快速发展，之后逐渐出现了比较流行的序列化方式，例如：XML、JSON、Protobuf、Thrift 和 Avro等等。这么多技术如何选择？

最重要的就是要考虑这三个方面：

+ 协议是否支持跨平台：如果一个大的系统有好多种语言进行混合开发，那么就肯定不适合用有语言局限性的序列化协议，比如 JDK 原生、Kryo 这些只能用在 Java 语言范围下，用 JDK 原生方式进行序列化，用其他语言是无法反序列化的。
+ 序列化的速度：如果序列化的频率非常高，那么选择序列化速度快的协议会为系统性能提升不少
+ 序列化生成的体积：如果频繁的在网络中传输的数据那就需要数据越小越好，小的数据传输快，也不占带宽，也能整体提升系统的性能，因此序列化生成的体积就很关键了

所以每个协议有每个协议的特点，具体选择哪种协议也可根据实际的场景来选择，比如说如果是前后端对接，那么自然是 JSON 最合适，应该网页的交互要求不需要太高，秒级别是可以接受的，所以更加关注可读性。但是如果是微服务之间的数据传输，那就可以选择 Protobuf 或者 Thrift 这种更高效的协议来进行传输，因为这种场景对于协议序列化的体积和速度都有很高的要求。



## 序列化常见问题
### 1、 不会被序列化的属性
transient关键字修饰的属性不会被序列化

```java
public class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private String name;
    private Integer age;
    private transient String sex;
    private static String signature = "加油";

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

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public static String getSignature() {
        return signature;
    }

    public static void setSignature(String signature) {
        User.signature = signature;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", sex='" + sex +'\'' +
                ", signature='" + signature + '\'' +
                '}';
    }
}

public class SerializableTest {

    private static void serialize(User user) throws Exception {
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(new File("D:\\111.txt")));
        oos.writeObject(user);
        oos.close();
    }

    private static User deserialize() throws Exception{
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream(new File("D:\\111.txt")));
        return (User) ois.readObject();
    }


    public static void main(String[] args) throws Exception {
        User user = new User();
        user.setName("tyshawn");
        user.setAge(18);
        user.setSex("man");
        System.out.println("序列化前的结果: " + user);

        serialize(user);

        User dUser = deserialize();
        System.out.println("反序列化后的结果: "+ dUser);
    }
}
```

先注释掉反序列化代码，执行序列化代码，然后修改User类signature = "努力"，再注释掉序列化代码执行反序列化代码，最后结果如下:

```java
序列化前的结果： User{name='tyshawn', age=18, sex='man', signature='加油'} 
反序列化后的结果：User{name='tyshawn', age=18, sex='null', signature='努力'}
```



static属性也不会被序列化.

因为序列化是针对对象而言的，而static属性优先于对象存在，随着类的加载而加载，所以不会被序列化。

看到这个结论，是不是有人会问，serialVersionUID也被static修饰，为什么serialVersionUID会被序列化？其实serialVersionUID属性并没有被序列化，JVM在序列化对象时会自动生成一个serialVersionUID，然后将显式指定的serialVersionUID属性值赋给自动生成的serialVersionUID

### 2、父类子类序列化问题
在实际的开发过程中，尤其是实体类，为了对象属性的复用，往往会采用继承的方式来处理。

使用了继承之后，父类属性是否可以正常被序列化呢？下面来看看！

● 父类没有实现序列化，子类实现序列化

首先创建两个类Parent和Child，Child继承自Parent

```java
public class Parent {

    private String name;

    public String getName() {
        return name;
    }

    public Parent setName(String name) {
        this.name = name;
        return this;
    }

}

public class Child extends Parent implements Serializable{


    private static final long serialVersionUID = 1l;

    private String id;

    public String getId() {
        return id;
    }

    public Child setId(String id) {
        this.id = id;
        return this;
    }
    
}
```

测试了

```java
public class ObjectMainTest {

    public static void main(String[] args) throws Exception {
        serializeAnimal();
        deserializeAnimal();
    }

    private static void serializeAnimal() throws Exception {
        Child black = new Child();
        black.setId("123");
        black.setName("张三");
        System.out.println("id:" +  black.getId() + ",name:" +  black.getName());
        System.out.println("=================开始序列化================");
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("object.log"));
        oos.writeObject(black);
        oos.flush();
        oos.close();
    }

    private static void deserializeAnimal() throws Exception {
        System.out.println("=================开始反序列化================");
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream("object.log"));
        Child black = (Child) ois.readObject();
        ois.close();
        System.out.println("id:" +  black.getId() + ",name:" +  black.getName());
    }
}
```

结果很明显，父类的属性没有被序列化进去！

再来试试，另一种常见

● 父类实现序列化，子类不实现序列化

```java
public class Parent implements Serializable {

    private static final long serialVersionUID = 1L;

    private String name;

    public String getName() {
        return name;
    }

    public Parent setName(String name) {
        this.name = name;
        return this;
    }

}

public class Child extends Parent {

    private String id;

    public String getId() {
        return id;
    }

    public Child setId(String id) {
        this.id = id;
        return this;
    }

}
```

结果很明显，父类的属性被序列化进去！

假如，子类和父类，都实现了序列化，并且序列化版本号都不一样，会不会出现问题呢？

● 父类实现序列化，子类实现序列化

```java
public class Parent implements Serializable {

    private static final long serialVersionUID = 1L;

    private String name;

    public String getName() {
        return name;
    }

    public Parent setName(String name) {
        this.name = name;
        return this;
    }

}

public class Child extends Parent implements Serializable{

    private static final long serialVersionUID = 2l;

    private String id;

    public String getId() {
        return id;
    }

    public Child setId(String id) {
        this.id = id;
        return this;
    }

}
```

父类的属性序列化依然成功，当父、子类都实现了序列化，并且定义了不同的版本号，这种情况下，版本号是跟着子类的版本号走的！

总结起来，当父类实现序列化时，子类所有的属性也会全部被序列化；但是当父类没有实现序列化，子类在序列化时，父类属性并不会被序列化！

### 3、引用类型属性序列化问题
上面Person的成员变量都是基本类型，如果成员变量为引用类型，那么这个引用类型也必须是可序列化的

### 4、同一个对象多次序列化之间属性更新，序列化前后有什么区别
下面例子中People是可序列化的，每次序列化之前都会把People的id值修改了，用来观察看看，多次序列化期间，如果对象属性更新，是否会影响序列化，反序列化有什么区别。

```java
public class Test {
    private static void sameObjectRepeatedSerialization() throws Exception {

        File file = new File("D:/tmp/peopele_more.java_");
        People p = new People(10L);
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(file));
        // 未序列化，先修改属性
        p.setId(11L);
        oos.writeObject(p);
        // 序列化一次后，再次修改属性
        p.setId(15L);
        oos.writeObject(p);
        // 序列化两次后，再次修改属性
        p.setId(20L);
        oos.writeObject(p);
        oos.close();

        ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file));
        Object people1 = ois.readObject();
        Object people2 = ois.readObject();
        Object people3 = ois.readObject();
        ois.close();

        System.out.println(((People) people1).getId());
        System.out.println(((People) people2).getId());
        System.out.println(((People) people3).getId());
    }


    public static void main(String[] args) throws Exception {
        sameObjectRepeatedSerialization();
    }
}
```

结果输入三个 11，说明当对象第一次序列化成功后，后续这个对象属性即使有修改，也不会对后面的序列化造成成影响。这其实是序列化算法的原因，
所有要序列化的对象都有一个序列化的编码号，当试图序列化一个对象，会检查这个对象是否已经序列化过，若从未序列化过，才会序列化为字节序列去输出。
若已经序列化过，则会输出一个编码符号，不会重复序列化一个对象。如下

![](https://pic1.imgdb.cn/item/68a1ad41ac2a2653fea5293d/1755425961.jpg)

序列化一次后，后续继续序列化并未重复转换为字节序列，而是输出字符q~

总结：当第一次序列化之后，不管如何修改这个对象的属性，都不会对后续的序列化产生影响，反序列化的结果都和第一次相同

如何解决，每次创建新的 objectOutputStream

```java
// 每次都创建新的ObjectOutputStream
ObjectOutputStream oos1 = new ObjectOutputStream(new FileOutputStream(file));
oos1.writeObject(p);
oos1.close();

// 修改属性
p.setId(15L);
ObjectOutputStream oos2 = new ObjectOutputStream(new FileOutputStream(file, true)); // 追加模式
oos2.writeObject(p);
oos2.close();
```

## 参考阅读
● 美团技术团队-序列化和反序列化

[https://tech.meituan.com/2015/02/26/serialization-vs-deserialization.html](https://tech.meituan.com/2015/02/26/serialization-vs-deserialization.html)

● 在 Dubbo 中使用高效的 Java 序列化（Kryo 和 FST）

[https://dubbo.apache.org/zh-cn/docs/user/serialization.html](https://dubbo.apache.org/zh-cn/docs/user/serialization.html)

