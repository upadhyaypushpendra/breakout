class Sound{
    #state=false;
    constructor(src) {
        this.sounds = {};
    }
    setState = (state) => {
        this.#state=state;
    };
    add = (key,src) =>{
        let sound = document.createElement("audio");
        sound.src = src;
        sound.setAttribute("preload", "auto");
        sound.setAttribute("controls", "none");
        sound.style.display = "none";
        document.body.appendChild(sound);
        this.sounds[key] = sound;
    };
    playFor = (key,time) => {
        if(!this.#state) return;
        this.sounds[key].play();
        setTimeout(()=>{
                this.sounds[key].pause();
                this.sounds[key].currentTime = 0;
                },time);
    };
    play = (key) => {
        if(!this.#state) return;
        this.sounds[key].currentTime = 0;
        this.sounds[key].play();
    };
    playInfinite = (key) =>{
        if(!this.#state) return;
        this.sounds[key].play();
    };
    stop = (key) => {
        if(!this.#state) return;
        this.sounds[key].pause();
    };
}
