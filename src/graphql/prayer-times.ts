import pkg from '@apollo/client'
const { gql, useMutation } = pkg
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
                prayerTimes(where: {month: $month}, first:100) {
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
    // console.log('prayerTimesForCurrentMonth : ', JSON.stringify(prayerTimesForCurrentMonth))
  return prayerTimesForCurrentMonth
}

export async function addPrayerTime() {
    console.log('$$$$$$ADD PRAYER TIME$$$$$$$$')
    const ADD_PRAYERTIME = gql`
    mutation AddPrayerTimes {
        createPrayerTime(
          data: 
            {
                month: 12, day: 3, fajrBegins: "06:21 AM", fajrJamah: "06:45 AM", sunrise: "08:30 AM", zuhrBegins: "12:28 PM", zuhrJamah: "01:00 PM", asrBegins: "02:00 PM", asrJamah: "02:30 PM", maghribBegins: "04:19 PM", maghribJamah: "04:24 PM", ishaBegins: "06:19 PM", ishaJamah: "07:30 PM"
            }
        ) {
          id
        }
      }
      
    `
    const result = await client.mutate({mutation:ADD_PRAYERTIME})

    console.log('MUTATION RESULT: ', JSON.stringify(result))
}

// // export async function uploadPrayerTimes() {
    
// //     const addPrayerTime = gql`
// //         mutation MyMutation {
// //             createPrayerTime(
// //             data: {
// //                 month: 10, 
// //                 day: 1, 
// //                 fajrBegins: "05:30 AM", 
// //                 fajrJamah: "06:30 AM", 
// //                 sunrise: "08:00 AM", 
// //                 zuhrBegins: "01:19 PM", 
// //                 zuhrJamah: "02:00 PM", 
// //                 asrBegins: "03:30 PM", 
// //                 asrJamah: "04:30 PM", 
// //                 maghribBegins: "06:05 PM", 
// //                 maghribJamah: "06:10 PM", 
// //                 ishaBegins: "08:00 PM", 
// //                 ishaJamah: "08:30 PM"
// //             }
// //             ) {
// //             id
// //             }
// //         }`

// //     const result = try{
// //             await client.mutate({mutation:addPrayerTime,}),
// //             throwErrorIfApolloErrorOccured(result)
// //             return true
// //         }catch(e){
// //             return false
// //         }

// //     console.log('newPrayerTime : ', JSON.stringify(result))

// // }
