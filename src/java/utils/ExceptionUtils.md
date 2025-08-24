---
title: ExceptionUtil
headerDepth: 4
order: 2
---

```java
import java.io.PrintWriter;
import java.io.StringWriter;
public class ExceptionUtil {
    /**
     * 当出现异常时通常都需要将异常信息写入到日志中，异常信息越详细越有利于问题的排查。
     * 通过的Exception.getMessage()方法只能获得异常的名称而不能获取哪里出现的异常
     * 通过getExceptionMessage 方法可以获取异常详细信息
     * 
     * @param e Exception
     * @return ExceptionMessageStr
     */
    public static String getExceptionMessage(Exception e) {
        StringWriter stringWriter = new StringWriter();
        PrintWriter writer = new PrintWriter(stringWriter);
        e.printStackTrace(writer);
        StringBuffer buffer = stringWriter.getBuffer();
        return buffer.toString();
    }
}
```