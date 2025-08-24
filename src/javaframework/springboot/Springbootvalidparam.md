---
title: 如何校验参数
headerDepth: 4
order: 3
---

## 参数校验
参数校验可以防止无效或错误的数据进入系统。通过校验前端输入的参数，可以确保数据的完整性，避免因为缺少必要的信息而导致程序错误或异常。例如，对于密码字段，可以通过校验规则要求用户输入至少8个字符、包含字母和数字等，以增加密码的强度，提高系统的安全性。通过及时地反馈错误信息，用户可以更快地发现和纠正输入错误，提升用户体验。特别是在前后端接口联调时，前端传参错误很快能得到异常提示，就大大提升了联调效率。



## 传统的校验方法
```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, Object> request) {
        String username = (String) request.get("username");
        if (username == null || username.length() < 3 || username.length() > 20) {
            return ResponseEntity.badRequest().body("用户名不能为空，且长度必须在3到20之间");
        }

        String password = (String) request.get("password");
        if (password == null || password.length() < 8) {
            return ResponseEntity.badRequest().body("密码不能为空，且长度至少为8个字符");
        }

        Integer age = (Integer) request.get("age");
        if (age == null || age <= 0 || age > 120) {
            return ResponseEntity.badRequest().body("年龄必须是正整数，且不能超过120");
        }

        return ResponseEntity.ok("注册成功！");
    }
}
```

这种手写参数校验的方式，在简单场景下勉强能用，但如果业务变复杂，问题会越来越多。在 Spring Boot 中，可以使用Hibernate Validator来实现参数校验。它的核心思路是：把校验逻辑从业务代码里抽离出来，用注解的方式声明校验规则
## Springboot 校验原理
Java API规范(JSR303)定义了Bean校验的标准validation-api，但没有提供实现。hibernate validation是对这个规范的实现，并增加了校验注解如@Email、@Length等。Spring Validation是对hibernate validation的二次封装，用于支持SpringMVC参数自动校验，如果SpringBoot版本小于2.3.x，spring-boot-starter-web会自动引入hibernate-validator依赖。如果SpringBoot版本大于2.3.x，则需要手动引入依赖：

```plain
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```
## 校验注解
### 校验空值
+ @Null：验证对象是否为 null
+ @NotNull：验证对象是否不为 null，但可以为空比如空字符串或者空集合
+ @NotEmpty：验证对象不为 null，可以为空字符串，但是长度（数组、集合、字符串等）大于 0
+ @NotBlank：验证字符串不为 null，且去除两端空白字符后长度大于 0

### 校验大小
+ @Size(min=, max=)：验证对象（数组、集合、字符串等）长度是否在给定的范围之内
+ @Min(value)：验证数值（整数或浮点数）是否大于等于指定的最小值
+ @Max(value)：验证数值是否小于等于指定的最大值
+ @DecimalMin(value)：被注释的元素必须是一个数字，其值必须大于等于指定的最小值
+ @DecimalMax(value)：被注释的元素必须是一个数字，其值必须小于等于指定的最大值
+ @Digits (integer, fraction)：被注释的元素必须是一个数字，其值必须在可接受的范围内

### 校验布尔值
+ @AssertTrue：验证 Boolean 对象是否为 true
+ @AssertFalse：验证 Boolean 对象是否为 false

### 校验日期和时间
+ @Past：验证 Date 和 Calendar 对象是否在当前时间之前
+ @Future：验证 Date 和 Calendar 对象是否在当前时间之后
+ @PastOrPresent：验证日期是否是过去或现在的时间
+ @FutureOrPresent：验证日期是否是现在或将来的时间

### 正则表达式
+ @Pattern(regexp=, flags=)：验证 String 对象是否符合正则表达式的规则

### 其他
+ @Length(min=, max=)：验证字符串的大小是否在指定的范围内
+ @Range(min=, max=)：验证数值是否在合适的范围内
+ @UniqueElements：校验集合中的值是否唯一，依赖于 equals 方法
+ @ScriptAssert：利用脚本进行校
+ @Email：被注释的元素必须是电子邮箱地址
+ @SafeHtml：被注释的元素必须 Html
+ URL： 被注释的元素必须是有效的 URL
+ @Negative：负数不包括0
+ @NegativeOrZero：负数或0
+ **@**CreditCardNumber：字符串是有效的信用卡数字，不校验信用卡本身的有效性
+ @Valid 和 @Validated

这两个注解是校验的入口，作用相似但用法上存在差异。

