class AcGamePlayground {
    constructor(root) {
        // console.log("AcGamePlayground");
        this.root = root;
        this.focus_player = null;
        this.$playground = $(`
            <div class="ac-game-playground">
            </div>
            `);
        this.hide();
        this.$audio = this.$playground.find("#background-music")[0];
        this.root.$ac_game.append(this.$playground);
        // console.log("AcGamePlayground");
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
        this.width = this.$playground.width();   // 获取对应div的宽度，以像素为单位
        this.height = this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale = this.height;
        if (this.game_map) {
            this.game_map.resize();
        }
    }

    re_calculate_cx_cy(x, y) {
        this.cx = x - 0.5 * this.width / this.scale;
        this.cy = y - 0.5 * this.height / this.scale;

        let l = this.game_map.l;
        if (this.focus_player) {
            this.cx = Math.max(this.cx, -2 * l);
            this.cx = Math.min(this.cx, this.virtual_map_width - (this.width / this.scale - 2 * l));
            this.cy = Math.max(this.cy, -l);
            this.cy = Math.min(this.cy, this.virtual_map_height - (this.height / this.scale - l));
        }
        // console.log(this.cx, this.cy);
    }

    show(mode) {
        let outer = this;
        // console.log("show");
        this.$playground.show();



        this.width = this.$playground.width();
        this.height = this.$playground.height();

        this.virtual_map_width = 3;
        this.virtual_map_height = this.virtual_map_width;

        this.game_map = new GameMap(this);




        this.mode = mode;
        this.state = "waiting";
        this.notice_board = new NoticeBoard(this);
        this.score_board = new ScoreBoard(this);
        this.player_count = 0;



        this.resize();
        this.players = [];
        this.players.push(new Player(this, 1.5, 1.5, 0.05, "white", 0.5, "me", this.root.settings.username, this.root.settings.photo));
        this.re_calculate_cx_cy(this.players[0].x, this.players[0].y);
        this.focus_player = this.players[0];

        if (mode == "single mode") {
            for (let i = 0; i < 50; i++) {
                this.players.push(new Player(this, Math.random() * 3, Math.random() * 3, 0.05, this.get_random_color(), 0.5, "bot"));
            }
        } else if (mode == "multi mode") {
            this.chat_field = new ChatField(this);
            this.mps = new MultiPlayerSocket(this);
            this.mps.uuid = this.players[0].uuid;    // 用当前窗口player的uuid来标识当前窗口

            this.mps.ws.onopen = function () {    // 等到链接创建成功后调用
                outer.mps.send_create_player(outer.root.settings.username, outer.root.settings.photo);
            };

        }
        // console.log("show music");

        let bgm = document.getElementById("background-music");

        if (bgm) {
            bgm.play().catch(error => {
                console.error('Error playing background music:', error);
            });
        }

        this.mini_map = new MiniMap(this, this.game_map);
        this.mini_map.resize();

    }
    hide() {

        let bgm = document.getElementById("background-music");
        if (bgm) {
            bgm.pause();
        } else {
            console.error('Background music element not found');
        }

        while (this.players && this.players.length > 0) {
            this.players[0].destroy();
        }

        if (this.game_map) {
            this.game_map.destroy();
            this.game_map = null;
        }

        if (this.notice_board) {
            this.notice_board.destroy();
            this.notice_board = null;
        }

        if (this.score_board) {
            this.score_board.destroy();
            this.score_board = null;
        }

        this.$playground.empty();

        this.$playground.hide();
    }
}