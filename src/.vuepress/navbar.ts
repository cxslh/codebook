// @ts-ignore
import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",{
        text: "编程导航",
        icon: "link",
        link: "/nav/",
    },{
        text: "java基础",
        link: "/javabase/README.md",
    },{
        text: "java进阶",
        link: "/javaoop/README.md",
    },{
        text: "javaweb",
        link: "/javaweb/README.md",
    },{
        text: "框架",
        prefix: "javaframework/",
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
        link: "/db/",
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
        link: "/codetool/",
    },
    {
        text: "编程之外",
        link: "/other/",
    }
]);