```java
// 用于类/接口/枚举，方法以及参数
@Target({ElementType.TYPE, ElementType.METHOD, ElementType.PARAMETER})  
@Retention(RetentionPolicy.RUNTIME)
@Documented  
public @interface Validated {  
    // 校验时启动的分组  
    Class<?>[] value() default {};  
}

// 用于方法，字段，构造函数，参数，以及泛型类型  
@Target({ METHOD, FIELD, CONSTRUCTOR, PARAMETER, TYPE_USE })  
@Retention(RUNTIME)  
@Documented
public @interface Valid {  
    // 未提供其他属性  
}
```

1. 作用范围不同：@Validated 无法作用在于字段， @Valid 无法作用于类
2.  注解中的属性不同：@Validated 中提供了指定校验分组的属性，而 @Valid 没有这个功能，因为 @Valid 不能进行分组校验
3. @Valid 注解支持嵌套校验，@Validated 不支持嵌套校验
4. @Validated（Spring's JSR-303 规范，是标准 JSR-303 的一个变种），javax提供了@Valid（标准JSR-303规范），配合 BindingResult 可以直接提供参数验证结果。

## 校验
### @RequestBody 参数校验
当方法入参为 @RequestBody 注解的 JavaBean，可在入参前使用 @Validated 或 @Valid 注解开启校验

```plain
@PostMapping("/addStudent")
public void addStudent(@RequestBody  @Valid  Student student) {
  //所有验证通过才会执行下面的代码
  System.out.println("添加学生成功");
}
```

@ResponseBody标注方法校验原理

在SpringMVC中，RequestResponseBodyMethodProcessor是用于解析@RequestBody标注的参数以及处理@ResponseBody标注方法的返回值的。显然，执行参数校验的逻辑肯定就在解析参数的方法resolveArgument()中：

```java
public class RequestResponseBodyMethodProcessor extends AbstractMessageConverterMethodProcessor {
    @Override
    public Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {

        parameter = parameter.nestedIfOptional();
        //将请求数据封装到DTO对象中
        Object arg = readWithMessageConverters(webRequest, parameter, parameter.getNestedGenericParameterType());
        String name = Conventions.getVariableNameForParameter(parameter);

        if (binderFactory != null) {
            WebDataBinder binder = binderFactory.createBinder(webRequest, arg, name);
            if (arg != null) {
                // 执行数据校验
                validateIfApplicable(binder, parameter);
                if (binder.getBindingResult().hasErrors() && isBindExceptionRequired(binder, parameter)) {
                    throw new MethodArgumentNotValidException(parameter, binder.getBindingResult());
                }
            }
            if (mavContainer != null) {
                mavContainer.addAttribute(BindingResult.MODEL_KEY_PREFIX + name, binder.getBindingResult());
            }
        }
        return adaptArgumentIfNecessary(arg, parameter);
    }
}
```

可以看到，resolveArgument()调用了validateIfApplicable()进行参数校验。

```java
protected void validateIfApplicable(WebDataBinder binder, MethodParameter parameter) {
    // 获取参数注解，比如@RequestBody、@Valid、@Validated
    Annotation[] annotations = parameter.getParameterAnnotations();
    for (Annotation ann : annotations) {
        // 先尝试获取@Validated注解
        Validated validatedAnn = AnnotationUtils.getAnnotation(ann, Validated.class);
        //如果直接标注了@Validated，那么直接开启校验。
        //如果没有，那么判断参数前是否有Valid起头的注解。
        if (validatedAnn != null || ann.annotationType().getSimpleName().startsWith("Valid")) {
            Object hints = (validatedAnn != null ? validatedAnn.value() : AnnotationUtils.getValue(ann));
            Object[] validationHints = (hints instanceof Object[] ? (Object[]) hints : new Object[] {hints});
            //执行校验
            binder.validate(validationHints);
            break;
        }
    }
}
```

看到这里，大家应该能明白为什么这种场景下@Validated、@Valid两个注解可以混用。接下来继续看WebDataBinder.validate()实现。

```java
@Override
public void validate(Object target, Errors errors, Object... validationHints) {
    if (this.targetValidator != null) {
        processConstraintViolations(
            //此处调用Hibernate Validator执行真正的校验
            this.targetValidator.validate(target, asValidationGroups(validationHints)), errors);
    }
}
```

最终发现底层最终还是调用了Hibernate Validator进行真正的校验处理。

注意：如果是通过post ResponseBody会抛出MethodArgumentNotValidException异常，如果是get 请求，普通的student参数，则会抛出BindException 异常

