// @ts-ignore
import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",{
        text: "更新日志",
        link: "/log/2025.md",
    },{
        text: "java",
        prefix: "/java/",
        children: [
            {
                text: "java基础",
                link: "/java/javabase/installjdk.md",
            },
            {
                text: "工具类",
                link: "/java/utils/str.md",
            },
            {
                text: "开发场景",
                link: "/java/devnotes/codetime.md",
            },
        ],
    },{
        text: "框架",
        prefix: "/javaframework/",
        children: [
            {
                text: "spring",
                link: "/javaframework/spring/README.md",
            },
            {
                text: "springmvc",
                link: "/javaframework/springmvc/README.md",
            },
            {
                text: "mybatis",
                link: "/javaframework/mybatis/README.md",
            },
            {
                text: "springboot",
                link: "/javaframework/springboot/README.md",
            },
        ],
    },{
        text: "微服务",
        link: "/service/",
    },{
        text: "分布式|中间件",
        link: "/cluster/",
    },{
        text: "架构",
        link: "/framework/",
    },
    {
        text: "数据库",
        prefix: "/db/",
        children: [
            {
                text: "Mysql",
                link: "/db/mysql/",
            },
            {
                text: "Redis",
                link: "/db/redis/",
            }
        ]
    },{
        text: "工具",
        link: "/codetool/README.md"
    },
    {
        text: "编程之外",
        link: "/other/",
    }
]);
