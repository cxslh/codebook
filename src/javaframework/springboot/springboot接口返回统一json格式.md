---
title: 接口返回统一json格式数据
headerDepth: 4
order: 3
---

前后端分离项目中我们会将响应封装成json格式统一返回，一般包含状态码、返回消息、数据这几部分内容

```
{
 "code": 数字, //响应码
 "msg": 字符串, //返回消息
 "data": HashMap //返回数据，放在键值对中
}
```
首先定义一个返回枚举

```java
/**
 * 统一返回状态码
 */
public enum ResultEnum{
    /* 成功 */
    SUCCESS(200, "成功"),

    /*网络异常、错误*/
    ERROR(500,"网络异常"),


    /* 参数错误：1000～1999 */
    PARAM_NOT_VALID(1001, "参数无效"),
    PARAM_IS_BLANK(1002, "参数为空"),
    PARAM_TYPE_ERROR(1003, "参数类型错误"),
    PARAM_NOT_COMPLETE(1004, "参数缺失");

    private int code;
    private String msg;

    ResultEnum(int code, String msg){
        this.code = code;
        this.msg = msg;
    }


    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    /**
     * 根据code获取message
     *
     * @param code 状态码
     * @return msg
     */
    public static String getMsgByCode(Integer code) {
        for (ResultEnum ele : values()) {
            if (ele.getCode()==code) {
                return ele.getMsg();
            }
        }
        return null;
    }
}
```

定义返回类

```java
/**
 * 封装统一返回实体类
 * 继承HashMap 可随时put自定义key-value
 */
public class Result extends HashMap<String,Object> {
    /** 状态码 */
    public static final String CODE_TAG = "code";

    /** 消息 */
    public static final String MSG_TAG = "msg";

    /** 数据对象 */
    public static final String DATA_TAG = "data";

    public Result() {
    }

    public Result(int code, String msg) {
        super.put(CODE_TAG, code);
        super.put(MSG_TAG, msg);
    }

    public Result(Integer code, String msg, Object obj) {
        super.put(CODE_TAG, code);
        super.put(MSG_TAG, msg);
        if (obj!=null)
        {
            super.put(DATA_TAG, obj);
        }
    }

    public static Result success(){
        return new Result(ResultEnum.SUCCESS.getCode(),ResultEnum.SUCCESS.getMsg());
    }
    public static Result success(Object obj){
        return new Result(ResultEnum.SUCCESS.getCode(),ResultEnum.SUCCESS.getMsg(),obj);
    }
    public static Result error(){
        return new Result(ResultEnum.ERROR.getCode(),ResultEnum.ERROR.getMsg());
    }
    public static Result error(String msg){
        return new Result(ResultEnum.ERROR.getCode(),msg);
    }
    public static Result error(Integer code,String msg){
        return new Result(code,msg);
    }

}
```

前后端分离的项目中，基本每个controller都要返回一个Result ,如果在Controller只想reture一个实体！可以通过AOP拦截所有Controller，再@After的时候统一封装

```java
@RestControllerAdvice(basePackages = {"com.system"})
public class ControllerResponseAdvice implements ResponseBodyAdvice<Object> {
    @Override
    public boolean supports(MethodParameter methodParameter, Class<? extends HttpMessageConverter<?>> aClass) {
        // response是Result类型，或者注释了NotControllerResponseAdvice都不进行包装
        return !methodParameter.getParameterType().isAssignableFrom(Result.class);
    }

    @Override
    public Object beforeBodyWrite(Object data, MethodParameter returnType, MediaType mediaType, Class<? extends HttpMessageConverter<?>> aClass, ServerHttpRequest request, ServerHttpResponse response) {
        // String类型不能直接包装
        if (returnType.getGenericParameterType().equals(String.class)) {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                // 将数据包装在Result里后转换为json串进行返回
                return objectMapper.writeValueAsString(Result.success(data));
            } catch (JsonProcessingException e) {
                throw new APIException(ResultEnum.ERROR, e.getMessage());
            }
        }
        // 否则直接包装成Result返回
        return Result.success(data);
    }
}
```

* @RestControllerAdvice(basePackages = {"com.system"})自动扫描了所有指定包下的controller，在Response时进行统一处理
* 重写supports方法，也就是说，当返回类型已经是Result了，那就不需要封装了，当不等与Result时才进行调用beforeBodyWrite方法，跟过滤器的效果是一样的
* 最后重写我们的封装方法beforeBodyWrite，注意除了String的返回值有点特殊，无法直接封装成json，我们需要进行特殊处理，其他的直接返回Result.success(data)

测试

```java
    @PostMapping("/findByVo")
    public ProductInfo findByVo(@Validated ProductInfoVo vo) {
        ProductInfo productInfo = new ProductInfo();
        BeanUtils.copyProperties(vo, productInfo);
        return productInfoService.getOne(new QueryWrapper(productInfo));
    }
```

此时就算我们返回的是po，接收到的返回就是标准格式了

```
{
  "code": 1000,
  "msg": "请求成功",
  "data": {
    "productId": 1,
    "productName": "test",
    "productPrice": 100.00,
    "productDescription": "test desc",
    "productStatus": 0,
    ...
  }
}
```

因为百分之99的请求还是需要包装的，只有个别请求方法不需要，写在包装的过滤器吧？又不是很好维护，那就加个注解好了。所有不需要包装的就加上这个注解。

```java
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface NotControllerResponseAdvice {
}
```

然后在我们的增强过滤方法上过滤包含这个注解的方法

```java
@RestControllerAdvice(basePackages = {"com.system"})
public class ControllerResponseAdvice implements ResponseBodyAdvice<Object> {
    @Override
    public boolean supports(MethodParameter methodParameter, Class<? extends HttpMessageConverter<?>> aClass) {
        //response是Result类型，或者注释了NotControllerResponseAdvice都不进行包装
        return !(methodParameter.getParameterType().isAssignableFrom(Result.class)
                || methodParameter.hasMethodAnnotation(NotControllerResponseAdvice.class));
    }

    @Override
    public Object beforeBodyWrite(Object data, MethodParameter returnType, MediaType mediaType, Class<? extends HttpMessageConverter<?>> aClass, ServerHttpRequest request, ServerHttpResponse response) {
        // String类型不能直接包装
        if (returnType.getGenericParameterType().equals(String.class)) {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                // 将数据包装在Result里后转换为json串进行返回
                return objectMapper.writeValueAsString(Result.success(data));
            } catch (JsonProcessingException e) {
                throw new APIException(ResultEnum.ERROR, e.getMessage());
            }
        }
        // 否则直接包装成Result返回
        return Result.success(data);
    }
}
```

最后就在不需要包装的方法上加上注解

```java
@RestController
public class HealthController {

    @GetMapping("/test")
    @NotControllerResponseAdvice
    public String health() {
        return "test";
    }
}

```