### 简单参数校验
当方法入参为 @PathVariable、 @RequestParam 注解的简单参数时，需要在 Controller 加上 @Validated 注解开启校验。

```java
@RequestMapping("/student")
@RestController
// 必须加上该注解
@Validated
public class StudentController {
    // 路径变量
    @GetMapping("{id}")
    public Reponse<Student> detail(@PathVariable("id") @Min(1L) Long StudentId) {
        // 参数StudentId校验通过，执行后续业务逻辑
        return Reponse.ok();
    }

    // 请求参数
    @GetMapping("getByName")
    public Result getByName(@RequestParam("Name") @Length(min = 1, max = 20) String  Name) {
        // 参数Name校验通过，执行后续业务逻辑
        return Result.ok();
    }
}
```

简单参数校验原理

上面提到的将参数一个个平铺到方法参数中，然后在每个参数前面声明约束注解的校验方式，就是方法级别的参数校验。实际上，这种方式可用于任何Spring Bean的方法上，比如Controller/Service等。其底层实现原理就是AOP，具体来说是通过MethodValidationPostProcessor动态注册AOP切面，然后使用MethodValidationInterceptor对切点方法织入增强。

```java
public class MethodValidationPostProcessor extends AbstractBeanFactoryAwareAdvisingPostProcessor implements InitializingBean {
    @Override
    public void afterPropertiesSet() {
        //为所有`@Validated`标注的Bean创建切面
        Pointcut pointcut = new AnnotationMatchingPointcut(this.validatedAnnotationType, true);
        //创建Advisor进行增强
        this.advisor = new DefaultPointcutAdvisor(pointcut, createMethodValidationAdvice(this.validator));
    }

    //创建Advice，本质就是一个方法拦截器
    protected Advice createMethodValidationAdvice(@Nullable Validator validator) {
        return (validator != null ? new MethodValidationInterceptor(validator) : new MethodValidationInterceptor());
    }
}
```

接着看一下MethodValidationInterceptor

```java
public class MethodValidationInterceptor implements MethodInterceptor {
    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        //无需增强的方法，直接跳过
        if (isFactoryBeanMetadataMethod(invocation.getMethod())) {
            return invocation.proceed();
        }
        //获取分组信息
        Class<?>[] groups = determineValidationGroups(invocation);
        ExecutableValidator execVal = this.validator.forExecutables();
        Method methodToValidate = invocation.getMethod();
        Set<ConstraintViolation<Object>> result;
        try {
            //方法入参校验，最终还是委托给Hibernate Validator来校验
            result = execVal.validateParameters(
                invocation.getThis(), methodToValidate, invocation.getArguments(), groups);
        }
        catch (IllegalArgumentException ex) {
            
        }
        //有异常直接抛出
        if (!result.isEmpty()) {
            throw new ConstraintViolationException(result);
        }
        //真正的方法调用
        Object returnValue = invocation.proceed();
        //对返回值做校验，最终还是委托给Hibernate Validator来校验
        result = execVal.validateReturnValue(invocation.getThis(), methodToValidate, returnValue, groups);
        //有异常直接抛出
        if (!result.isEmpty()) {
            throw new ConstraintViolationException(result);
        }
        return returnValue;
    }
}
```

实际上，不管是requestBody参数校验还是方法级别的校验，最终都是调用Hibernate Validator执行校验，Spring Validation只是做了一层封装。

### 复杂参数校验
有时候，需要对多个字段进行复杂的逻辑校验，例如需要两个字段相互比较或执行自定义的校验逻辑。在这种情况下，可以使用自定义的校验器（Validator）来实现。

```java
public class UserDto{
    @NotNull(message = "起始日期不能为空")
    private LocalDate startDate;
    
    @NotNull(message = "结束日期不能为空")
    private LocalDate endDate;
    
    @AssertTrue(message = "结束日期必须晚于起始日期")
    private boolean isEndDateAfterStartDate(){
        if (startDate == null || endDate == null) {
            returntrue;
        }
        return endDate.isAfter(startDate);
    }
}
```

在上述示例中，使用了 @AssertTrue注解来标记自定义的校验方法 isEndDateAfterStartDate()。该方法检查 endDate是否晚于 startDate，如果校验失败，将返回指定的错误提示信息。

