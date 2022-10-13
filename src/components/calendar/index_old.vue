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
        <div v-for="(item, index) in calendarBoxList" :key="index" 
          :class="['day-box', curSelectDate?.year === item.year && curSelectDate?.month === item.month && curSelectDate?.day === item.day ? 'select-day' : '']"
          @click="handleClickDay(item)"
        >
          <div :class="['day-txt', (item.year === curYear && item.month === curMonth && item.day === curDay) ? 'today' : '']">
            {{ item.day }}
          </div>
          <div class="festival">{{ item.festival }}</div>
          <div class="solarterm">{{ item.solarTerm }}</div>
          <div :class="['color-box', item.isholyStart ? 'start' : '', item.isholyEnd ? 'end' : '']" :style="{background: item.color}" v-if="item.isholiday">
            {{ item.isholyStart ? item.title : '' }}
          </div>
        </div>
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
import { ref, computed, onMounted } from "vue"
import { weekDays, monthNameArr, festivals, animals, cyclical, getSolarTerm } from './util'
interface calendarItem {
  year: number;
  month: number; // 0-11
  day: number;
  festival?: string;
  solarTerm?: string;
  location?: number
}
interface rcItem {
  row: number;
  column: number;
  date: string;
}
interface rowItem {
  column: number;
  date: string;
}
interface classRow {
  [key: number | string]: rowItem[]
}
interface rangeItem {
  dateRange: string;
  title: string;
  range?: Array<string>;
  rows?: classRow;
  startDate?: string;
  endDate?: string;
  left?: string;
  top?: string;
  width?: string;
  color?: string;
  nums?: number;
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
const rangeColorList = ref<rangeItem[]>([
  { dateRange: '2022.06.24-2022.06.28', title: 'test一半在上个月的面板一半在当前面板', color: 'pink' }, // 由于存在 -1 无法判断是否为开始点，顺带分类顺序一乱导致无法判断结束点
  { dateRange: '2022.07.04-2022.07.06', title: 'test单行', color: '#00cfff' },
  { dateRange: '2022.07.08-2022.07.11', title: 'test垮了两行', color: 'blue' },
  { dateRange: '2022.07.22-2022.07.22', title: 'test单个日期', color: 'red' },
  { dateRange: '2022.08.04-2022.08.08', title: 'test一半在当前面板一半在下个面板', color: 'green' } // 也是 -1 问题 // 思路：前后定义第-1行和第7行，用来判断 前后是不是开始或者结束点，计算location时增加麻烦。。
]) // 连续假期 年月日-年月日
const calendarBoxList: any = ref([])
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
      solarTerm: getSolarTerm(year_num, month_show.value - 1, dayNum)
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
      solarTerm: getSolarTerm(year_show.value, month_show.value, index + 1)
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
      solarTerm: getSolarTerm(year_num, month_show.value + 1, index + 1)
    }
  })
  list = [...lastMonthNearDays, ...monthDaysList, ...nextMonthNearDays]
  console.log('cur calendar===', list)
  calendarBoxList.value = list // 先用这个循环
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
  getRangeDateList()
}
const goNextMonth = () => {
  if (month_show.value === 11) {
    month_show.value = 0
    year_show.value++
  } else {
    month_show.value++
  }
  getRangeDateList()
}
const goToday = () => {
  year_show.value = curYear
  month_show.value = curMonth
  day_show.value = curDay
  const todayItem = calendarList.value.find(item => item.year === curYear && item.month === curMonth && item.day === curDay)
  if (typeof todayItem !== 'undefined') {
    curSelectDate.value = todayItem
  }
  getRangeDateList()
}
const handleClickDay = (item: calendarItem) => {
  console.log(item)
  if (item.month !== month_show.value) {
    month_show.value = item.month
  }
  // 点击选中给样式
  curSelectDate.value = item
  getRangeDateList()
}
const getRangeDayList = (rangeStr: string) => {
  // rangeStr = '2022.10.01-2022.10.07' return ['2022.10.01','2022.10.02','2022.10.03',...]
  const [start, end] = rangeStr.split('-')
  const startTime = new Date(start).getTime()
  const endTime = new Date(end).getTime()
  const timeDiff =  endTime - startTime
  let arr = []
  for(let i=0; i <= timeDiff; i += 86400000){
    const tDate = new Date(startTime + i)
    arr.push(tDate.getFullYear() + '.' + (tDate.getMonth() + 1) + '.' + tDate.getDate())
  }
  return arr
}
const getRangeDateList = () => {
  // 得找到各个范围内所有天数日期
  rangeColorList.value.forEach((item) => {
    const range = getRangeDayList(item.dateRange)
    item.range = range
    const dateArr = item.dateRange.split('-').filter(inner => inner !== '')
    if(dateArr.length > 0) {
      item.startDate = dateArr[0]
      item.endDate = dateArr.length > 1 ? dateArr[1] : dateArr[0]
    }
  })
  // 把连续假期处理到循环面板日期的对象的属性里
  const temp: any[] = []
  calendarList.value.forEach(item => { // 完了，计算属性不能改变 有点烦。写完看咋整体优化下。
    const obj: any = { ...item }
    const itemTime = new Date(item.year + '.' + (item.month + 1) + '.' + item.day).getTime() // 写个判断日期相等的方法吧。。每次new Date很烦
    console.log('itemTime====', itemTime, item.year + '.' + (item.month + 1) + '.' + item.day)
    // 在 rangeColorList 里找到 存在当前循环的日期的那条，没找到就不管
    const findex = rangeColorList.value.findIndex(fitem => {
        const rangeTimes = fitem.range ? fitem.range.map(mitem => new Date(mitem).getTime()) : []
        return rangeTimes.includes(itemTime)
    })
    console.log('findex===', findex)
    if(findex > -1) {
        obj.isholiday = true
        const fitem = rangeColorList.value[findex]
        console.log('findex item===', fitem)
        obj.color = fitem.color
        obj.title = fitem.title
        obj.isholyStart = fitem.startDate ? new Date(fitem.startDate).getTime() === itemTime : false
        obj.isholyEnd = fitem.endDate ? new Date(fitem.endDate).getTime() === itemTime : false
    }
    console.log('obj===', obj)
    temp.push(obj)
  })
  console.log('range====', rangeColorList.value)
  console.log('temp calend====', temp)
  calendarBoxList.value = temp // 面板暂时循环这个，没法直接改变calendarList，应该可以优化
}
onMounted(() => {
   getRangeDateList()
})
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
    /* border-right: 1px solid $border; */
    &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 1px;
        height: 100%;
        background-color: $border;
    }
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
.color-box {
  z-index: 2;
  overflow: hidden;
  box-sizing: border-box;
  padding: 0 10px;
  position: absolute;
  left: 0;
  right: 0;
  top: 60px;
  height: 30px;
  line-height: 30px;
  color: $white;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  &.start {
    left: 10px;
  }
  &.end {
    right: 10px;
  }
}
</style>