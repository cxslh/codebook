// @ts-ignore
import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",{
        text: "编程导航",
        icon: "link",
        link: "/nav/",
    },
    {
        text: "java",
        prefix: "/java/",
        children: [
            {
                text: "基础",
                link: "/java/base/README.md",
            },
            {
                text: "面向对象",
                link: "/java/oop/README.md",
            }, {
                text: "-框架",
                prefix: "fremwork/",
                children: [
                    {
                        text: "spring",
                        link: "/java/fremwork/spring/README.md",
                    },
                    {
                        text: "springMvc",
                        link: "/java/fremwork/springMvc/README.md",
                    },
                    {
                        text: "mybatis",
                        link: "/java/fremwork/mybatis/README.md",
                    },
                    {
                        text: "springBoot",
                        link: "/java/fremwork/springBoot/README.md",
                    },
                ],
            },
        ],
    },
    {
        text: "数据库",
        link: "/db/",
    },
    {
        text: "python",
        link: "/python/",
    },
    {
        text: "go",
        link: "/go/",
    },
    {
        text: "前端",
        link: "/html/",
    },{
        text: "架构",
        link: "/html/",
    },
    {
        text: "编程之外",
        link: "/other/",
    }
]);
