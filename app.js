// Start Application
const alarmsArray = [];
updateMainTimer();

const audioSong = new Audio("./audio/dualipa-levitating.mp3");

// Main Clock
setInterval(() => {
    updateMainTimer();
}, 1000);

function updateMainTimer() {
    const mainTimer = document.getElementById("now-time");
    const currentTime = getCurrentTime();
    mainTimer.innerHTML = currentTime.hour + ":" + currentTime.min + ":" + currentTime.sec;
}

function getCurrentTime() {
    const currentDate = new Date();
    const currentHour = currentDate.getHours() < 10 ? "0" + currentDate.getHours() : currentDate.getHours();
    const currentMinute = currentDate.getMinutes() < 10 ? "0" + currentDate.getMinutes() : currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds() < 10 ? "0" + currentDate.getSeconds() : currentDate.getSeconds();

    return {
        hour: currentHour,
        min: currentMinute,
        sec: currentSeconds,
    };
}

function getAlarmsTime(alarm) {
    const alarmArr = alarm.split(":");
    const alarmHours = parseInt(alarmArr[0]);
    const alarmMinutes = parseInt(alarmArr[1]);
    const alarmSeconds = parseInt(alarmArr[2]);

    return {
        hour: alarmHours,
        min: alarmMinutes,
        sec: alarmSeconds,
    }
}

// Alarm Controls
const addAlarmButton = document.getElementById("add-alarm-button");
const alarmTimeInput = document.getElementById("alarm-time-input");

addAlarmButton.addEventListener("click", (e) => {
    if(!alarmTimeInput.value == "") {
        // The object pushed is the alarm item model
        const newId = new Date().getTime().toString();
        alarmsArray.push({
            time: alarmTimeInput.value,
            id: newId,
            timeOut: setTimeout(() => {
                audioSong.play();
                alert("Its time to wake up!!!");
                deleteAlarmFromArray(newId);
                createAlarmList();
                audioSong.pause();
            }, calculateTimeoutMs(alarmTimeInput.value))
        });
    }
    createAlarmList();
    alarmTimeInput.value = 0;
    console.log(alarmsArray);
});

function calculateTimeoutMs(alarm) {
    let diff = 0;
    const currentTime = getCurrentTime();
    const alarmsTime = getAlarmsTime(alarm);

    const currentTimeInMs = (currentTime.hour * 3600000) + (currentTime.min * 60000) + (currentTime.sec * 1000);
    const alarmsTimeInMs = (alarmsTime.hour * 3600000) + (alarmsTime.min * 60000) + (alarmsTime.sec * 1000);

    diff = alarmsTimeInMs - currentTimeInMs;

    if (diff < 0) {
        console.log((24 * 3600000) + (diff));
        return ((24 * 3600000) + (diff));
    } else {
        console.log(diff);
        return diff;
    }
}


// Alarm Listings
function createAlarmList() {
    const alarmListParent = document.getElementById("alarm-list");
    alarmListParent.innerHTML = "";
    alarmsArray.forEach((alarm) => {
        alarmListParent.appendChild(createAlarmListItem(alarm));
    });
}

function createAlarmListItem(alarm) {
    const wrapper = document.createElement("div")
    const el = document.createElement("span");

    el.id = alarm.id;
    el.innerHTML = alarm.time;

    wrapper.className = "alarm_item";
    wrapper.appendChild(el);
    wrapper.appendChild(createDeleteButtonElement(alarm));
    return wrapper;
}

function createDeleteButtonElement(alarm) {
    const del = document.createElement("span");

    // Delete button attributes
    del.id = alarm.id;
    del.innerText = "Borrar";
    del.className = "alarm_item-delete_btn";
    // Delete button onclick
    del.addEventListener("click", (e) => {
        deleteAlarmFromArray(e.target.id)
        createAlarmList();
    });
    return del;
}

function deleteAlarmFromArray(alarmId) {
    alarmsArray.forEach((alarm, index) => {
        if (alarm.id === alarmId) {
            clearTimeout(alarm.timeOut);
            alarmsArray.splice(index, 1);
        }
    });
}