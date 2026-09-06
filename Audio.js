const SpaceAudio = {
    element: document.getElementById('bg-music'),
    isPlaying: false,
    playlist: [
        "Sources/Galaxies.mp3",
        "Sources/Andromeda Galaxy.mp3",
        "Sources/Marine Snow.mp3",
        "Sources/Pelagic",
        "Sources/Submersion lullaby.mp3"
    ],
    currentIndex: 0,

    init() {
        this.element.volume = 0.3;
        this.loadTrack(0);
        this.element.onended = () => this.nextTrack();
        this.isPlaying = true;
    },

    loadTrack(index) {
        this.currentIndex = index;
        this.element.src = this.playlist[this.currentIndex];
        this.element.play().catch(() => {
            console.log("Audio playback paused - awaiting user focus.");
        });
    },

    togglePlay() {
        if (this.element.paused) {
            this.element.play();
            this.isPlaying = true;
        } else {
            this.element.pause();
            this.isPlaying = false;
        }
    },

    nextTrack() {
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.loadTrack(this.currentIndex);
    },

    prevTrack() {
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentIndex);
    }
}; 