//  let's select all required tags or elements

// import allMusic from "./musicscript.js";

const wrapper = document.querySelector(".container"),
  musicImg = wrapper.querySelector(".imageArea img"),
  musicName = wrapper.querySelector(".songDetails .name"),
  mainAudio = wrapper.querySelector("#MainAudio"),
  musicArtist = wrapper.querySelector(".songDetails .artists"),
  PlayPauseBtn = wrapper.querySelector(".playPause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  ProgressArea = wrapper.querySelector(".progressArea"),
  ProgressBar = wrapper.querySelector(".progressBar"),
  musicList = wrapper.querySelector(".musicList"),
  showMoreBtn = wrapper.querySelector("#moreMusic"),
  hideMusicBtn = musicList.querySelector("#close");

// console.log("all music= ", allMusic);
// console.log(nextBtn.innerHTML);
// console.log("next button content = ", nextBtn.textContent);

// load random music on page refresh
let musicIndex = Math.floor(Math.random() * allMusic.length) + 1;
// let musicIndex = 1;

window.addEventListener("load", () => {
  loadMusic(musicIndex); //calling load music function once window loaded
  playingNow();
});

// load music function
function loadMusic(innerNumb) {
  musicName.innerText = allMusic[innerNumb - 1].SongName;
  musicArtist.innerText = allMusic[innerNumb - 1].artistName;
  // musicImg.src = `images/${allMusic[innerNumb - 1].Songimg}.jpg`;
  musicImg.src = `images/${allMusic[innerNumb - 1].Songimg}`;
  mainAudio.src = `images/songs/${allMusic[innerNumb - 1].Songsrc}`;
  // mainAudio.src = `images/songs/${allMusic[innerNumb - 1].Songsrc}.mp3`;

  // console.log("index =", innerNumb); //musicIndex
  // console.log("musicName =", musicName.innerText); //musicName
  // console.log("musicImg =", musicImg.src); //musicImg
  // console.log("mainAudio =", mainAudio.src); //mainAudio
  // console.log("musicArtist =", musicArtist.innerText); //musicArtist
}

//  ========= play Music Function ================
function playMusic() {
  wrapper.classList.add("paused");
  PlayPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

//  ========= pause Music Function ================
function pauseMusic() {
  wrapper.classList.remove("paused");
  PlayPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

// ========== Play or music Button Event ==============
PlayPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  // if isMusicPaused is true then call pauseMusic else call playMusic
  //   using ternary operator
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

//next music function
function nextMusic() {
  // here we'll just increment the index by 1
  musicIndex++;
  // if musicIndex is greater than array length then musicIndex will be 1 so the first Song will be played
  //   using ternary operator
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

//prev music function
function prevMusic() {
  // here we'll just decrement the index by 1
  musicIndex--;
  // if musicIndex is less than 1 then musicIndex will be lastIndex(array length) so the Last Song will be played
  //   using ternary operator
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}

// ===== next music Button Event ==========
nextBtn.addEventListener("click", () => {
  nextMusic(); //Calling next music function
});

// ===== prev music Button Event ==========
prevBtn.addEventListener("click", () => {
  prevMusic(); //Calling prev music function
});

// ======== Update ProgressBar width with music current Time
mainAudio.addEventListener("timeupdate", (e) => {
  // console.log(e);
  const SongcurrentTime = e.target.currentTime;
  const Songduration = e.target.duration;
  let progressWidth = (SongcurrentTime / Songduration) * 100;
  ProgressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".currentTime"),
    musicDuration = wrapper.querySelector(".maxDuration");
  mainAudio.addEventListener("loadeddata", () => {
    let audioDuration = mainAudio.duration;
    let Totalmin = Math.floor(audioDuration / 60);
    let Totalsec = Math.floor(audioDuration % 60);
    if (Totalsec < 10) {
      Totalsec = `0${Totalsec}`;
    }
    musicDuration.innerText = `${Totalmin}:${Totalsec}`;

    // console.log(musicDuration.innerText);
  });

  // console.log("lenght", musicDuration.innerText);
  // console.log("current= ", SongcurrentTime);

  // updating current song playing time
  let Currentmin = Math.floor(SongcurrentTime / 60);
  let Currentsec = Math.floor(SongcurrentTime % 60);
  if (Currentsec < 10) {
    Currentsec = `0${Currentsec}`;
  }
  musicCurrentTime.innerText = `${Currentmin}:${Currentsec}`;
});

// let's update playing song current time according to the progress bar width
ProgressArea.addEventListener("click", (e) => {
  let progressWidthVar = ProgressArea.clientWidth; //getting width of progess bar
  let clickedOffSetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration; // getting song total duration

  mainAudio.currentTime = (clickedOffSetX / progressWidthVar) * songDuration;
  playMusic(); //calling playMusic function
  playingNow(); //calling playingNow() function

  console.log("offsetX = ", clickedOffSetX);
  console.log("progress Bar width = ", progressWidthVar);
  console.log("Song Duration = ", songDuration);
  console.log("song current time =", mainAudio.currentTime);
});

// let's work on repeat , shuffle song acording to icon
const repeatBtn = wrapper.querySelector("#repeatList");
repeatBtn.addEventListener("click", () => {
  // first we get the innerText of the icon then we'll change accordingly
  let getText = repeatBtn.innerText; //getting innerText of icon
  console.log("getText = ", getText);
  switch (getText) {
    case "repeat": //if the icon =(repeat) then change it to (repeat_one)
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped"); //set title to song looped
      break;
    case "repeat_one": //if icon =(repeat_one) then change it to shuffle
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffle"); //set title to Playback shuffle
      break;
    case "shuffle": //if icon is shuffle then change it to (repeat)
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped"); //set title to Playlist looped
      break;
  }
});

// above we just changed the icon ,
// now let's work on what to do after the song ended

mainAudio.addEventListener("ended", () => {
  // we'll do according to the icon means if user has set icon to (Song Looped) then
  // we'll (repeat) the current song and will do further accordingly

  let getText = repeatBtn.innerText; //getting innerText of icon

  switch (getText) {
    case "repeat": //if the icon =(repeat) then call nextMusic() function so next song will be played
      nextMusic();
      break;
    case "repeat_one": //if icon =(repeat_one) then we'll change the current playing song time =0 so the song will play from starting
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle": //if icon is shuffle then change it to (repeat)
      //   generating random index between the max range of array length
      // let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      // console.log("randIndex = ", randIndex);

      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex); //this loop will run until the next random number won't be the same of the current music index
      musicIndex = randIndex; //passing randomIndex so the random song will be played
      console.log(
        "random music index = ",
        musicIndex,
        "random index==",
        randIndex
      );

      loadMusic(musicIndex); //calling loadMusic function
      console.log("random music index = ", musicIndex);
      playMusic(); //calling playMusic function
      playingNow(); //calling playingNow() function
      break;
  }
});

// music Queue pe click kre to Music List show ho jaye
showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
// close icon pe click kre to
hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
  // console.log(showMoreBtn);
});

