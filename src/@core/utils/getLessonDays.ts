import { TranslateWeekName } from "src/pages/groups";

export default function getLessonDays(days: any) {
    return days.join(',') === "monday,wednesday,friday" ? "Toq kunlar" : days.join(',') === "tuesday,thursday,saturday" ? "Juft kunlar" : days.join(',') === "tuesday,thursday,saturday,monday,wednesday,friday,sunday" ? "Har kuni" : days.map((el: any) => TranslateWeekName[el]).join(', ')
}