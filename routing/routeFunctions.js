module.exports = {
    getDate() {
        let currentDate = new Date();
        let currentYear = String(currentDate.getFullYear());
        let currentMonth = String(currentDate.getMonth() + 1);
        let currentMonthFormatted = currentMonth <= 9? "0" + currentMonth : currentMonth;
        let currentDay = String(currentDate.getDate());
        let currentDayFormatted = currentDay <= 9? "0" + currentDay : currentDay;
        let formattedDate = currentYear + currentMonthFormatted + currentDayFormatted;

        return formattedDate;
    }
}