// console.log("allMusic = ", allMusic);
// console.log("length of allMusic = ", allMusic.length);

const ulTag = wrapper.querySelector("ul");
// let create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
  // console.log("index = ", i);
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].SongName}</span>
                  <p>${allMusic[i].artistName}</p>
                </div>
                <span id="${
                  allMusic[i].Songsrc2
                }" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].Songsrc2}" src="images/songs/${
    allMusic[i].Songsrc
  }"></audio>
                
              </li>`;
  // <audio class="${allMusic[i].Songsrc}" src="images/songs/${allMusic[i].Songsrc}.mp3"></audio>

  ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag
  // console.log("hello=", allMusic[i]);
  // console.log("ulTag = ", ulTag);
  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].Songsrc2}`); //music-1 id ka naam
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].Songsrc2}`);

  // console.log("liAudioDuartionTag = ", liAudioDuartionTag);
  // console.log("liAudioTag = ", liAudioTag);

  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) {
      //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    }
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
    liAudioDuartionTag.setAttribute("TotalDuration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value

    // console.log("liAudioDuartionTag =   ", liAudioDuartionTag.innerText);
    // console.log("liAudioTag = ", liAudioTag);
  });
}

// let's work on play particular song on click
// const allLiTags = ulTag.querySelectorAll("li");
// console.log("list = ", allLiTags);g

function playingNow() {
  const allLiTags = ulTag.querySelectorAll("li");

  for (let j = 0; j < allLiTags.length; j++) {
    // if there is a li tag which li-index is equal to musicIndex
    // then this music is playing now and we'll style it
    let AudioTag = allLiTags[j].querySelector(".audio-duration");
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
      AudioTag.innerText = "Playing";
    } else {
      allLiTags[j].classList.remove("playing");
      // let's get that audio duration value and pass to .audio-duration innerText
      let PopSongduration = AudioTag.getAttribute("totalduration");
      AudioTag.innerText = PopSongduration; //passing totalduration value to audio duration innerText
    }

    // adding onclick attribute in all li tags
    allLiTags[j].setAttribute("onClick", "clicked(this)");
  }
}

// let's play song on li click

function clicked(element) {
  console.log("this = ", this);
  // getting li index of perticular clicked li tag
  let getLiIndex = element.getAttribute("li-index");
  console.log("clicked index= ", getLiIndex);
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
// console.log(clicked);
