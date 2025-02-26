// @ts-ignore
import { defineUserConfig } from "vuepress";

// @ts-ignore
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "程序员一博",
  description: "java编程记录",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
