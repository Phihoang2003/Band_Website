const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

//this la app
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Tệ Thật Anh Nhớ Em",
      singer: "Thanh Hưng",
      path: (src =
        "./image/song1/y2mate.com - Tệ Thật Anh Nhớ Em  Thanh Hưng  Official Lyric Video.mp3"),
      image:
        "https://avatar-ex-swe.nixcdn.com/mv/2022/04/15/7/7/2/4/1650016194910_640.jpg",
    },
    {
      name: "Vì Ngày Hôm Nay Em Cưới Rồi",
      singer: "Khải Đăng",
      path: (src =
        "./image/song2/y2mate.com - Hôm Nay Em Cưới Rồi  Khải Đăng  Thanh Hưng  Live Version.mp3"),
      image:
        "https://i1.sndcdn.com/artworks-BvaxVXId6HO1bAnt-dEdtWw-t500x500.jpg",
    },
    {
      name: "Hơn Cả Yêu",
      singer: "Đức Phúc",
      path: (src =
        "./image/song3/y2mate.com - HƠN CẢ YÊU  ĐỨC PHÚC  OFFICIAL MUSIC VIDEO.mp3"),
      image: "https://i.ytimg.com/vi/__kGJZ-kPno/maxresdefault.jpg",
    },
    {
      name: "Hết Thương Cạn Nhớ",
      singer: "Đức Phúc",
      path: (src =
        "./image/song4/y2mate.com - HẾT THƯƠNG CẠN NHỚ  ĐỨC PHÚC  OFFICIAL MUSIC VIDEO.mp3"),
      image: "https://i.ytimg.com/vi/DZDYZ9nRHfU/maxresdefault.jpg",
    },
    {
      name: "Chiều Hôm Ấy",
      singer: "JayKi",
      path: (src =
        "./image/song5/y2mate.com - JayKii  CHIỀU HÔM ẤY Official MV.mp3"),
      image: "https://i.ytimg.com/vi/SA35ldy92s0/maxresdefault.jpg",
    },
    {
      name: "Sai Người Sai Thời Điểm",
      singer: "Thanh Hưng",
      path: (src =
        "./image/song6/y2mate.com - Sai Người Sai Thời Điểm  Thanh Hưng  Lyric Video.mp3"),
      image:
        "https://photo-cms-kienthuc.zadn.vn/zoom/800/uploaded/phuongngan/2018_09_15/2/yeu-dung-nguoi-sai-thoi-diem-la-gi-tat-ca-chi-la-su-bao-bien.jpeg",
    },
    {
      name: "Có Như Không Có",
      singer: "Hiền Hồ",
      path: (src =
        "./image/song7/y2mate.com - Có Như Không Có  Hiền Hồ  Official Lyrics Video.mp3"),
      image: "https://i.ytimg.com/vi/nBADFUDapmk/maxresdefault.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${
        index === this.currentIndex ? "active" : ""
      } " data-index='${index}'>
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`;
    });
    $(".playlist").innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    //Xu li Cd quay
    cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000, //10s
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();
    //Xu li phong to thu nho Cd
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;
      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    };
    //Xu li nut play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    //Khi tien do bai hat thay doi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };
    //Khi next bai hat
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      // audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (e.target.closest(".song:not(.active)")) {
          //dùng sẽ bị chuyển sang chuỗi
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
          _this.render();
        }
      }
    };

    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;

    this.loadCurrentSong();
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },
  start: function () {
    this.defineProperties();
    this.render();
    this.loadCurrentSong();
    this.handleEvents();
  },
};
app.start();
