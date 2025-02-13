export default {
  regx: {
    // 仅字母
    onlyChar: "Only letters can be entered",
    onlyNumber: "Only numbers can be entered",
    // 只允许字母和下划线
    charUnderline: "Only letters and underscores allowed",
    // 只允许输入字母，数字，汉字，下划线
    charNumHanUnderline: "Only letters, numbers, Chinese characters, and underscores are allowed to be entered",
    // 只允许输入字母，数字，汉字
    charNumHan: "Only allow input of letters, numbers, and Chinese characters",
    // 只允许输入字母，数字，汉字，空格
    charNumHanS: "Only letters, numbers, Chinese characters, and spaces are allowed to be entered",
    // 只允许输入字母，数字，汉字，空格
    charNumHanSEnter: "Only letters, numbers, Chinese characters, carriage returns, and spaces are allowed to be entered",
    // 只允许输入字母，数字，汉字，空格,>
    charNumHanSEnterGt: "Only letters, numbers, Chinese characters, carriage returns, spaces allowed,>",
    // 只允许数字和字母
    charNum: "Only numbers and letters allowed",
    // 只允许数字和字母中横线或下划线
    charNumLine: "Only letters, numbers, underscores, and dashes are allowed",
    // 只允许数字和字母
    charNumLineStartWidthChar:
      "Only letters and underscores are allowed to start, and the input content can only contain letters, numbers, underscores, and horizontal lines",
    // 只允许输入字母，汉字
    charHan: "Only letters and Chinese characters are allowed to be input",
    // 只允许输入字母，数字，汉字，逗号，句号，问号，空格，中文顿号，中文分号，中文叹号
    charNumHanCommaStop:'Only letters, numbers, Chinese characters, commas, periods, question marks, Spaces, Chinese stops, Chinese semicolons, Chinese exclamation marks are allowed',
    // 只允许输入字母，数字，汉字，||，空格
    charNumHanSeparator:'Only letters, numbers, Chinese characters, ||, and Spaces are allowed',
    // 只允许数字和下划线
    numUnderline: "Only numbers and underscores allowed",
    // 数字、字母（区分大小写）、特殊字符
    numCharSpecial: "Only numbers, letters, and special English characters are allowed",
    // 必须同时包含数字、字母（区分大小写）、特殊字符
    mustNumCharSpecial: "Must contain both numbers, letters, and special characters",
    // 不能输入<>
    expectSpecials: "Special characters cannot be entered",
    phone: "Please input the correct phone number",
    mobile: "Please input the correct phone number",
    // 同时校验手机和电话
    tel: "Please input the correct phone number",
    size: "Value is the number 'px' or '%'",
    ipv4: "Please input the correct IPV4 address",
    ipv6: "Please input the correct IPV6 address",
    ip: "Please input the correct IP address",
    oneHundred: "Please input a number between 0 and 100",
    oneHundredInteger: "Please input an integer between 0 and 100",
    // 正整数
    positiveInteger: "Please input an integer",
    // 正小数
    positiveDecimal: "Please input decimals",
    // 0到1的两位小数
    positiveDecimalTow: "Please input decimals between 0.01 and 1.0",
    // 不超过50字符
    lenghMax: "The length cannot exceed 50 characters",
    lenghHundredMax: "The length cannot exceed 100 characters",
    charNumHanEnter: "Only letters, numbers, Chinese characters, carriage returns, slashes allowed",
    charNumHanEnt: "Only letters, numbers, Chinese characters, and carriage returns are allowed",
    charNumHanEnterComma: "Only letters, numbers, Chinese characters, carriage returns, commas allowed",
    charNumHanEnterCommaStop: "Only letters, numbers, Chinese characters, carriage returns, commas, and periods are allowed",
    notchar: "Only allow input of letters, numbers, and Chinese characters",
    zeroToOneDecimal: "Please input a decimal or integer between 0 and 1",
    // 只允许数字和字母
    // 只允许字母和下划线
    // charUnderline:/^[a-zA-Z_]+$/,
    // // 只允许字母和下划线
    // charUnderline:/^[a-zA-Z_]+$/,
    // // 只允许字母和下划线
    // charUnderline:/^[a-zA-Z_]+$/,

    notEnSpecials: "English special characters are not allowed",
    isHttpUrl: "Not a standard browser URL address",
    isEmail: "Please input the correct email address",
    isQQ: "Please input QQ account",
    isFax: "Please input a Fax",
  }
}