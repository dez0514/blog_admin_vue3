<template>
  <div class="calendar-container">
    <div class="calendar-btns">
      <div class="btns-wrap">
        <div class="btn prev left-radius" title="previous month" @click="goPrevMonth">&lt;</div>
        <div class="btn next right-radius" title="next month" @click="goNextMonth">&gt;</div>
        <div class="btn today" title="this month" @click="goToday">today</div>
      </div>
      <div class="calendar-title">{{ monthNameArr[month_show] + ' ' + year_show + '.' + (month_show + 1)}}</div>
      <div class="btns-wrap">
        <div class="btn month left-radius active">month</div>
        <div class="btn week">week</div>
        <div class="btn day">day</div>
        <div class="btn list right-radius">list</div>
      </div>
    </div>
    <div class="calendar-wrapper">
      <div class="week-box">
        <div class="column-item" v-for="i in 7">{{ weekDays[i - 1] }}</div>
      </div>
      <div class="calendar-box">
        <div v-for="(item, index) in calendarList" :key="index" 
          :class="['day-box', curSelectDate?.year === item.year && curSelectDate?.month === item.month && curSelectDate?.day === item.day ? 'select-day' : '']"
          @click="handleClickDay(item)"
        >
          <div :class="['day-txt', (item.year === curYear && item.month === curMonth && item.day === curDay) ? 'today' : '']">
            {{ item.day }}
          </div>
          <div class="festival">{{ item.festival }}</div>
          <div class="solarterm">{{ item.solarTerm }}</div>
        </div>
        <div class="range-color-box" v-for="(item, index) in rangeColorList" :key="index" :style="{width: item.width, left: item.left, top: item.top}"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
