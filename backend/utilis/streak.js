import dayjs from "dayjs"

export const calculateCurrentStreak = (habitProgress) => {

    let streak = 0
    let date = dayjs()

    for (let item of habitProgress) {

        const habitProgressDate = dayjs(item.completedDate)

        if (habitProgressDate.isSame(date, "day")) {
            streak++
            date = date.subtract(1, "day")
        }
        else {
            break
        }
    }

    return streak
}


export const calculateLongestStreak = (habitProgress) => {

    let streak = 0
    let longest = 0
    let previousDate = null

    for (let item of habitProgress) {

        const currentDate = dayjs(item.completedDate)

        if (
            previousDate &&
            currentDate.diff(previousDate, "day") === 1
        ) {
            streak++
        }
        else {
            streak = 1
        }

        if (streak > longest) {
            longest = streak
        }

        previousDate = currentDate
    }

    return longest
}