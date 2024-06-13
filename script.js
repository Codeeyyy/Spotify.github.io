let audio = new Audio();
let playButton, songsContainer, songInfo, seekbar, next, previous;

function secToMin(time) {
  time = Math.round(time);
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;

  let padMinutes = String(minutes).padStart(2, "0");
  let padSeconds = String(seconds).padStart(2, "0");

  return `${padMinutes}:${padSeconds}`;
}

async function getSongs(folder) {
  // let a = await fetch(`http://127.0.0.1:3000/Part%202/Practice%2057/${folder}`);
  let a = await fetch(folder);
  let response = await a.text();
  console.log(response)
  let div = document.createElement("div");
  div.innerHTML = response;
  let result = [];
  let aTag = div.getElementsByTagName("a");
  for (let index = 0; index < aTag.length; index++) {
    const element = aTag[index];

    if (element.href.endsWith(".mp3")) {
      let obj = {};
      obj.name = element.innerHTML;
      obj.url = element.href;
      result.push(obj);
    }
  }

  return result;
}

function SongDivCreate(song, songsContainer, songInfo) {
  let container = document.createElement("div");
  container.classList.add("songCard");
  container.innerHTML = `
    <a href="#" class="text-dec-n hov-w color-g font-family-ss font-semi-bold flex gap-me transition">
      <img src="music.svg" alt="music icon" class="invert" />
      ${song.name}
      <img src="play.svg" alt="play icon" class="invert" />
    </a>
  `;
  songsContainer.appendChild(container);

  container.addEventListener("click", () => {
    console.log("working");
    if (screen.width <= 900) {
      document.getElementsByClassName("left")[0].style.left = `-100%`;
    }
    audio.src = song.url;
    audio.play();
    playButton.src = "pause.svg";
    timeDuration(audio);
    songInfo.innerHTML = `<p class="font-family-ss"> ${song.name} </p>`;
  });
}

function timeDuration(audio) {
  audio.addEventListener("timeupdate", () => {
    let m = secToMin(audio.currentTime);
    let time = document.getElementsByClassName("time")[0];

    if (!isNaN(audio.duration)) {
      time.innerHTML = `${m} / ${secToMin(audio.duration)}`;
      document.querySelector(".circle").style.left =
        (audio.currentTime / audio.duration) * 100 + "%";
    }
  });
}

function removeEventListeners() {
  playButton.replaceWith(playButton.cloneNode(true));
  seekbar.replaceWith(seekbar.cloneNode(true));
  next.replaceWith(next.cloneNode(true));
  previous.replaceWith(previous.cloneNode(true));
  document.getElementById("volume").replaceWith(document.getElementById("volume").cloneNode(true));

  playButton = document.getElementsByClassName("play")[0];
  seekbar = document.getElementsByClassName("seekbar")[0];
  next = document.getElementsByClassName("next")[0];
  previous = document.getElementsByClassName("previous")[0];
}

function addEventListeners(Songs) {
  playButton.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      timeDuration(audio);
      playButton.src = "pause.svg";
    } else {
      console.log("working");
      audio.pause();
      playButton.src = "play.svg";
    }
  });

  seekbar.addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    audio.currentTime = (audio.duration * percent) / 100;
  });

  document
    .getElementsByClassName("hamburger")[0]
    .addEventListener("click", () => {
      document.getElementsByClassName("left")[0].style.left = 0;
    });
  document
    .getElementsByClassName("close")[0]
    .addEventListener("click", () => {
      document.getElementsByClassName("left")[0].style.left = `-100%`;
    });

  next.addEventListener("click", () => {
    let currentIndex = Songs.findIndex((song) => song.url === audio.src);
    if (audio.src !== Songs[Songs.length - 1].url) {
      audio.src = Songs[currentIndex + 1].url;
      audio.play();
      playButton.src = "pause.svg";
      songInfo.innerHTML = Songs[currentIndex + 1].name;
    }
  });

  previous.addEventListener("click", () => {
    let currentIndex = Songs.findIndex((song) => song.url === audio.src);
    if (audio.src !== Songs[0].url) {
      audio.src = Songs[currentIndex - 1].url;
      audio.play();
      playButton.src = "pause.svg";
      songInfo.innerHTML = Songs[currentIndex - 1].name;
    }
  });

  document.getElementById("volume").addEventListener("change", (e) => {
    audio.volume = parseInt(e.target.value) / 100;
  });
}

function main(folder) {
  getSongs(folder).then((Songs) => {
    playButton = document.getElementsByClassName("play")[0];
    songsContainer = document.getElementsByClassName("songs")[0];
    songInfo = document.getElementsByClassName("songInfo")[0];
    seekbar = document.getElementsByClassName("seekbar")[0];
    next = document.getElementsByClassName("next")[0];
    previous = document.getElementsByClassName("previous")[0];

    songsContainer.innerHTML = "";

    for (const song of Songs) {
      SongDivCreate(song, songsContainer, songInfo);
      timeDuration(audio);
    }
    audio.src = Songs[0].url;
    audio.play();
    playButton.src = "pause.svg";
    songInfo.innerHTML = `<p class="font-family-ss"> ${Songs[0].name} </p>`;

    removeEventListeners();
    addEventListeners(Songs);
  });
}

// document.getElementsByClassName("card1")[0].addEventListener("click", () => {
//   main("Songs/cs");
// });
// document.getElementsByClassName("card2")[0].addEventListener("click", () => {
//   main("Songs/Ncs");
// });
document.getElementsByClassName("card1")[0].addEventListener("click", () => {
  main("cs.html");
});
document.getElementsByClassName("card2")[0].addEventListener("click", () => {
  main("ncs.html");
});
