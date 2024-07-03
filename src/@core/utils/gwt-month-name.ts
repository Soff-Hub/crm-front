export default function getMonthName(monthNum: any) {
    const month: number = monthNum ? monthNum : new Date().getMonth() + 1

    switch (month) {
        case 1:
            return 'yan';
        case 2:
            return 'fev';
        case 3:
            return 'mar';
        case 4:
            return 'apr';
        case 5:
            return 'may';
        case 6:
            return 'iyun';
        case 7:
            return 'iyul';
        case 8:
            return 'avg';
        case 9:
            return 'sent';
        case 10:
            return 'okt';
        case 11:
            return 'noy';
        case 12:
            return 'dek';
        default:
            return 'bu oy yoq';
    }
}

export function getMontNumber(month: any) {

    if (month === 'yan') return 1
    if (month === 'fev') return 2
    if (month === 'mar') return 3
    if (month === 'apr') return 4
    if (month === 'may') return 5
    if (month === 'iyun') return 6
    if (month === 'iyul') return 7
    if (month === 'avg') return 9
    if (month === 'sent') return 9
    if (month === 'okt') return 10
    if (month === 'noy') return 11
    if (month === 'dek') return 12
}

export function getMonthFullName(monthNum: any) {
    const month: number = monthNum ? monthNum : new Date().getMonth() + 1

    switch (month) {
        case 1:
            return 'Yanvar';
        case 2:
            return 'Fevral';
        case 3:
            return 'Mart';
        case 4:
            return 'Aprel';
        case 5:
            return 'May';
        case 6:
            return 'Iyun';
        case 7:
            return 'Iyul';
        case 8:
            return 'Avg';
        case 9:
            return 'Sentabr';
        case 10:
            return 'Oktabr';
        case 11:
            return 'Noyabr';
        case 12:
            return 'Dekabr';
        default:
            return 'bu oy yoq';
    }
}