### 分组校验
在实际项目中，可能多个方法需要使用同一个DTO类来接收参数，而不同方法的校验规则很可能是不一样的。这个时候，简单地在DTO类的字段上加约束注解无法解决这个问题。因此，spring-validation支持了分组校验的功能，专门用来解决这类问题。还是上面的例子，比如保存User的时候，UserId是可空的，但是更新User的时候，UserId的值必须>=10000000000000000L；其它字段的校验规则在两种情况下一样。这个时候使用分组校验的代码示例如下：

约束注解上声明适用的分组信息groups

```java
@Data
public class UserDTO {

    @Min(value = 10000000000000000L, groups = Update.class)
    private Long userId;

    @NotNull(groups = {Save.class, Update.class})
    @Length(min = 2, max = 10, groups = {Save.class, Update.class})
    private String userName;

    @NotNull(groups = {Save.class, Update.class})
    @Length(min = 6, max = 20, groups = {Save.class, Update.class})
    private String account;

    @NotNull(groups = {Save.class, Update.class})
    @Length(min = 6, max = 20, groups = {Save.class, Update.class})
    private String password;

    /**
     * 保存的时候校验分组
     */
    public interface Save {
    }

    /**
     * 更新的时候校验分组
     */
    public interface Update {
    }
}
```

@Validated注解上指定校验分组

```java
@PostMapping("/save")
public Result saveUser(@RequestBody @Validated(UserDTO.Save.class) UserDTO userDTO) {
    // 校验通过，才会执行业务逻辑处理
    return Result.ok();
}

@PostMapping("/update")
public Result updateUser(@RequestBody @Validated(UserDTO.Update.class) UserDTO userDTO) {
    // 校验通过，才会执行业务逻辑处理
    return Result.ok();
}
```

### 嵌套（递归）校验
前面的示例中，DTO类里面的字段都是基本数据类型和String类型。但是实际场景中，有可能某个字段也是一个对象，这种情况先，可以使用嵌套校验。比如，上面保存User信息的时候同时还带有Job信息。需要注意的是，此时如果是 post json 请求，无法完成对嵌套类字段校验，必须在 DTO类的对应字段必须标记@Valid注解。但如果是 GET 请求，是正常校验 job 下的所有属性的

```java
@Data
public class UserDTO {

    @Min(value = 10000000000000000L, groups = Update.class)
    private Long userId;

    @NotNull(groups = {Save.class, Update.class})
    @Length(min = 2, max = 10, groups = {Save.class, Update.class})
    private String userName;

    @NotNull(groups = {Save.class, Update.class})
    @Length(min = 6, max = 20, groups = {Save.class, Update.class})
    private String account;

    @NotNull(groups = {Save.class, Update.class})
    @Length(min = 6, max = 20, groups = {Save.class, Update.class})
    private String password;

    @NotNull(groups = {Save.class, Update.class})
    @Valid
    private Job job;

    @Data
    public static class Job {

        @Min(value = 1, groups = Update.class)
        private Long jobId;

        @NotNull(groups = {Save.class, Update.class})
        @Length(min = 2, max = 10, groups = {Save.class, Update.class})
        private String jobName;

        @NotNull(groups = {Save.class, Update.class})
        @Length(min = 2, max = 10, groups = {Save.class, Update.class})
        private String position;
    }

    /**
     * 保存的时候校验分组
     */
    public interface Save {
    }

    /**
     * 更新的时候校验分组
     */
    public interface Update {
    }
}
```

### 集合校验
就像下面的写法，方法的参数为集合时，如何检验元素的约束呢？

```java
/**
 * 集合类型参数元素.
 *
 * @param student the student
 * @return the rest
 */
@PostMapping("/batchadd")
public Rest<?> batchAddStudent(@Valid @RequestBody List<Student> student) {
    return RestBody.okData(student);
}
```

同样是在类上添加@Validated注解。注意一定要添加到方法所在的类上才行。这时候会抛出ConstraintViolationException异常

### 自定义校验
业务需求总是比框架提供的这些简单校验要复杂的多，可以自定义校验来满足需求。自定义Spring validation非常简单，如下两个案例

1、 假设自定义加密id（由数字或者a-f的字母组成，32-256长度）校验，主要分为两步：

自定义约束注解

```java
@Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER})
@Retention(RUNTIME)
@Documented
@Constraint(validatedBy = {EncryptIdValidator.class})
public @interface EncryptId {

    // 默认错误消息
    String message() default "加密id格式错误";

    // 分组
    Class<?>[] groups() default {};

    // 负载
    Class<? extends Payload>[] payload() default {};
}
```

实现`ConstraintValidator`接口自定义校验器

