export function saveAlarms(alarmsArray) {
    localStorage.setItem("alarms", JSON.stringify(alarmsArray));
}

export function loadAlarms() {
    const savedAlarms = localStorage.getItem("alarms");

    if (!savedAlarms) {
        return [];
    }
    return JSON.parse(savedAlarms);
}