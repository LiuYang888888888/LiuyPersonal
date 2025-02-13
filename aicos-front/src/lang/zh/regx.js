export default {
  regx: {
    // 仅字母
    onlyChar: "只能输入字母",
    onlyNumber: "只能输入数字",
    // 只允许字母和下划线
    charUnderline: "只允许字母和下划线",
    // 只允许输入字母，数字，汉字，下划线
    charNumHanUnderline: "只允许输入字母，数字，汉字，下划线",
    // 只允许输入字母，数字，汉字
    charNumHan: "只允许输入字母，数字，汉字",
    // 只允许输入字母，数字，汉字，空格
    charNumHanS: "只允许输入字母，数字，汉字，空格",
    // 只允许输入字母，数字，汉字，空格
    charNumHanSEnter: "只允许输入字母，数字，汉字，回车，空格",
    // 只允许输入字母，数字，汉字，空格,>
    charNumHanSEnterGt: "只允许输入字母，数字，汉字，回车，空格，>",
    // 只允许数字和字母
    charNum: "只允许数字和字母",
    // 只允许数字和字母中横线或下划线
    charNumLine: "只允许字母、数字、下划线和中横线",
    // 只允许数字和字母
    charNumLineStartWidthChar:
      "只允许字母、下划线开头，输入内容只能包含字母、数字、下划线和中横线",
    // 只允许输入字母，汉字
    charHan: "只允许输入字母，汉字",
    // 只允许输入字母，数字，汉字,逗号,句号,问号,空格,顿号,分号,叹号
    charNumHanCommaStop:'只允许输入字母，数字，汉字，逗号，句号，问号，空格，中文顿号，中文分号，中文叹号',
    // 只允许输入字母，数字，汉字,||，空格
    charNumHanSeparator:'只允许输入字母，数字，汉字，||，空格',
    // 只允许数字和下划线
    numUnderline: "只允许数字和下划线",
    // 数字、字母（区分大小写）、特殊字符
    numCharSpecial: "只允许数字、字母、英文特殊字符",
    // 必须同时包含数字、字母（区分大小写）、特殊字符
    mustNumCharSpecial: "必须同时包含数字、字母、特殊字符",
    // 不能输入<>
    expectSpecials: "不能输入特殊字符",
    phone: "请输入正确的电话号码",
    mobile: "请输入正确的手机号码",
    // 同时校验手机和电话
    tel: "请输入正确的电话号码",
    size: "值为数字加px或%",
    ipv4: "请输入正确的ipv4地址",
    ipv6: "请输入正确的ipv6地址",
    ip: "请输入正确的ip地址",
    oneHundred: "请输入0-100的数字",
    oneHundredInteger: "请输入0-100的整数",
    // 正整数
    positiveInteger: "请输入整数",
    // 正小数
    positiveDecimal: "请输入小数",
    // 0到1的两位小数
    positiveDecimalTow: "请输入 0.01 到 1.0 之间的小数",
    // 不超过50字符
    lenghMax: "长度不能超过50字符",
    lenghHundredMax: "长度不能超过100字符",
    charNumHanEnter: "只允许输入字母，数字，汉字,回车，斜杠",
    charNumHanEnt: "只允许输入字母，数字，汉字,回车",
    charNumHanEnterComma: "只允许输入字母，数字，汉字，回车，逗号",
    charNumHanEnterCommaStop: "只允许输入字母，数字，汉字,回车，逗号，句号",
    notchar: "只允许输入字母，数字，汉字",
    zeroToOneDecimal: "请输入0到1之间的小数或整数",
    // 只允许数字和字母
    // 只允许字母和下划线
    // charUnderline:/^[a-zA-Z_]+$/,
    // // 只允许字母和下划线
    // charUnderline:/^[a-zA-Z_]+$/,
    // // 只允许字母和下划线
    // charUnderline:/^[a-zA-Z_]+$/,

    notEnSpecials: "不允许英文特殊字符",
    isHttpUrl: "不是标准的浏览器url地址",
    isEmail: "请输入正确的电子邮箱",
    isQQ: "请输入正确的QQ号",
    isFax: "请输入正确的传真",
  }
};
