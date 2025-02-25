// @ts-ignore
import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",
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
                link: "/java/base/README.md",
            },
        ],
    },
    {
        text: "数据库",
        link: "/db/",
    },
    {
        text: "编程之外",
        icon: "info",
        link: "/other/",
    }
]);
