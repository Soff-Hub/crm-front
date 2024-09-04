export default function getMonthName(monthNum: any) {
  //   const month: number = monthNum ? monthNum : new Date().getMonth() + 1

  switch (monthNum) {
    case '01':
      return 'Yanvar'
    case '02':
      return 'Fevral'
    case '03':
      return 'Mart'
    case '04':
      return 'Aprel'
    case '05':
      return 'May'
    case '06':
      return 'Iyun'
    case '07':
      return 'Iyul'
    case '08':
      return 'Avgust'
    case '09':
      return 'Sentabr'
    case '10':
      return 'Oktabr'
    case '11':
      return 'Noyabr'
    case '12':
      return 'Dekabr'
    default:
      return ''
  }
}
