import { gql } from '@apollo/client/core'
import client  from './apollo-client'

export type PrayerTime = {
    id:string,
    month:number,
    day:number,
    fajrBegins:string,
    fajrJamah:string,
    sunrise:string,
    zuhrBegins:string,
    zuhrJamah:string,
    asrBegins:string,
    asrJamah:string,
    maghribBegins:string,
    maghribJamah:string,
    ishaBegins:string,
    ishaJamah:string
}

let currentDay = new Date().getDate()
let currentMonth = new Date().getMonth() + 1

export async function getPrayerTimesForCurrentDay() {
    const result = await client.query({
        query: gql`
            query MyQuery($month:Int!, $day:Int!) {
                prayerTimes(where: {month: $month, AND: {day: $day}}) {
                month
                day
                fajrBegins
                fajrJamah
                sunrise
                zuhrBegins
                zuhrJamah
                asrBegins
                asrJamah
                maghribBegins
                maghribJamah
                ishaBegins
                ishaJamah
                }
            }`, variables:{month: currentMonth, day: currentDay}
  })
  
  let prayerTimesForCurrentDay : PrayerTime

  prayerTimesForCurrentDay = result.data.prayerTimes[0]
  
  return prayerTimesForCurrentDay 
}

export async function getPrayerTimesForCurrentMonth() {
    const result = await client.query({
        query: gql`
            query MyQuery($month:Int!) {
                prayerTimes(where: {month: $month}) {
                month
                day
                fajrBegins
                fajrJamah
                sunrise
                zuhrBegins
                zuhrJamah
                asrBegins
                asrJamah
                maghribBegins
                maghribJamah
                ishaBegins
                ishaJamah
                }
            }`, variables:{month: currentMonth}
  })
  
  let prayerTimesForCurrentMonth : Array<PrayerTime> = []

  prayerTimesForCurrentMonth = result.data.prayerTimes
  
  return prayerTimesForCurrentMonth
}