```java
public class EncryptIdValidator implements ConstraintValidator<EncryptId, String> {

    private static final Pattern PATTERN = Pattern.compile("^[a-f\\d]{32,256}$");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        // 不为null才进行校验
        if (value != null) {
            Matcher matcher = PATTERN.matcher(value);
            return matcher.find();
        }
        return true;
    }
}
```

这样就可以使用@EncryptId进行参数校验了！

2、 校验集合中的指定属性是否存在重复

实现校验注解，功能如注释所示
```java
@Target({ElementType.FIELD, ElementType.PARAMETER})  
@Retention(RetentionPolicy.RUNTIME)  
@Documented  
// 指定校验器
@Constraint(validatedBy = UniqueValidator.class)  
public @interface Unique {  

    // 用于自定义验证信息
    String message() default "字段存在重复";  

    // 指定集合中的待校验字段
    String[] field();  

    // 指定分组
    Class<?>[] groups() default {};  
}
```

实现对应的校验器，主要校验逻辑在 isValid方法：获取集合中指定字段，并组装为 set，比较 set 和集合的长度，以判断集合中指定字段是否存在重复。

```java
// 实现ConstraintValidator<T, R>接口，T为注解的类型，R为注解的字段类型
public class UniqueValidator implements ConstraintValidator<Unique, Collection<?>> {  

    private Unique unique;  

    @Override  
    public void initialize(Unique constraintAnnotation) {  
        this.unique = constraintAnnotation;  
    }  

    @Override  
    public boolean isValid(Collection collection, ConstraintValidatorContext constraintValidatorContext) {
        // 集合为空直接校验通过
        if (collection == null || collection.size() == 0) {  
            return Boolean.TRUE;  
        }  
        // 从集合中获取filed中指定的待校验字段，看是否存在重复
        return Arrays.stream(unique.field())  
        .filter(fieldName -> fieldName != null && !"".equals(fieldName.trim()))  
        .allMatch(fieldName -> {
            // 收集集合collection中字段为fieldName的值，存入set并计算set的元素个数count
            int count = (int) collection.stream()  
                         .filter(Objects::nonNull)  
                         .map(item -> {  
                             Class<?> clazz = item.getClass();  
                             Field field;  
                             try {  
                                 field = clazz.getField(fieldName);  
                                 field.setAccessible(true);  
                                 return field.get(item);  
                             } catch (Exception e) {  
                                 return null;  
                             }  
                         })  
                         .collect(Collectors.collectingAndThen(Collectors.toSet(), Set::size)); 
            // set中元素个数count与集合长度比较，若不相等则说明collection中字段存在重复，校验不通过
            if (count != collection.size()) {  
                return false;  
            }  
            return true;  
        });  
    }  
}
```

### 枚举校验
在后台定义了枚举值来进行状态的流转，也是需要校验的，比如定义了颜色枚举：

```java
public enum Colors {

    RED, YELLOW, BLUE

}
```

希望入参不能超出Colors的范围["RED", "YELLOW", "BLUE"],这就需要实现ConstraintValidator<A extends Annotation, T>接口来定义一个颜色约束了，
其中泛型A为自定义的约束注解，泛型T为入参的类型，这里使用字符串，实现如下：

```java
public class ColorConstraintValidator implements ConstraintValidator<Color, String> {
    private static final Set<String> COLOR_CONSTRAINTS = new HashSet<>();

    @Override
    public void initialize(Color constraintAnnotation) {
        Colors[] value = constraintAnnotation.value();
        List<String> list = Arrays.stream(value)
            .map(Enum::name)
            .collect(Collectors.toList());
        COLOR_CONSTRAINTS.addAll(list);

    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return COLOR_CONSTRAINTS.contains(value);
    }
}
```

然后声明对应的约束注解Color，需要在元注解@Constraint中指明使用上面定义好的处理类ColorConstraintValidator进行校验。

```java
@Constraint(validatedBy = ColorConstraintValidator.class)
@Documented
@Target({ElementType.METHOD, ElementType.FIELD,
        ElementType.ANNOTATION_TYPE, ElementType.CONSTRUCTOR,
        ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Color {
    // 错误提示信息
    String message() default "颜色不符合规格";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    // 约束的类型
    Colors[] value();
}
```

然后来试一下，先对参数进行约束：

```java
@Data
public class Param {
    @Color({Colors.BLUE,Colors.YELLOW})
   private String color;
}
```

接口跟上面几个一样，调用下面的接口将抛出BindException异常

### 编程式校验
上面的示例都是基于注解来实现自动校验的，在某些情况下，可能希望以编程方式调用验证。

