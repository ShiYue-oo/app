class AcGamePlayground {
    constructor(root) {
        // console.log("AcGamePlayground");
        this.root = root;
        this.$playground = $(`
            <div class="ac-game-playground"></div>
            `);
        this.hide();
        this.root.$ac_game.append(this.$playground);
        console.log("AcGamePlayground");
        this.start();
    }
    get_random_color() {
        let colors = ["red", "green", "blue", "yellow", "purple", "orange", "pink", "brown", "gray"];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    start() {
        console.log("start");
        let outer = this;
        $(window).resize(function () {
            outer.resize();
        });
    }
    resize() {

        // console.log("resize");

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;
        if (this.game_map) {
            this.game_map.resize();
        }
    }
    show() {
        // console.log("show");
        this.$playground.show();

        this.resize();

        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.height, 0.5, 0.05, "white", 0.5, true));
        for (let i = 0; i < 20; i++) {
            this.players.push(new Player(this, Math.random() * this.width / this.height, Math.random(), 0.05, this.get_random_color(), 0.5, false));
        }
    }
    hide() {
        this.$playground.hide();
    }
}