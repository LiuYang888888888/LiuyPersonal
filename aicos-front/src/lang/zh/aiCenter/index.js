import notionalWords from "./notionalWords"
import properWords from "./properWords"
import synonym from "./synonym"
import sensitiveWords from "./sensitiveWords"
import pinyin from "./pinyin"
import weight from "./weight"
import occurrence from "./occurrence"
import priority from "./priority"
import participle from "./participle"
import variable from "./variable"
import plug from "./plug"

export default {
  aiCenter: {
    ...notionalWords,
    ...properWords,
    ...synonym,
    ...sensitiveWords,
    ...pinyin,
    ...weight,
    ...occurrence,
    ...priority,
    ...participle,
    ...variable,
    ...plug
  }
}