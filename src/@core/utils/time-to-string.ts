export function timeToString(hour: number): string {
    const digits: string[] = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven"];
    
    if (hour >= 0 && hour < 24) {
        return digits[hour % 12];
    } else {
        return "Unknown";
    }
}
