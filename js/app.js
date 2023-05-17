import * as musicController from "./alarm-music-controller.js";
import { startClock, getCurrentTime } from "./clock.js";

musicController.loadMusicController();
startClock("now-time");

// Start Application
const alarmsArray = [];

// Alarm Controls
const addAlarmButton = document.getElementById("add-alarm-button");
const alarmTimeInput = document.getElementById("alarm-time-input");
const alarmDescInput = document.getElementById("alarm-text-input");

addAlarmButton.addEventListener("click", handleAddAlarm);

function handleAddAlarm() {
    const time = alarmTimeInput.value;
    const desc = alarmDescInput.value;

    if (time && desc) {
        const alarmId = new Date().getTime().toString();
        const timeoutMS = calculateTimeoutMs(time);

        alarmsArray.push({
            id: alarmId,
            time: time,
            description: desc,
            timeOut: setTimeout(alarmTrigger, timeoutMS, alarmId)
        });

        updateAlarmListVisibility();
    }

    createAlarmList();
    clearInputs();
}

function alarmTrigger(alarmId) {
    musicController.getActiveSong().play();
    document.getElementById("modal").style.display = "flex";

    alarmsArray = alarmsArray.filter(alarm => alarm.id !== alarmId);

    updateAlarmListVisibility();
    createAlarmList();
}

function clearInputs() {
    alarmTimeInput.value = "";
    alarmDescInput.value = "";
}

// This function takes a string representing the time at which the alarm should be triggered, and returns the number of milliseconds until that time.
function calculateTimeoutMs(alarm) {
    // Convert the current time and alarm time to milliseconds
    const currentTime = getCurrentTime();
    const alarmsTime = getAlarmsTime(alarm);
    const currentTimeInMs = (currentTime.hour * 3600000) + (currentTime.min * 60000) + (currentTime.sec * 1000);
    const alarmsTimeInMs = (alarmsTime.hour * 3600000) + (alarmsTime.min * 60000) + (alarmsTime.sec * 1000);
  
    // Calculate the difference between the alarm time and the current time
    let diff = alarmsTimeInMs - currentTimeInMs;
  
    // If the alarm time has already passed, add the number of milliseconds in a day
    if (diff < 0) {
      diff += (24 * 3600000);
    }
  
    return diff;
}

function getAlarmsTime(alarm) {
    const [alarmHours, alarmMinutes, alarmSeconds] = alarm.split(":").map(time => parseInt(time));
    return {
        hour: alarmHours,
        min: alarmMinutes,
        sec: alarmSeconds,
    }
}

// Alarm Listings
function createAlarmList() {
    const alarmListParent = document.getElementById("alarm-list");
    alarmListParent.innerHTML = "";
    
    alarmsArray.forEach(alarm => {
        alarmListParent.appendChild(createAlarmListItem(alarm));
    });
}
  
function createAlarmListItem(alarm) {
    const wrapper = document.createElement("div");
    const timeSpan = document.createElement("span");
    const iconSpan = document.createElement("span");
    const descSpan = document.createElement("span");
    const del = document.createElement("span");

    timeSpan.id = alarm.id;
    timeSpan.innerHTML = alarm.time;
    iconSpan.innerHTML = "<i class='fa-solid fa-arrow-right'></i>";
    descSpan.innerHTML = alarm.description;

    del.id = alarm.id;
    del.innerHTML = "<i class='fa-regular fa-circle-xmark'></i> Borrar";
    del.className = "alarm_item-delete_btn";
    del.addEventListener("click", handleDeleteAlarm);

    wrapper.className = "alarm_item";
    wrapper.appendChild(timeSpan);
    wrapper.appendChild(iconSpan);
    wrapper.appendChild(descSpan);
    wrapper.appendChild(del);

    return wrapper;
}

function handleDeleteAlarm(e) {
    const alarmId = e.target.id;

    clearTimeout(getAlarmById(alarmId).timeOut);

    const indexToRemove = alarmsArray.findIndex(alarm => alarm.id === alarmId);
    if (indexToRemove !== -1) {
        alarmsArray.splice(indexToRemove, 1);
    }

    updateAlarmListVisibility();
    createAlarmList();
}

function getAlarmById(id) {
    return alarmsArray.find(alarm => alarm.id === id);
}

// Modal controls
const stopAlarmButton = document.getElementById("stop-alarm-btn");
const modal = document.getElementById("modal");

stopAlarmButton.addEventListener("click", handleStopAlarm);

function handleStopAlarm() {
    musicController.getActiveSong().pause();
    modal.style.display = "none";
}

// Alarm List Visibility
function updateAlarmListVisibility() {
    const alarmListWrapper = document.getElementsByClassName("alarm-list__wrapper")[0];
    alarmListWrapper.style.display = alarmsArray.length > 0 ? "block" : "none";
}