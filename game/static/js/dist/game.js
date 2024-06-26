class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
                <div class="ac-game-menu-field">
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
                         单人模式
                    </div>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
                         多人模式
                    </div>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
                            退出
                    </div>
                <div>
            </div>
        `);
        this.hide();
        this.root.$ac_game.append(this.$menu);
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single_mode.click(function () {
            outer.hide();
            outer.root.playground.show("single mode");
        });
        this.$multi_mode.click(function () {
            outer.hide();
            outer.root.playground.show("muti mode");
        });
        this.$settings.click(function () {
            outer.root.settings.logout_on_remote();
        });
    }

    show() {
        this.$menu.show();
    }

    hide() {
        this.$menu.hide();
    }
}let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this);
        this.has_called_start = false; // 是否已经调用过start方法
        this.timedelta = 0;   // 当前帧和上一帧的时间差
        this.uuid = this.create_uuid();
    }

    create_uuid() {
        let res = "";
        for (let i = 0; i < 8; i++) {
            let x = parseInt(Math.floor(Math.random() * 10));  // 返回[0, 1)之间的数
            res += x;
        }
        return res;
    }
    start() {
    }
    update() {

    }
    on_destroy() {   // 用于被销毁前执行，给其他加分之类的

    }
    destroy() {
        this.on_destroy();
        for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
            if (AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i, 1);
                break;
            }
        }
    }
}
let last_timestamp;
let AC_GAME_ANIMATION = function (timestamp) {
    for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        } else {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_ANIMATION);
}
requestAnimationFrame(AC_GAME_ANIMATION);class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`); // 创建一个canvas元素
        this.ctx = this.$canvas[0].getContext('2d'); // 获取canvas的2d绘图上下文
        this.ctx.canvas.width = this.playground.width; // 设置canvas的宽度
        this.ctx.canvas.height = this.playground.height; // 设置canvas的高度
        this.playground.$playground.append(this.$canvas); // 将canvas添加到playground中
    }
    start() {

    }
    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    update() {
        this.render();
    }
    render() {
        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.friction = 0.9;
        this.eps = 0.01;
    }
    start() {

    }
    update() {
        if (this.speed < this.eps) {
            this.destroy();
            return false;
        }
        this.x += this.vx * this.speed * this.timedelta / 1000;
        this.y += this.vy * this.speed * this.timedelta / 1000;
        this.speed *= this.friction;
        this.render();
    }
    render() {
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, character, username, photo) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 1;
        this.vy = 1;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.character = character;
        this.username = username;
        this.photo = photo;
        this.eps = 0.01;
        this.cur_skill = null;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.friction = 0.9;
        if (this.character !== "bot") {
            this.img = new Image();
            this.img.src = this.photo;
        }
    }
    start() {
        if (this.character === "me") {
            this.add_listening_events();
        } else { // 这里应该只让机器人随机游走
            let tx = Math.random() * this.playground.width / this.playground.height;
            let ty = Math.random() * this.playground.height / this.playground.height;
            this.move_to(tx, ty);
        }
    }
    add_listening_events() {
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function (e) {
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) {  // 右键
                outer.move_to((e.clientX - rect.left) / outer.playground.height, (e.clientY - rect.top) / outer.playground.height);
            } else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    outer.shoot_fireball((e.clientX - rect.left) / outer.playground.height, (e.clientY - rect.top) / outer.playground.height);
                }
                outer.cur_skill = null;
            }
        });
        $(window).keydown(function (e) {
            if (e.which === 81) {
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }
    shoot_fireball(tx, ty) {
        let x = this.x;
        let y = this.y;
        let angle = Math.atan2(ty - y, tx - x);
        let vx = Math.cos(angle);
        let vy = Math.sin(angle);
        let radius = 0.01;
        let color = "blue";
        let speed = 0.9;
        let move_length = 1.5;
        new FireBall(this.playground, this, x, y, radius, vx, vy, 0.01, color, speed, move_length);
    }
    get_dist(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    move_to(x, y) {
        this.move_length = this.get_dist(this.x, this.y, x, y);
        let angle = Math.atan2(y - this.y, x - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(damage, angle) {
        this.radius -= damage;
        if (this.radius < this.eps) {
            this.destroy();
            return false;
        }
        this.speed *= 0.8;
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 150;

        // console.log("is_attacked", this.radius, this.speed, this.damage_x, this.damage_y, this.damage_speed);
        for (let i = 0; i < 10 + Math.random() * 5; i++) {
            let x = this.x;
            let y = this.y;
            let radius = this.radius * Math.random() * 0.1;
            let angle = Math.random() * Math.PI * 2;
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed);
        }
    }

    update() {
        this.update_move();
        this.render();
    }
    update_move() {
        if (this.character === "bot" && Math.random() < 1 / 180.0) {
            let index = Math.floor(Math.random() * this.playground.players.length);
            let player = this.playground.players[index];
            this.shoot_fireball(player.x, player.y);
        }
        if (this.damage_speed > this.eps) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        }
        if (this.move_length < this.eps) {
            this.move_length = 0;
            this.vx = 0;
            this.vy = 0;
            if (this.character === "bot") {  // 如果不是玩家自己，到达终点后再随机选一个位置移动
                let tx = Math.random() * this.playground.width / this.playground.scale;
                let ty = Math.random() * this.playground.height / this.playground.scale;
                this.move_to(tx, ty);
            }
        } else {
            let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }
    }
    render() {
        let scale = this.playground.scale;
        if (this.character !== "bot") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * scale * 2, this.radius * scale * 2);
            this.ctx.restore();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }
}class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, damage, color, speed, move_length) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.damage = damage;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.eps = 0.01;
    }
    start() {
    }
    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;

        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
            }
        }

        this.render();
    }
    get_dist(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    is_collision(player) {
        let dist = this.get_dist(this.x, this.y, player.x, player.y);
        return dist < this.radius + player.radius;
    }
    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(this.damage, angle);
        this.destroy();
    }
    render() {
        let scale = this.playground.scale;
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        console.log("MultiPlayerSocket");

        this.ws = new WebSocket("ws://43.138.22.208:8000/wss/multiplayer/");

        this.start();
    }

    start() {
        this.receive();
    }

    receive() {
        let outer = this;

        this.ws.onmessage = function (e) {
            let data = JSON.parse(e.data);
            let uuid = data.uuid;
            if (uuid === outer.uuid) return false;

            let event = data.event;
            if (event === "create_player") {
                outer.receive_create_player(uuid, data.username, data.photo);
            }
        };
    }

    send_create_player(username, photo) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "create_player",
            'uuid': outer.uuid,
            'username': username,
            'photo': photo,
        }));
    }

    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
            0.05,
            "white",
            0.15,
            "enemy",
            username,
            photo,
        );

        player.uuid = uuid;
        this.playground.players.push(player);
    }
}
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
}class Settings {
    constructor(root) {
        this.root = root;
        this.platform = "WEB";
        this.username = "";
        this.photo = "";
        this.$settings = $(`
        <div class ="ac-game-settings">
            <div class="ac-game-settings-login">
                <div class="ac-game-settings-title">
                登录
                </div>
                <div class="ac-game-settings-username">
                    <div class="ac-game-settings-item">
                        <input type="text" placeholder="用户名">
                    </div>
                </div>
                <div class="ac-game-settings-password">
                    <div class="ac-game-settings-item">
                        <input type="password" placeholder="密码">
                    </div>
                </div>
                <div class="ac-game-settings-submit">
                    <div class="ac-game-settings-item">
                        <button>登录</button>
                    </div>
                </div>
                <div class="ac-game-settings-error-message">
                </div>
                <div class="ac-game-settings-option">
                    注册
                </div>
                <br>
                <div class ="ac-game-settings-acwing">
                    <img width="30" src="http://43.138.22.208:8000/static/image/settings/acwing_logo.png">
                    <br>
                    <div>
                        Acwing 一键登录
                    </div>
                </div>
            </div>


            <div class="ac-game-settings-register">
                <div class="ac-game-settings-title">
                注册
                </div>
                <div class="ac-game-settings-username">
                    <div class="ac-game-settings-item">
                        <input type="text" placeholder="用户名">
                    </div>
                </div>
                <div class="ac-game-settings-password ac-game-settings-password-first">
                    <div class="ac-game-settings-item">
                        <input type="password" placeholder="密码">
                    </div>
                </div>
                <div class="ac-game-settings-password ac-game-settings-password-second">
                    <div class="ac-game-settings-item">
                        <input type="password" placeholder="确认密码">
                    </div>
                </div>
                <div class="ac-game-settings-submit">
                    <div class="ac-game-settings-item">
                        <button>注册</button>
                    </div>
                </div>
                <div class="ac-game-settings-error-message">
                </div>
                <div class="ac-game-settings-option">
                    登录
                </div>
                <div class ="ac-game-settings-acwing">
                    <img width="30" src="http://43.138.22.208:8000/static/image/settings/acwing_logo.png">
                    <br>
                    <div>
                        Acwing 一键登录
                    </div>
                </div>
            </div>

        </div>
        `);
        this.$login = this.$settings.find('.ac-game-settings-login');
        this.$login_username = this.$login.find('.ac-game-settings-username input');
        this.$login_password = this.$login.find('.ac-game-settings-password input');
        this.$login_submit = this.$login.find('.ac-game-settings-submit button');
        this.$login_error_message = this.$login.find('.ac-game-settings-error-message');
        this.$login_register = this.$login.find('.ac-game-settings-option');
        this.$login.hide();

        this.$register = this.$settings.find('.ac-game-settings-register');
        this.$register_username = this.$register.find('.ac-game-settings-username input');
        this.$register_password = this.$register.find('.ac-game-settings-password-first input');
        this.$register_password_confirm = this.$register.find('.ac-game-settings-password-second input');
        this.$register_submit = this.$register.find('.ac-game-settings-submit button');
        this.$register_error_message = this.$register.find('.ac-game-settings-error-message');
        this.$register_login = this.$register.find('.ac-game-settings-option');
        this.$register.hide();

        this.$acwing_login = this.$settings.find('.ac-game-settings-acwing img');
        this.root.$ac_game.append(this.$settings);

        this.start();
    }

    register() {
        this.$login.hide();
        this.$register.show();
    }
    login() {
        this.$register.hide();
        this.$login.show();
    }
    start() {
        this.getinfo();
        this.add_listening_events();
    }
    add_listening_events() {
        let outer = this;
        this.add_listening_events_login();
        this.add_listening_events_register();

        this.$acwing_login.click(function () {
            // console 输出日志
            console.log("acwing_login");
            outer.acwing_login();
        });

    }
    add_listening_events_login() {
        let outer = this;
        this.$login_register.click(function () {
            outer.register();
        });
        this.$login_submit.click(function () {
            outer.login_on_remote();
        });
    }
    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function () {
            outer.login();
        });
        this.$register_submit.click(function () {
            outer.register_on_remote();
        });
    }
    acwing_login() {
        $.ajax({
            // url: "https://app1754.acapp.acwing.com.cn/settings/acwing/web/apply_code/",
            url: "http://43.138.22.208:8000/settings/acwing/web/apply_code/",
            type: "GET",
            success: function (resp) {
                console.log(resp);
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        });
    }

    login_on_remote() {
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        let outer = this;
        this.$login_error_message.empty();

        $.ajax({
            url: "http://43.138.22.208:8000/settings/login",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function (resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload();
                } else {
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }
    register_on_remote() {
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        this.$register_error_message.empty();

        $.ajax({
            url: "http://43.138.22.208:8000/settings/register",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function (resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload();
                } else {
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }
    logout_on_remote() {
        $.ajax({
            url: "http://43.138.22.208:8000/settings/logout",
            type: "GET",
            success: function (resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload();
                }
            }
        });
    }
    getinfo() {
        //        console.log("getinfo");
        let outer = this;

        $.ajax({
            url: "http://43.138.22.208:8000/settings/getinfo",
            type: "GET",
            data: {
                platform: outer.platform
            },
            success: function (resp) {
                console.log(resp);
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    outer.login();
                }
            }
        });
    }
    hide() {
        this.$settings.hide();
    }
    show() {
        this.$settings.show();
    }

}export class AcGame {
    constructor(id) {
        this.id = id;
        this.$ac_game = $('#' + id);

        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        this.start();
    }
    start(){

    }
}