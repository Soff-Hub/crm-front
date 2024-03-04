export function formatDateTime(dateTimeString: any) {
    const dateTime = new Date(dateTimeString);

    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1 < 10 ? `0${dateTime.getMonth() + 1}` : dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hours = ('0' + dateTime.getHours()).slice(-2);
    const minutes = ('0' + dateTime.getMinutes()).slice(-2);

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}
