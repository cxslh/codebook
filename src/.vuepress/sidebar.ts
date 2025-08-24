// @ts-ignore
import {sidebar} from "vuepress-theme-hope";

export default sidebar(
    {
        /*更新日志*/
        "/log/": "structure",
        /*java*/
            "/java/utils/": "structure",
            "/java/javabase/": "structure",
            "/java/devnotes/": "structure",
        /*框架*/
            "/javaframework/mybatis": "structure",
            "/javaframework/spring": "structure",
            "/javaframework/springboot": "structure",
            "/javaframework/springmvc": "structure",

        /*微服务*/
            "/service/": "structure",

        /*分布式*/
            "/cluster/": "structure",
        /*架构*/
            "/framework/": "structure",

        /*数据库*/
            "/db/mysql": "structure",
            "/db/redis": "structure",
        /*工具*/
            "/codetool/": "structure",
        /*其他*/
            "/other/": "structure",
    });
