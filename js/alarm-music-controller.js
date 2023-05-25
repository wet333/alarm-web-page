function loadMusicController() {
    const musicControllerWrapper = document.getElementById("music-controller_wrapper");
    const musicControllerList = document.getElementById("music-controller_list");

    // Al subirla al host agregar un . al inicio de cada ruta para que sea relativa
    loadMusicMP3s([
        "./audio/rock-it-coma-media.mp3", 
        "./audio/cyber-war-alexiAction.mp3",
        "./audio/cyber-attack-alexiAction.mp3",
        "./audio/curious-mountain.mp3",
        "./audio/forest-lullaby-lesfm.mp3",
    ]);
    
    let isPanelVisible = false;

    musicControllerWrapper.addEventListener("click", (e) => {

        isPanelVisible = !isPanelVisible;
        musicControllerList.style.visibility = isPanelVisible ? "visible" : "hidden";
    });

}

function loadMusicMP3s(array) {
    
    const audioPathsArray = array || [];
    const songListElement = document.getElementById("music-controller_list");

    audioPathsArray.forEach( (audioPath, index) => {
        // Adding the tracks to the body
        const audioElement = document.createElement('audio');
        audioElement.classList.add("alarm-audio-track");
        audioElement.setAttribute('src', audioPath);
        audioElement.setAttribute('type', 'audio/mpeg');
        audioElement.setAttribute("data-audio-name", audioPath);

        const textNode = document.createTextNode('Your browser does not support the audio element.');

        audioElement.appendChild(textNode);

        document.body.appendChild(audioElement);

        // Adding the options to the audio panel
        const itemElement = document.createElement("div");

        const iElement = document.createElement('i');
        iElement.setAttribute('class', 'fa-solid fa-music');

        const spanElement = document.createElement("span");
        spanElement.innerText = (audioPath.split("/")[2]).replace(/.mp3/g, '');
        spanElement.style.marginLeft = "8px";
        spanElement.classList.add("song-name");
        index === 0 ? spanElement.classList.add("active-alarm-song") : "";

        itemElement.addEventListener("click", (e) => {
            setActiveSong(e.target.innerText);
        });
        
        itemElement.appendChild(iElement);
        itemElement.appendChild(spanElement);
        songListElement.appendChild(itemElement);
    });

}

function setActiveSong(songName) {
    const songItems = document.getElementsByClassName("song-name");

    for (let i = 0; i < songItems.length ; i++) {
        if (songItems[i].innerText === songName) {
            songItems[i].classList.add("active-alarm-song");
        } else {
            songItems[i].classList.remove("active-alarm-song");
        }
    }
}

function getActiveSong() {
    const songItems = document.getElementsByClassName("song-name");
    const audioElements = document.getElementsByTagName("audio");

    for (let i = 0; i < songItems.length ; i++) {
        if (songItems[i].classList.contains("active-alarm-song")) {
            for (let j = 0; j < audioElements.length ; j++) {
                if (songItems[i].innerHTML === getAudioNameFromAudioPath(audioElements[j].dataset.audioName)) {
                    return audioElements[j];
                }
            }
        }
    }
}

function getAudioNameFromAudioPath(path) {
    return (path.split("/")[2]).replace(/.mp3/g, '');
}

export {
    getActiveSong as getActiveSong,
    loadMusicController as loadMusicController,
}