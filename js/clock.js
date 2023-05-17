export function startClock(elementId) {
    updateMainTimer(elementId);
    startMainClockInterval(elementId);
}

function startMainClockInterval(elementId) {
    setInterval(() => { updateMainTimer(elementId) } , 1000);
}

function updateMainTimer(elementId) {
    const mainTimer = document.getElementById(elementId);
    const currentTime = getCurrentTime();
    const hour = currentTime.hour;
    const min = currentTime.min;
    const sec = currentTime.sec;

    mainTimer.innerText = `${hour}:${min}:${sec}`;
}

export function getCurrentTime() {
    const currentDate = new Date();

    // Get the hour, minute, and second, add a leading zero if needed
    const hour = currentDate.getHours().toString().padStart(2, "0");
    const minute = currentDate.getMinutes().toString().padStart(2, "0");
    const second = currentDate.getSeconds().toString().padStart(2, "0");

    return { hour, min: minute, sec: second };
}