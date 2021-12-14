//cần hoàn thiện: random song(bị lặp lại bài hát ms phát), scroll into view(bị nhảy phần scroll), option(chưa có), config(xem chưa hiểu lắm///có ở 10m cuối video hướng dẫn)
//tham khảo: https://dhuyhoang3107.github.io/Music/


const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


// 
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const heading = $('header h2');
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const app = {
    currentIndex: 0,
     songs:[
        {
            name: 'Angel',
            singer: 'Yoon Mirea feat TigerJK',
            path: './assets/music/song1.mp3',
            img: './assets/img/song1.jpg'
        },
        {
            name: 'Closer',
            singer: 'The Chainsmokers feat Halsey',
            path: './assets/music/song2.mp3',
            img: './assets/img/song2.jpg'
        },
        {
            name: 'Fake It',
            singer: 'Hyomin',
            path: './assets/music/song3.mp3',
            img: './assets/img/song3.jpg'
        },
        {
            name: 'Let Go',
            singer: 'BTS',
            path: './assets/music/song4.mp3',
            img: './assets/img/song4.jpg'
        },
        {
            name: 'Nevermind',
            singer: 'Suga',
            path: './assets/music/song5.mp3',
            img: './assets/img/song5.jpg'
        },
        {
            name: 'Ngẫu hứng',
            singer: 'HOAPROX',
            path: './assets/music/song6.mp3',
            img: './assets/img/song6.jpg'
        },
        {
            name: 'Suddenly',
            singer: 'Kim Bo Kyung',
            path: './assets/music/song7.mp3',
            img: './assets/img/song7.jpg'
        },
        {
            name: 'To My Youth',
            singer: 'Bolbbalgan4',
            path: './assets/music/song8.mp3',
            img: './assets/img/song8.png'
        },
        {
            name: 'Sunburst ',
            singer: 'Tobu & Itro',
            path: './assets/music/song9.mp3',
            img: './assets/img/song9.png'
        },
        {
            name: '해바라기(sunflower)',
            singer: 'Instrumental',
            path: './assets/music/song11.mp3',
            img: './assets/img/song11.jpg'
        },
        {
            name: 'Tomoe Song',
            singer: 'Instrumental',
            path: './assets/music/song10.mp3',
            img: './assets/img/song10.jpg'
        },
       
    ],
    //render playlist
    render(){
        const html = this.songs.map((song, index)=>{
            return  ` <div class="song ${index === app.currentIndex?'active':''}" data-index = "${index}">
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        });
        playlist.innerHTML = html.join('');
    },
    //defind properties
    defineProperties(){
        Object.defineProperty(this, 'currentSong',{
            get(){
                return this.songs[this.currentIndex];
            }
        })
    },
    //listen and handle events
    handleEvents(){
        const cdWidth = cd.offsetWidth;

        //cd rotate
        const cdThumbAnimate = cdThumb.animate(
             [
                {transform: 'rotate(360deg)'},
             ],
             {
                duration: 10000,
                iterations: Infinity,
             });
             cdThumbAnimate.pause()

        // scroll 
        document.addEventListener('scroll', ScrollDocument);
        function ScrollDocument(){
            const scrollEvent = window.scrollY || document.documentElement.scrollTop;
            const newWidth =  cdWidth - scrollEvent;
            cd.style.width = newWidth >0 ? newWidth + 'px': 0;
            cd.style.opacity = newWidth/cdWidth;
        }

        // play and pause 
        playBtn.onclick = function(){
            if(player.classList.contains('playing')){
                audio.pause();
            }
            else{
                audio.play();
            }
        }
        audio.onplay = function(){
            player.classList.add('playing');
            cdThumbAnimate.play()
        }
        audio.onpause = function(){
            player.classList.remove('playing');
            cdThumbAnimate.pause()
        }
        // next song when ending
        audio.onended = function(){
            if(!repeatBtn.classList.contains('active')){
                nextBtn.onclick();
            }
            audio.play();
        }
        // progress of song
        audio.addEventListener("timeupdate", timeUpdate);
        function timeUpdate(e) {
          if (audio.duration)
            progress.value = Math.floor((audio.currentTime / audio.duration) * 200);
        }
        // seek audio using mouse
        // progress.onmousedown = function(){
        //     audio.removeEventListener("timeupdate", timeUpdate);
        // }
        // progress.onmouseup = function(){
        //     const seekTime = progress.value * audio.duration /200;
        //     audio.currentTime = seekTime;
        //     audio.addEventistener("timeupdate", timeUpdate); //để auto về đầu bài khi click play
        // }

        // seek audio using change
        progress.onchange = function(){
            audio.removeEventListener("timeupdate", timeUpdate);
            const seekTime = progress.value * audio.duration /200;
            audio.currentTime = seekTime;
            audio.addEventListener("timeupdate", timeUpdate); 
        }

        // click nextBtn 
        nextBtn.onclick = function(){
            app.nextSong();
            player.classList.contains('playing')?audio.play():audio.pause();
            app.render();
        }

        // click prevBtn 
        prevBtn.onclick = function(){
            app.prevSong();
            player.classList.contains('playing')?audio.play():audio.pause();
            app.render();
        }

        //click random
        randomBtn.onclick = function(){
            this.classList.toggle('active');
        }
        repeatBtn.onclick = function(){
            this.classList.toggle('active');
        }

        // 
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode||e.target.closest('.option')){
                if(songNode){
                    app.currentIndex = Number(songNode.dataset.index);
                    app.renderCurrentSong();
                    audio.play()
                    app.render()
                }
                if(e.target.closest('.option')){

                }
            }
        }
    },
    //render current song to dashboard
    renderCurrentSong(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },

    // next song
    nextSong(){
        if(randomBtn.classList.contains('active')){
            app.randomSong()
        }else{
            this.currentIndex == this.songs.length -1 ? this.currentIndex = 0: this.currentIndex++;
        }
        this.renderCurrentSong();
        this.ScrollIntoView();
    },

     // prev song
     prevSong(){
        if(randomBtn.classList.contains('active')){
            app.randomSong()
        }else{
        this.currentIndex == 0 ? this.currentIndex = this.songs.length -1 : this.currentIndex--;
        }
        this.renderCurrentSong();
        this.ScrollIntoView();
    },
    // fix hiệu năng khi random vào cùng 1 bài trong 1 thời gian ngắn
    randomSong(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random()*this.songs.length);
        } while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
    },
    ScrollIntoView(){
        setTimeout(() =>{
            $('.song.active').scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
        },200)
    },
    start(){
        //defind properties
        this.defineProperties()

        //listen and handle events
        this.handleEvents();

        //render current song to dashboard
        this.renderCurrentSong()
        //render playlist
        this.render();
    }
}


app.start()

