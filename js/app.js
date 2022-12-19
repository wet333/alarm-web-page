import * as musicController from "./alarm-music-controller.js";

musicController.loadMusicController();

// Start Application
const alarmsArray = [];
updateMainTimer();

// Main Clock
setInterval(() => {
    updateMainTimer();
}, 1000);

function updateMainTimer() {
    const mainTimer = document.getElementById("now-time");
    const currentTime = getCurrentTime();
    const hour = currentTime.hour;
    const min = currentTime.min;
    const sec = currentTime.sec;

    mainTimer.innerText = `${hour}:${min}:${sec}`;
}

function getCurrentTime() {
    const currentDate = new Date();
  
    // Get the hour, minute, and second, add a leading zero if needed
    const hour = currentDate.getHours().toString().padStart(2, "0");
    const minute = currentDate.getMinutes().toString().padStart(2, "0");
    const second = currentDate.getSeconds().toString().padStart(2, "0");
  
    return { hour, min: minute, sec: second };
}

function getAlarmsTime(alarm) {
    const [alarmHours, alarmMinutes, alarmSeconds] = alarm.split(":").map(time => parseInt(time));
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
                musicController.getActiveSong().play();
                document.getElementById("modal").style.display = "flex";
                alarmsArray.forEach((alarm, index) => {
                    if (alarm.id === newId) {
                      alarmsArray.splice(index, 1);
                    }
                });
                updateAlarmListVisibility(alarmsArray);
                createAlarmList();
            }, calculateTimeoutMs(alarmTimeInput.value))
        });
        updateAlarmListVisibility(alarmsArray);
    }
    createAlarmList();
    alarmTimeInput.value = 0;
});

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

// Alarm Listings
function createAlarmList() {
    const alarmListParent = document.getElementById("alarm-list");
    alarmListParent.innerHTML = "";
    alarmsArray.forEach((alarm) => {
        alarmListParent.appendChild(createAlarmListItem(alarm));
    });
}

function createAlarmListItem(alarm) {
    const wrapper = document.createElement("div");
    const el = document.createElement("span");
    const del = document.createElement("span");
  
    // Set the ID and time of the alarm
    el.id = alarm.id;
    el.innerHTML = alarm.time;
  
    // Set the attributes of the delete button
    del.id = alarm.id;
    del.innerText = "Borrar";
    del.className = "alarm_item-delete_btn";
  
    // Add an event listener to the delete button
    del.addEventListener("click", (e) => {
      // Clear the timeout for the alarm
      clearTimeout(alarm.timeOut);
  
      alarmsArray.forEach((alarm, index) => {
        if (alarm.id === e.target.id) {
          alarmsArray.splice(index, 1);
          updateAlarmListVisibility(alarmsArray);
        }
      });

      // Update the alarm list
      createAlarmList();
    });
  
    // Merge all elements
    wrapper.className = "alarm_item";
    wrapper.appendChild(el);
    wrapper.appendChild(del);
  
    return wrapper;
}


// Modal controls
const stopAlarmButton = document.getElementById("stop-alarm-btn");
const modal = document.getElementById("modal");

stopAlarmButton.addEventListener("click", (e) => {
    musicController.getActiveSong().pause();
    modal.style.display = "none";
});

// Alarm List Visibility
function updateAlarmListVisibility(alarmList) {
    const alarmListWrapper = document.getElementsByClassName("alarm-list__wrapper")[0];
    if (alarmList.length > 0) {
        alarmListWrapper.style.display = 'block';
    } else {
        alarmListWrapper.style.display = 'none';
    }
}