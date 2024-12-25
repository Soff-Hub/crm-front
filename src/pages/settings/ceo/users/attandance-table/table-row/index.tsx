import { format, isWeekend } from 'date-fns'

interface EmployeeRowProps {
  employee: { id: number; name: string }
  currentDate: Date
  daysInMonth: number
}

export default function EmployeeRow({ employee, currentDate, daysInMonth }: EmployeeRowProps) {
  const getRandomTimeEntry = () => {
    const startHour = Math.floor(Math.random() * 3) + 8 
    const endHour = Math.floor(Math.random() * 3) + 16 
    return `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`
  }

  return (
    <tr className="hover:bg-muted/50">
      <td className="font-medium sticky left-0 bg-background">{employee.name}</td>
      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        return (
          <td key={day} className={isWeekend(date) ? 'bg-muted' : ''}>
            {isWeekend(date) ? '-' : getRandomTimeEntry()}
          </td>
        )
      })}
    </tr>
  )
}
