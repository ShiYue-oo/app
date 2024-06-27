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
        // console.log("start");
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
    show(mode) {
        let outer = this;
        // console.log("show");
        this.$playground.show();



        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

        this.mode = mode;

        this.resize();
        this.players = [];
        this.players.push(new Player(this, this.width / 2 / this.height, 0.5, 0.05, "white", 0.5, "me", this.root.settings.username, this.root.settings.photo));

        if (mode == "single mode") {
            for (let i = 0; i < 20; i++) {
                this.players.push(new Player(this, Math.random() * this.width / this.height, Math.random(), 0.05, this.get_random_color(), 0.5, "bot"));
            }
        } else if (mode == "muti mode") {
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;    // 用当前窗口player的uuid来标识当前窗口

            this.mps.ws.onopen = function () {    // 等到链接创建成功后调用
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            };

        }
    }
    hide() {
        this.$playground.hide();
    }
}