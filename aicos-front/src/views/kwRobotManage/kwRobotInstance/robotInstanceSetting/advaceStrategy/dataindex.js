export default {
  /* 意图识别配置 */
  "intentClassifySetting": {
    "recommendSize": 10,/* 意图推荐条数限制 */
    "recommendThreshold": 0.15,/* 意图推荐阈值 */
    "threshold": 0.8 /* 意图匹配阈值 */
  },
  /* 流程应答配置 */
  "flowResponseSetting": {
    "answerThreshold": 0.37,/* 基本可信阈值，出话模块应答优先级配置 */
    "priority": 1,/* 优先级，越⼩越⾼ */
    "threshold": 0.7 /* ⾼可信阈值，出话模块应答优先级配置 */
  },
  /* DOC召回设置 */
  "docRecallSetting": {
    "docIds": [ /* ["-1"]搜所有，部分召回放id*/
      "-1"
    ],
    "docList": []
  },
  /* 文本标准化处理 */
  "phraseNormalizeDic": [
    {
      "synonymousPhrases": [
        "吃了个饭",
        "⽤了个餐"
      ],
      "standardPhrase": "吃饭了"
    },
    {
      "synonymousPhrases": [
        "hello",
        "hi",
        "您好"
      ],
      "standardPhrase": "你好"
    },
  ],
  "transfigurationName": "暗影",/* 实例对应的配置的名字 */
  /* Table应答设置 */
  "tableResponseSetting": {
    "answerThreshold": 0.32,/* 基本可信阈值 ，出话模块应答阈值配置*/
    "negativeRegexps": [],/* 不进⼊Table的正则表达式，会话模块拒识配置（正则） */
    "negativeSentences": [],/* 不进⼊Table的问句，会话模块拒识配置（句子） */
    "priority": 2,/* 优先级，越⼩越⾼，出话模块应答优先级配置 */
    "recommendSize": 5,/* 推荐条数限制，出话模块推荐条数 */
    "recommendThreshold": 0.15,/* 推荐阈值置，出话模块推荐阈值 */
    "threshold": 0.7 /* ⾼可信阈值，出话模块应答阈值配置 */
  },
  /* FAQ应答设置 */
  "faqResponseSetting": {
    "answerThreshold": 0.31,/* 基本可信阈值，出话模块应答阈值配置 */
    "negativeRegexps": [],/* 不进⼊FAQ的正则表达式，会话模块拒识配置（正则） */
    "negativeSentences": ['你好','lala'],/* 不进⼊FAQ的问句，会话模块拒识配置（句子） */
    "priority": 3,/* 优先级，越⼩越⾼，出话模块应答优先级配置 */
    "recommendSize": 6,/* 推荐条数限制，出话模块推荐条数 */
    "recommendThreshold": 0.15,/* 推荐阈值，出话模块推荐阈值 */
    "threshold": 0.7 /* ⾼可信阈值，出话模块应答阈值配置 */
  },
  /* FAQ召回设置 */
  "faqRecallSetting": {
    "categoryIds": [ /* ["-1"]搜所有业务分类 */
      "-1"
    ],
    "lookupCategoryDescendants": true,/* 召回⼦孙分类 */
    "byContextWords": true,/* 结合历史问题搜 */
    "byCoreWord": true,/* 提核⼼词搜 */
    "byExtSynonymWord": true,/* 扩展同义词搜 */
    "byKeywords": true,/* 提关键词搜 */
    "byPinyin": true,/* ⽤拼⾳搜 */
    "searchRatioInIntent": 0.2 /* 识别意图下知识召回比例 */
  },
  /* Table召回设置 tableCategoryIds对应的是表格的分类id*/
  "tableRecallSetting": {
    "tableCategoryIds": [ /* ["-1"]搜所有 */
      "-1"
    ]
  },
  "priorityOrConfidenceFirst": "confidence",/* 应答优先策略 */
  /* 未知回复配置 */
  "unknownQuestionReplies": [
    "您的问题我还不知道怎么回答。",
    "你的问题超出我的知识范围了。"
  ],
  /* Doc应答设置 */
  "docResponseSetting": {
    "answerThreshold": 0.33,/* 基本可信阈值，出话模块应答阈值配置 */
    "negativeRegexps": [],/* 不进⼊Doc的正则表达式，会话模块拒识配置（正则） */
    "negativeSentences": [],/* 不进⼊Doc的问句 ，会话模块拒识配置（句子）*/
    "priority": 4,/* 优先级，越⼩越⾼ ，出话模块应答优先级配置*/
    "recommendSize": 10,/* 推荐条数限制，出话模块推荐条数 */
    "recommendThreshold": 0.55,/* 推荐阈值，出话模块推荐阈值 */
    "threshold": 0.7 /* ⾼可信阈值，出话模块应答阈值配置 */
  },
  /* 系统意图设置 */
  "systemIntentSetting": {
    "pipeline": [
      {
        "config": {
          "threshold": 0.75 /* 匹配阈值 */
        },
        "name": "AskRobotRepeat",
        /* 重述 (系统意图排除问法)*/
        "negativeSentences": [ /* 例外句⼦ */
          "不听了",
          "不看了",
          "不了解",
          "不清楚",
          "不明⽩",
          "不想听了",
          "别说了",
          "再说也没⽤",
          "听清楚了"
        ],
        "positiveSentences": [ /* 命中则重述 (系统意图用户问法) */
          "没有听清",
          "听不清楚",
          "没听懂",
          "你的意思是",
          "再讲⼀遍",
          "再说⼀遍",
          "刚才说什么",
          "刚才没有听清",
          "没听清，再说⼀遍",
          "说的什么意思",
          "再说⼀次",
          "没听清楚",
          "不明⽩什么意思"
        ]
      }
    ]
  }
}
