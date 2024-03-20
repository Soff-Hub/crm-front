

export function hourFormatter(time: string) {
    const splitedTime = time.split(':')

    const hh = splitedTime[0]
    const mm = splitedTime[1]

    return `${hh}:${mm}`
}