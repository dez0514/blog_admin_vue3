
```html
<!-- 简易日历的循环，直接循环数字 -->
<!-- 前面多余的空格，填上个月最后几天 -->
<!-- 此处 today 高亮判断有问题，如果是月初1号，可能两个1号高亮 -->
<div class="day-box" v-for="i in firstDayInWeek">
  <div class="day-txt lastmonth_day">{{ showLastMonthDays - (firstDayInWeek - i) }}</div>
</div>
<!-- 当前月份的天 -->
<div class="day-box" v-for="i in showMonthDays">
  <div :class="['day-txt', (year_show === curYear && month_show === curMonth && i === curDay) ? 'today' : '']">{{ i }}</div>
</div>
<!-- 后面多余的空格填下个月前几天 -->
<div class="day-box" v-for="i in (42 - showMonthDays - firstDayInWeek)">
  <div class="day-txt nextmonth_day">{{ i }}</div>
</div>
```
##### 阳历节日
festival: {
  '1-1': {title: '元旦节'},
  '2-14': {title: '情人节'},
  '5-1': {title: '劳动节'},
  '5-4': {title: '青年节'},
  '6-1': {title: '儿童节'},
  '9-10': {title: '教师节'},
  '10-1': {title: '国庆节'},
  '12-25': {title: '圣诞节'},
  '3-8': {title: '妇女节'},
  '3-12': {title: '植树节'},
  '4-1': {title: '愚人节'},
  '5-12': {title: '护士节'},
  '7-1': {title: '建党节'},
  '8-1': {title: '建军节'},
  '12-24': {title: '平安夜'}
},
##### 农历节日
lFestival: {
  '12-30': {title: '除夕'},
  '1-1': {title: '春节'},
  '1-15': {title: '元宵节'},
  '2-2': {title: '龙抬头'},
  '5-5': {title: '端午节'},
  '7-7': {title: '七夕节'},
  '7-15': {title: '中元节'},
  '8-15': {title: '中秋节'},
  '9-9': {title: '重阳节'},
  '10-1': {title: '寒衣节'},
  '10-15': {title: '下元节'},
  '12-8': {title: '腊八节'},
  '12-23': {title: '北方小年'},
  '12-24': {title: '南方小年'}
}
##### 节气
solarTerm: [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
]
##### 生肖
Animals: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
Animals: ["\u9f20", "\u725b", "\u864e", "\u5154", "\u9f99", "\u86c7", "\u9a6c", "\u7f8a", "\u7334", "\u9e21", "\u72d7", "\u732a"]
##### 天干
Gan: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
Gan: ["\u7532", "\u4e59", "\u4e19", "\u4e01", "\u620a", "\u5df1", "\u5e9a", "\u8f9b", "\u58ec", "\u7678"]
##### 地支
Zhi: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
Zhi: ["\u5b50", "\u4e11", "\u5bc5", "\u536f", "\u8fb0", "\u5df3", "\u5348", "\u672a", "\u7533", "\u9149", "\u620c", "\u4ea5"]
