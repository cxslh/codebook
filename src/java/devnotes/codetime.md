---
title: 如何计算代码执行耗时
headerDepth: 4
order: 2
---

代码耗时统计的并不是某个方法的耗时，而是任意代码段之间的耗时。这个代码段，可能是一个方法中的几行代码，也有可能是从这个方法的某一行到另一个被调用方法的某一行，因此通过 AOP 方式是不能实现这个需求的。

## 使用 System函数
```java
public static void main(String[] args) {
    long  start = System.currentTimeMillis();
    try {
        // 模拟业务操作
        Thread.sleep(1000L);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
    long end = System.currentTimeMillis();
    System.out.println("耗时：" + (end - start) + "ms");
}

或者

public static void main(String[] args) {
    long start = System.nanoTime();
    try {
        Thread.sleep(1000L);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
    long finish = System.nanoTime();

    long timeElapsed = finish - start;
    // 纳秒
    System.out.println(timeElapsed);
}
```

## 使用 Instant.now()函数
```java
public static void main(String[] args) {
    Instant start = Instant.now();
    try {
        Thread.sleep(1000L);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
    Instant finish = Instant.now();
    long timeElapsed = Duration.between(start, finish).toMillis();
    System.out.println(timeElapsed + "ms");
}
```

## 使用 Spring 框架提供的 StopWatch
```java
public static void main(String[] args) {
    StopWatch watch = new StopWatch();
    watch.start("watcher");
    //some code
    try {
        Thread.sleep(1000L);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
    watch.stop();
    System.out.println(watch.prettyPrint());
}
```

## 使用 apache.commons 提供的 StopWatch
需要要入 apache.commons 依赖，用法上面的 spring 类似

## java8 中的Function
在 jdk 1.8 中，引入了 java.util.function 包，通过该类提供的接口，能够实现在指定代码段的上下文执行额外代码的功能。

```java
public class TraceHolderTest {
    public static void main(String[] args) {
        TraceWatch traceWatch = new TraceWatch();

        TraceHolder.run(traceWatch, "function1", i -> {
            try {
                TimeUnit.SECONDS.sleep(1); // 模拟业务代码
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        String result = TraceHolder.run(traceWatch, "function2", () -> {
            try {
                TimeUnit.SECONDS.sleep(1); // 模拟业务代码
                return "YES";
            } catch (InterruptedException e) {
                e.printStackTrace();
                return "NO";
            }
        });

        TraceHolder.run(traceWatch, "function1", i -> {
            try {
                TimeUnit.SECONDS.sleep(1); // 模拟业务代码
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        System.out.println(JSON.toJSONString(traceWatch.getTaskMap()));
    }
}

/* output: 
{"function2":[{"data":1004,"taskName":"function2"}],"function1":[{"data":1001,"taskName":"function1"},{"data":1002,"taskName":"function1"}]}
*/
public class TraceHolder {
    /**
     * 有返回值调用
     */
    public static <T> T run(TraceWatch traceWatch, String taskName, Supplier<T> supplier) {
        try {
            traceWatch.start(taskName);

            return supplier.get();
        } finally {
            traceWatch.stop();
        }
    }

    /**
     * 无返回值调用
     */
    public static void run(TraceWatch traceWatch, String taskName, IntConsumer function) {
        try {
            traceWatch.start(taskName);

            function.accept(0);
        } finally {
            traceWatch.stop();
        }
    }
}
```

这里利用了 Supplier 和 IntConsumer 接口，对外提供了有返回值和无返回值得调用，在 TraceHolder 类中，在核心代码块的前后，分别调用了前文的 TraceWatch 的方法，实现了耗时统计的功能。