1、配置validator

```java
@Configuration  
public class ValidatorConfiguration {  
    @Bean  
    public Validator validator() {  
        ValidatorFactory validatorFactory = Validation.byProvider(HibernateValidator.class)  
        .configure()  
        // 设置是否开启快速失败模式  
        //.failFast(true)  
        .buildValidatorFactory();  
        return validatorFactory.getValidator();  
    }  
}
```

2、获取 validator 并校验

```java
@Autowired
private javax.validation.Validator validator;

// 编程式校验
@PostMapping("/saveWithCodingValidate")
public Result saveWithCodingValidate(@RequestBody UserDTO userDTO) {
    Set<ConstraintViolation<UserDTO>> validate = globalValidator.validate(userDTO, UserDTO.Save.class);
    // 如果校验通过，validate为空；否则，validate包含未校验通过项
    if (validate.isEmpty()) {
        // 校验通过，才会执行业务逻辑处理

    } else {
        for (ConstraintViolation<UserDTO> userDTOConstraintViolation : validate) {
            // 校验失败，做其它逻辑
            System.out.println(userDTOConstraintViolation);
        }
    }
    return Result.ok();
}
```

### 快速失败(Fail Fast)
Spring Validation默认会校验完所有字段，然后才抛出异常。可以通过一些简单的配置，开启Fali Fast模式，一旦校验失败就立即返回。

```java
@Bean
public Validator validator() {
    ValidatorFactory validatorFactory = Validation.byProvider(HibernateValidator.class)
            .configure()
            // 快速失败模式
            .failFast(true)
            .buildValidatorFactory();
    return validatorFactory.getValidator();
}
```

### Dubbo 接口校验
1. 可在@DubboService注解中，设置validation参数为true开启生产者的字段验证

```java
@DubboService(version = "1.0.0", validation="true")
public class DubboApiImpl implements DubboApi {
    
}
```

2. 该方式返回的信息对使用者不友好，可通过 Dubbo 的 filter自定义校验逻辑和返回信息。需要注意的是，在 Dubbo 中有自己的 IOC 实现来控制容器，因此需提供 setter 方法，供 Dubbo 调用。

```java
@Activate(  
    group = {"provider"},  
    value = {"customValidationFilter"},  
    order = 10000  
)  
@Slf4j  
public class CustomValidationFilter implements Filter {  

    private javax.validation.Validator validator;  

    // duubo会调用setter获取bean
    public void setValidator(javax.validation.Validator validator) {  
        this.validator = validator;  
    } 

    public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {  
        if (this.validator != null && !invocation.getMethodName().startsWith("$")) {  
            // 补充字段校验，返回信息的组装以及异常处理
        }  
        return invoker.invoke(invocation);  
    }  
}
```


## 校验结果接收
### BindingResult接收
这种方式需要在Controller层的每个接口方法参数中指定，Validator会将校验的信息自动封装到其中。这也是上面例子中一直用的方式。如下：

```java
@PostMapping("/add")
public String add(@Valid @RequestBody ArticleDTO articleDTO, BindingResult bindingResult){}
```

这种方式的弊端很明显，每个接口方法参数都要声明，同时每个方法都要处理校验信息，显然不现实，舍弃。这种写法不会将异常处理的结果返回给全局异常处理

此种方式还有一个优化的方案：使用AOP，在Controller接口方法执行之前处理BindingResult的消息提示，不过这种方案仍然不推荐使用。

### 统一异常处理接收
如果校验失败，会抛出MethodArgumentNotValidException或者ConstraintViolationException异常。在实际项目开发中，通常会用统一异常处理来返回一个更友好的提示。比如系统要求无论发送什么异常，http的状态码必须返回200，由业务码去区分系统的异常情况。

```java
@RestControllerAdvice
public class CommonExceptionHandler {

    @ExceptionHandler({MethodArgumentNotValidException.class})
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public Result handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        BindingResult bindingResult = ex.getBindingResult();
        StringBuilder sb = new StringBuilder("校验失败:");
        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            sb.append(fieldError.getField()).append("：").append(fieldError.getDefaultMessage()).append(", ");
        }
        String msg = sb.toString();
       return Result.fail(BusinessCode.参数校验失败, msg);
    }

    @ExceptionHandler({ConstraintViolationException.class})
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public Result handleConstraintViolationException(ConstraintViolationException ex) {
        return Result.fail(BusinessCode.参数校验失败, ex.getMessage());
    }
}
```