// 1.获取当前年当前月份(需要获取天数)。
// 2.31天:1,3,5,7,8,10,12月。30天: 4,6,9,11月。2月平月28，闰月29。
// 3.判断闰年(1.能被4整除但不能被100整除的年份。2.能被400整除) 
// 4.判断当前年当前月份的第一天是周几。
// 5.获取上一月天数（处理到前面的空格)
// 6.把数字循环改成对象数组循环。考虑展示：假期，节气，节日，农历日期。
// 7.添加日程事件，面板切换。
import { ref, computed } from "vue"
import { weekDays, monthNameArr, festivals, animals, cyclical, getSolarTerm } from './util'
interface calendarItem {
  year: number;
  month: number; // 0-11
  day: number;
  festival?: string;
  solarTerm?: string;
  location: number
}
// 先获取当前年月日再说
const curYear = new Date().getFullYear()
const curMonth = new Date().getMonth() // 0 - 11
const curDay = new Date().getDate()
// 面板显示的年月日，默认为当前
const year_show = ref<number>(curYear)
const month_show = ref<number>(curMonth)
const day_show = ref<number>(curDay)
const curSelectDate = ref<calendarItem | null>(null) // 点击选中日期
const monthDayNumList = computed(() => { // 所有月份的天数，一定别写错。。
  return [31, 28 + isLeapYear(year_show.value), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
})
// 面板显示的(年)月份的总天数
const showMonthDays = computed(() => {
  return monthDayNumList.value[month_show.value]
})
// 面板显示的(年)月份的前一个的的总天数，用来补充当前月前面的空格
const showLastMonthDays = computed(() => {
  // 这里不需要考虑向前跨年是闰年判断，如果当前月是1月，上一年12月还是31天
  console.log('month_show.value==', month_show.value)
  if(month_show.value === 0) {
    return monthDayNumList.value[11]
  } else {
    return monthDayNumList.value[month_show.value - 1]
  }
})
// 面板显示的(年)月份的第一天是周几, 0-6: 0表示周日，1-6指周一到周六
const firstDayInWeek = computed(() => {
  return new Date(year_show.value + '-' + (month_show.value + 1) + '-' + 1).getDay()
})
// 最后循环的列表
const calendarList = computed(() => {
  // 根据showLastMonthDays, firstDayInWeek, showMonthDays 处理这个数组，表示每天的信息
  let list: calendarItem[] = []
  const festivalKeyArr = Object.keys(festivals)
  // 前面格子的
  const lastMonthNearDays: calendarItem[] = new Array(firstDayInWeek.value).fill(0).map((item, index) => {
    console.log('index==', index)
    const dayNum = showLastMonthDays.value - firstDayInWeek.value + (index + 1)
    // 此处的月份是要用上一个月，需要减1，但是festival是按照月份1-12来的写key, month_show 是0-11取值所以匹配时还得加1。
    const monthDayStr: string =  month_show.value + '-' + dayNum
    const year_num = month_show.value === 0 ? year_show.value - 1 : year_show.value
    return {
      year: year_num,
      month: month_show.value - 1,
      day: dayNum,
      festival: festivalKeyArr.includes(monthDayStr) ? (festivals as any)[monthDayStr] : '',
      animal: animals[(year_num - 4) % 12],
      lunarYearCn: cyclical(year_num - 1900 + 36),
      solarTerm: getSolarTerm(year_num, month_show.value - 1, dayNum),
      location: index // 格子的位置0-41
    }
  })
  // 本月的格子
  const monthDaysList: calendarItem[] = new Array(showMonthDays.value).fill(0).map((item, index) => {
    const monthDayStr: string =  (month_show.value + 1) + '-' + (index + 1)
    return {
      year: year_show.value,
      month: month_show.value,
      day: index + 1,
      festival: festivalKeyArr.includes(monthDayStr) ? (festivals as any)[monthDayStr] : '',
      animal: animals[(year_show.value - 4) % 12],
      lunarYearCn: cyclical(year_show.value - 1900 + 36),
      solarTerm: getSolarTerm(year_show.value, month_show.value, index + 1),
      location: index + firstDayInWeek.value
    }
  })
  // 后面填满42个格子，表示下个月的前几天，从1开始往后递增就行
  const nextMonthNearDays: calendarItem[] = new Array(42 - showMonthDays.value - firstDayInWeek.value).fill(0).map((item, index) => {
    const monthDayStr: string =  (month_show.value + 2) + '-' + (index + 1)
    const year_num = month_show.value === 11 ? year_show.value + 1 : year_show.value
    return {
      year: year_num,
      month: month_show.value + 1,
      day: index + 1,
      festival: festivalKeyArr.includes(monthDayStr) ? (festivals as any)[monthDayStr] : '',
      animal: animals[(year_num - 4) % 12],
      lunarYearCn: cyclical(year_num - 1900 + 36),
      solarTerm: getSolarTerm(year_num, month_show.value + 1, index + 1),
      location: index + firstDayInWeek.value + showMonthDays.value
    }
  })
  list = [...lastMonthNearDays, ...monthDaysList, ...nextMonthNearDays]
  console.log('cur calendar===', list)
  return list
})
console.log(curYear, curMonth, curDay)
// 是否闰年， 返回闰年多的天数
const isLeapYear = (year: number) => {
  return ((year % 4 === 0 && year % 100 === 0) || year % 400 === 0) ? 1 : 0
}
const goPrevMonth = () => {
  if (month_show.value === 0) {
    month_show.value = 11
    year_show.value--
  } else {
    month_show.value--
  }
}
const goNextMonth = () => {
  if (month_show.value === 11) {
    month_show.value = 0
    year_show.value++
  } else {
    month_show.value++
  }
}
const goToday = () => {
  year_show.value = curYear
  month_show.value = curMonth
  day_show.value = curDay
  const todayItem = calendarList.value.find(item => item.year === curYear && item.month === curMonth && item.day === curDay)
  if (typeof todayItem !== 'undefined') {
    curSelectDate.value = todayItem
  }
}
const handleClickDay = (item: calendarItem) => {
  console.log(item)
  if (item.month !== month_show.value) {
    month_show.value = item.month
  }
  // 点击选中给样式
  curSelectDate.value = item
}
//思路：根据连续假期日期范围，处理成一个个div定位, 一条连续日期可能处理成多条（跨几行就几条），计算位置，标注起点和结束点。
// 注意判断是不是当前面板的连续日期
// 最终处理成下面的数组。1. 每个格子的日期标个location。2.计算处理 left,top,width
// 1. 一个判断连续日期是否跨行的方法
// 2. 一个用来计算 日期位于第几个格子，第几行第几列
// 存在一部分在当前面板 一部分不在的情况，显示在的那一部分
const rangeColorList = [
  {
    // date: '20221001-20221007', // 日期信息
    left: '10px', // 从第三个开始： n*100%/7 ,起点+10, 非起点不加
    top: '30px', // 第n行：n*格子高度100+30
    width: 'calc(4*100%/7 - 20px)', // 跨n个格子，起点-10， 结束-10
  },
  {
    left: 'calc(3*100%/7 + 10px)', // 从第三个开始
    top: '130px', 
    width: 'calc(4*100%/7 - 10px)' // 未结束
  },
  {
    left: '0px', // 接上一行，非起点
    top: '230px', 
    width: 'calc(2*100%/7 - 10px)' //跨2个格子 结束-10
  }
]
const getRangeDateToColorList = () => {
  // 得找到各个范围内所有天数日期
  const rangeList = [
    { dateRange: '2022.10.01-2022.10.07', title: '国庆7天乐' },
    { dateRange: '2022.05.01-2022.05.05', title: '五一黄金周' }
  ]
  const temp = []
  rangeList.forEach((item) => {
    const dateArr = item.dateRange.split('-').filter(inner => inner !== '')
    if(dateArr.length > 0) {
      const obj = {
        dateRange: item.dateRange,
        title: item.title,
        startDate: dateArr[0],
        endDate: dateArr.length > 1 ? dateArr[1] : dateArr[0],
        left: '',
        top: '',
        width: ''
      }
      temp.push(obj)
    }
  })
}
// 获取范围内的日期
const getRangeDayList = (rangeStr: string) => {
  // rangeStr = '2022.10.01-2022.10.07'
  const [start, end] = rangeStr.split('-')
  const startTime = new Date(start).getTime()
  const endTime = new Date(end).getTime()
  const timeDiff = startTime  - endTime
  let arr = []
  for(let i=0; i <= timeDiff; i += 86400000){
    const tDate = new Date(startTime+i)
    arr.push(tDate.getFullYear() + '.' + (tDate.getMonth() + 1) + '.' + tDate.getDate()) // 天拼不拼0无所谓，下面用的时候会Number掉
  }
  return arr
}
// 获取日期行列号
const getDateLocRowAndColumn = (date: string) => { // 没有年份的 固定假期暂时不考虑 到时候拼接 面板年份
  // date = '2022.10.01' // 去当前面板里查询 // 如果日期不在当前面板就不显示 location= -1 // 注意 month + 1
  const dateArr = date.split('.')
  if(dateArr.length < 3) return { row: -1, column: -1 } // 日期一定是年月日，否则当没有
  const fitem = calendarList.value.find(item => item.year === Number(dateArr[0]) && item.month + 1 === Number(dateArr[1]) && item.day === Number(dateArr[2]))
  if(typeof fitem !== 'undefined') {
    const row = fitem.location/7
    const column = fitem.location%7
    return { row, column }
  } else {
    return { row: -1, column: -1 }
  }
}
</script>
<style lang="scss" scoped>
$white: #fff;
$yellow: #fac863;
$shadow: rgba(0, 0, 0, 0.1);
$border: #ddd;
$primary: #1890ff;
$btnhover: rgba(24, 144, 255, .8);
$btnactive: #183fff;
$today: #ff0000;
$festival: rgba(76, 175, 80, .2);
$festivalcolor: #539156;
$solarterm: rgba(156, 39, 176, .2);
$solartermcolor: #9c27b0;
$selectday: rgba(24, 144, 255, .07);
$holiday: pink;
.calendar-container {
  box-sizing: border-box;
  padding: 20px;
  width: 1200px;
  background-color: #fff;
  border-top: 4px solid $yellow;
  box-shadow: 0 1px 2px 0 $shadow;
}
.calendar-btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btns-wrap {
  display: flex;
  align-items: center;
}
.calendar-title {
  flex: 1;
  padding: 0 20px;
  text-align: center;
  font-size: 24px;
}
.btn {
  height: 36px;
  line-height: 36px;
  padding: 0 14px;
  background: $primary;
  color: $white;
  cursor: pointer;
  &:hover {
    background: $btnhover;
  }
  &.left-radius {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  &.right-radius {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  &.prev, &.next {
    font-weight: 600;
  }
  &.today {
    margin-left: 5px;
    border-radius: 4px;
  }
  &.active {
    background-color: $btnactive;
  }
}
.calendar-wrapper {
  margin-top: 20px;
}
.week-box {
  display: grid;
  grid-template-columns: repeat(7, calc(100%/7));
  gap: 0;
  border-top: 1px solid $border;
  border-left: 1px solid $border;
  .column-item {
    position: relative;
    box-sizing: border-box;
    padding: 4px;
    text-align: center;
    border-right: 1px solid $border;
  }
}
.calendar-box {
  @extend .week-box;
  position: relative;
  .day-box {
    @extend .column-item;
    border-bottom: 1px solid $border;
    height: 100px;
    padding-top: 30px;
    cursor: pointer;
    .festival {
      box-sizing: border-box;
      padding: 0 5px;
      text-align: left;
      background-color: $festival;
      color: $festivalcolor;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      line-height: 24px;
    }
    .solarterm {
      @extend .festival;
      background-color: $solarterm;
      color: $solartermcolor;
    }
    &.select-day {
      background-color: $selectday;
    }
  }
  .day-txt {
    position: absolute;
    top: 2px;
    right: 2px;
    border-radius: 50%;
    height: 28px;
    line-height: 28px;
    width: 28px;
    text-align: center;
    &.lastmonth_day, &.nextmonth_day {
      opacity: .5;
    }
    &.today {
      background: $today;
      color: $white;
    }
  }
}
.range-color-box {
  position: absolute;
  height: 30px;
  background-color: $holiday;
  color: $white;
}
</style>