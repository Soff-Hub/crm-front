// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { format } from 'date-fns'

// interface MonthSelectorProps {
//   currentDate: Date
//   onMonthChange: (newMonth: number) => void
// }

// export default function MonthSelector({ currentDate, onMonthChange }: MonthSelectorProps) {
//   const months = Array.from({ length: 12 }, (_, i) => i)

//   return (
//     <Select
//       value={currentDate.getMonth().toString()}
//       onValueChange={(value) => onMonthChange(parseInt(value))}
//     >
//       <SelectTrigger className="w-[180px]">
//         <SelectValue>{format(currentDate, 'MMMM yyyy')}</SelectValue>
//       </SelectTrigger>
//       <SelectContent>
//         {months.map((month) => (
//           <SelectItem key={month} value={month.toString()}>
//             {format(new Date(currentDate.getFullYear(), month, 1), 'MMMM')}
//           </SelectItem>
//         ))}
//       </SelectContent>
//     </Select>
//   )
// }

