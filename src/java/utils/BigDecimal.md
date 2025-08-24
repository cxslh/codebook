---
title: BigDecimalUtil
headerDepth: 4
order: 2
---

```java
import java.math.BigDecimal;
/**
 * BigDecimalUtil 小数处理工具类, 所有方法默认四舍五入
 */
public class BigDecimalUtil {


	/**
     * BigDecimal 相加
     *
     * @param v1 加放
     * @param v2 被加方
     */
	public static BigDecimal add(BigDecimal v1, BigDecimal v2) {
		if (v1 == null) {
			v1 = new BigDecimal("0");
		}
		if (v2 == null) {
			v2 = new BigDecimal("0");
		}
		return v1.add(v2);
	}


	/**
     * BigDecimal 相减
     *
     * @param v1 减方
     * @param v2 被减方
     */
	public static BigDecimal subtract(BigDecimal v1, BigDecimal v2) {
		if (v1 == null) {
			v1 = new BigDecimal("0");
		}
		if (v2 == null) {
			v2 = new BigDecimal("0");
		}
		return v1.subtract(v2);
	}


	/**
     * BigDecimal 相乘
     *
     * @param v1 乘方
     * @param v2 被乘方
     */
	public static BigDecimal multiply(BigDecimal v1, BigDecimal v2) {
		if (v1 == null) {
			v1 = new BigDecimal("0");
		}
		if (v2 == null) {
			v2 = new BigDecimal("0");
		}
		return v1.multiply(v2);
	}


	/**
     * BigDecimal 相除
     *
     * @param v1 除方
     * @param v2 被除方
     */
	public static BigDecimal divide(BigDecimal v1, BigDecimal v2) {
		if (v1 == null) {
			v1 = new BigDecimal("0");
		}
		if (v2 == null) {
			v2 = new BigDecimal("0");
		}
		return v1.divide(v2, 9, BigDecimal.ROUND_HALF_UP);
	}


	/**
     * 传入值乘100(一般用于rmb单位 元 转 分)
     */
	public static BigDecimal multiply100(BigDecimal v1) {
		if (v1 == null) {
			v1 = new BigDecimal("0");
		}
		return v1.multiply(new BigDecimal("100"));
	}


	/**
     * 传入值除100 (一般用于rmb单位 分 转 元)
     */
	public static BigDecimal divide100(BigDecimal v1) {
		if (v1 == null) {
			v1 = new BigDecimal("0");
		}
		return v1.divide(new BigDecimal("100"), 2, BigDecimal.ROUND_HALF_UP);
	}


	/**
     * 四舍五入保留两位小数 ( HALF_UP 5向上取，HALF_DOWN 5向下取)
     */
	public static BigDecimal parse(BigDecimal bg) {
		return parse(bg, 2);
	}


	public static BigDecimal parse(BigDecimal bg, Integer scale) {
		return bg.setScale(scale, BigDecimal.ROUND_HALF_UP);

	}

	/**
     * 上升 ===> 舍弃指定位数后的小数, （ CEILING= 天花板） ==> 舍弃后小数的最后一位只要 >0 就加1
     */
	public static BigDecimal parseUp(BigDecimal bg) {
		return parseUp(bg, 2);
	}


	public static BigDecimal parseUp(BigDecimal bg, Integer scale) {
		return bg.setScale(scale, BigDecimal.ROUND_CEILING);
	}

	/**
     * 舍弃 ===> 直接舍弃指定位数后的小数 （FLOOR = 地板） ==>  直接舍弃指定位数后的小数
     */
	public static BigDecimal parseDown(BigDecimal bg) {
		return parseDown(bg, 2);
	}

	public static BigDecimal parseDown(BigDecimal bg, Integer scale) {
		return bg.setScale(scale, BigDecimal.ROUND_FLOOR);
	}


	/**
     * 测试方法
     */
	public static void main(String[] args) {
		//============================================== 加法 ==============================================================
		// 加法
		System.out.println(("四舍五入 1.50 + 1.504 = " + parse(add(new BigDecimal("1.50"), new BigDecimal("1.504")))));
		System.out.println(("四舍五入 1.50 + 1.505 = " + parse(add(new BigDecimal("1.50"), new BigDecimal("1.505")))));
		System.out.println(("天花板 1.50 + 1.501 = " + parseUp(add(new BigDecimal("1.50"), new BigDecimal("1.501")))));
		System.out.println(("地板  1.50 + 1.509 = " + parseDown(add(new BigDecimal("1.50"), new BigDecimal("1.509")))));
		System.out.println(("减法 100.09999999999998-0.81= " + parse(subtract(new BigDecimal("100.09999999999998"), new BigDecimal("0.81")))));
	}
}


```