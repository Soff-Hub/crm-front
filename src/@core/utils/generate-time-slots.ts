export default function generateTimeSlots(startTime: string, endTime: string) {
    // Eslatma: startTime va endTime ni saat:daqiqa formatida kiritishingiz mumkin
    // Masalan: "09:00", "18:00"

    // Soatlarni ayirib olish
    const startSplit = startTime.split(":");
    const endSplit = endTime.split(":");

    const startHour = parseInt(startSplit[0]);
    const startMinute = parseInt(startSplit[1]);
    const endHour = parseInt(endSplit[0]);
    const endMinute = parseInt(endSplit[1]) + 1;

    // Boshlang'ich vaqtni belgilash
    let currentHour = startHour;
    let currentMinute = startMinute;

    const timeSlots = []; // Bo'sh array

    // Vaqt oraliqida har bir 30 daqiqalik soatni qo'shish
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        // Soatni arrayga qo'shish
        timeSlots.push(`${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`);

        // 30 daqiqalik soatni qo'shish
        currentMinute += 15;
        if (currentMinute >= 60) {
            currentHour++;
            currentMinute -= 60;
        }
    }

    return timeSlots;
}