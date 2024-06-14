export function timeFormatter(time: string) {
    const split = time.split(':')
    const newTime = `${split[0]}:${split[1]}`

    return newTime
}


export function datatimeFormatCustome(param: string) {
    const date = param.split(' ')[0]
    const time = param.split(' ')[1]
    const split = time.split(':')
    const newTime = ` ${time.replace('-', ':')} / ${date.split('-').reverse().join('.')}`

    return newTime
}