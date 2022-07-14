<template>
  <div class="calendar-container">
    <div class="calendar-btns">
      <div class="btns-wrap">
        <div class="btn prev left-radius" title="previous month" @click="goPrevMonth">&lt;</div>
        <div class="btn next right-radius" title="next month" @click="goNextMonth">&gt;</div>
        <div class="btn today" title="this month">today</div>
      </div>
      <div class="calendar-title">{{ monthNameArr[month_show] + ' ' + year_show }}</div>
      <div class="btns-wrap">
        <div class="btn month left-radius active">month</div>
        <div class="btn week">week</div>
        <div class="btn day">day</div>
        <div class="btn list right-radius">list</div>
      </div>
    </div>
    <div class="calendar-box">
      <div class="column-item" style="text-align: center;" v-for="i in 7">{{ weekDays[i - 1] }}</div>
      <div class="day-box" v-for="i in 42">
        <div style="text-align: right;padding-right: 3px;" v-if="(i - 1) < firstDayInWeek">{{ showLastMonthDays - (firstDayInWeek - i) }}</div>
        <div v-if="(i - 1) < firstDayInWeek">{{ showLastMonthDays }}</div>
        <div style="text-align: right;padding-right: 3px;" v-if="(i - 1) >= firstDayInWeek && (i - 1) <= (showMonthDays + firstDayInWeek)">{{ i - firstDayInWeek }}</div>
        <div style="text-align: right;padding-right: 3px;" v-if="(i - 1) > (showMonthDays + firstDayInWeek)">{{ i - showMonthDays - firstDayInWeek - 1 }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
// 1.获取当前年当前月份(需要获取天数)。
// 2.31天:1,3,5,7,8,10,12月。30天: 4,6,9,11月。2月平月28，闰月29。
// 3.判断闰年(1.能被4整除但不能被100整除的年份。2.能被400整除) 
// 4.判断当前年当前月份的第一天是周几。
// 5.获取上一月天数（处理到前面的空格）
// import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";
import { ref, computed } from "vue"
// 先获取当前年月日再说
const curYear = new Date().getFullYear()
const curMonth = new Date().getMonth() // 0 - 11
const curDay = new Date().getDate()
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNameArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
// 面板显示的年月日，默认为当前
const year_show = ref<number>(curYear)
const month_show = ref<number>(curMonth)
// const day_show = ref<number>(curDay)
const monthDayNumList = computed(() => { // 所有月份的天数
  return [31, 28 + isLeapYear(year_show.value), 31, 30, 31, 31, 30, 31, 30, 31, 30, 31]
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

</script>
<style lang="scss" scoped>
$white: #fff;
$yellow: #fac863;
$shadow: rgba(0, 0, 0, 0.1);
$border: #ddd;
$primary: #1890ff;
$btnhover: rgba(24, 144, 255, .8);
$btnactive: #183fff;
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
.calendar-box {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(7, auto);
  gap: 0;
  border-top: 1px solid $border;
  border-left: 1px solid $border;
  .column-item {
    box-sizing: border-box;
    padding: 4px;
    border-right: 1px solid $border;
    border-bottom: 1px solid $border;
  }
  .day-box {
    @extend .column-item;
    height: 100px;
  }
}
</style>