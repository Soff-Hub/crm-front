export function timeFormatter(time: string) {
    const split = time.split(':')
    const newTime = `${split[0]}:${split[1]}`
    
    return newTime
}