class Introduction {
    constructor(root) {

        this.root = root;
        this.$introduction = $(`
            <div class="ac-game-introduction">
                <div class="ac-game-introduction-return">
                    返回
                </div>
                <div class="ac-game-introduction-title">
                    星际大逃杀
                </div>
                <div class="ac-game-introduction-content">
                    <div class="ac-game-introduction-content-item">
                        <div class="ac-game-introduction-content-item-title">
                            游戏目标
                        </div>
                        <div class="ac-game-introduction-content-item-content">
                            
                        </div>
                    </div>
                    <div class="ac-game-introduction-content-item">
                        <div class="ac-game-introduction-content-item-title">
                            操作说明
                        </div>
                        <div class="ac-game-introduction-content-item-content">
                            q + 鼠标左键   攻击 发射火球
                            </br>
                            f + 鼠标左键   瞬移闪现
                            </br>
                            e  开启护盾
                            </br>
                            鼠标右键   移动到点击位置
                        </div>
                    </div>
                </div>
            </div>
        `);

        this.hide();
        this.root.$ac_game.append(this.$introduction);
        this.start();
        this.$introduction_return = this.$introduction.find('.ac-game-introduction-return');
    }
    start() {

    }
    add_listening_events() {
        let outer = this;
        this.$introduction_return.click(function () {
            outer.introduction_return();
        });
    }
    show(mode) {
        this.$introduction.show();
        this.add_listening_events();
    }
    introduction_return() {
        this.hide();
        this.root.menu.show();
    }
    hide() {
        this.$introduction.hide();
    }
}class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
                <div class="ac-game-menu-field">
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
                         单人模式
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
                         多人模式
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-introduction">
                         游戏说明
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
                            退出
                    </div>
                    <audio id="background-music" src="https://app1817.acapp.acwing.com.cn/static/audio/menu/menu.mp3" loop></audio>
                </div>
            </div>
        `);
        this.root.$ac_game.append(this.$menu); // 将菜单添加到DOM中
        this.hide(); // 在菜单添加到DOM后隐藏
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$introduction = this.$menu.find('.ac-game-menu-field-item-introduction');
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
            outer.root.playground.show("multi mode");
        });

        this.$introduction.click(function () {
            outer.hide();
            outer.root.introduction.show();
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
}
let AC_GAME_OBJECTS = [];

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
    late_update() {

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
            obj.timedelta = timestamp - last_timestamp;  // 存下来之后有用
            obj.update();
        }
    }
    for (let i = 0; i < AC_GAME_OBJECTS.length; i++) {
        let obj = AC_GAME_OBJECTS[i];
        obj.late_update();
    }
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_ANIMATION);
}
requestAnimationFrame(AC_GAME_ANIMATION);class ChatField {
    constructor(playground) {
        this.playground = playground;

        this.$history = $(`<div class="ac-game-chat-field-history">历史记录</div>`);
        this.$input = $(`<input type="text" class="ac-game-chat-field-input">`);

        this.$history.hide();
        this.$input.hide();

        this.func_id = null;

        this.playground.$playground.append(this.$history);
        this.playground.$playground.append(this.$input);

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;

        this.$input.keydown(function (e) {
            if (e.which === 27) {  // ESC
                outer.hide_input();
                return false;
            } else if (e.which === 13) {  // ENTER
                let username = outer.playground.root.settings.username;
                let text = outer.$input.val();
                if (text) {
                    outer.$input.val("");
                    outer.add_message(username, text);
                    outer.playground.mps.send_message(username, text);
                }
                return false;
            }
        });
    }

    render_message(message) {
        return $(`<div>${message}</div>`);
    }

    add_message(username, text) {
        this.show_history();
        let message = `[${username}]${text}`;
        this.$history.append(this.render_message(message));
        this.$history.scrollTop(this.$history[0].scrollHeight);  // 滚条，只显示最新的部分消息
    }

    show_history() {
        let outer = this;
        this.$history.fadeIn();  // 慢慢显示出来 渐变效果

        if (this.func_id) clearTimeout(this.func_id);

        this.func_id = setTimeout(function () { // 3秒后自动隐藏
            outer.$history.fadeOut();
            outer.func_id = null;
        }, 3000);
    }

    show_input() {
        this.show_history();

        this.$input.show();
        this.$input.focus();    // 聚焦到输入框
    }

    hide_input() {
        this.$input.hide();
        this.playground.game_map.$canvas.focus();
    }
}
class Grid extends AcGameObject {
    constructor(playground, ctx, i, j, l, stroke_color) {
        super();
        this.playground = playground;
        this.ctx = ctx;
        this.i = i;
        this.j = j;
        this.l = l;
        this.x = this.i * this.l;
        this.y = this.j * this.l;

        this.stroke_color = stroke_color;
        // this.has_grass = false; // 格子上有草否
        // this.is_poisoned = false; // 格子是否在毒圈
        this.fill_color = "rgb(210, 222, 238)";

        // console.log(this.i, this.j);

        // this.grass_color = "rgb(213, 198, 76)"; // grass yellow
    }

    start() { }

    get_manhattan_dist(x1, y1, x2, y2) {
        return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
    }

    // check_poison(x, y) {
    //     let nx = this.playground.game_map.nx;
    //     let ny = this.playground.game_map.ny;
    //     let d = Math.floor(this.playground.gametime_obj.gametime / 20); // 每20s毒向内扩散1格
    //     if (Math.min(x, y) < d || Math.min(Math.abs(x - (nx - 1)), Math.abs(y - (ny - 1))) < d) {
    //         return true;
    //     }
    //     return false;
    // }

    update() {
        // if (this.playground.gametime_obj && !this.is_poisoned && this.check_poison(this.i, this.j)) {
        //     this.poison = new Poison(this.playground, this);
        //     this.is_poisoned = true;
        // }
        this.render();
    }

    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy;
        let cx = ctx_x + this.l * 0.5, cy = ctx_y + this.l * 0.5; // grid的中心坐标
        // 处于屏幕范围外，则不渲染
        if (cx * scale < -0.2 * this.playground.width ||
            cx * scale > 1.2 * this.playground.width ||
            cy * scale < -0.2 * this.playground.height ||
            cy * scale > 1.2 * this.playground.height) {
            return;
        }

        this.render_grid(ctx_x, ctx_y, scale);
        // if (this.has_grass) {
        //     let player = this.playground.players[0];
        //     if (player.character === "me" && this.get_manhattan_dist(this.x + this.l / 2, this.y + this.l / 2, player.x, player.y) < 1.5 * this.l)
        //         this.grass_color = "rgba(213, 198, 76, 0.3)";
        //     else
        //         this.grass_color = "rgb(213, 198, 76)";
        //     this.render_grass(ctx_x, ctx_y, scale);
        // }
    }

    render_grid(ctx_x, ctx_y, scale) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.l * 0.03 * scale;
        this.ctx.strokeStyle = this.stroke_color;
        this.ctx.rect(ctx_x * scale, ctx_y * scale, this.l * scale, this.l * scale);
        this.ctx.stroke();
        this.ctx.restore();
    }

    // render_grass(ctx_x, ctx_y, scale) {
    //     this.ctx.save();
    //     this.ctx.beginPath();
    //     // this.ctx.lineWidth = this.l * 0.03 * scale;
    //     this.ctx.lineWidth = 0;
    //     this.ctx.rect(ctx_x * scale, ctx_y * scale, this.l * scale, this.l * scale);
    //     this.ctx.fillStyle = this.grass_color;
    //     this.ctx.fill();
    //     this.ctx.restore();
    // }

    // on_destroy() {
    //     if (this.poison) {
    //         this.poison.destroy();
    //         this.poison = null;
    //     }
    // }
}
class GameMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas tabindex=0></canvas>`); // 创建一个canvas元素
        this.ctx = this.$canvas[0].getContext('2d'); // 获取canvas的2d绘图上下文
        this.ctx.canvas.width = this.playground.width; // 设置canvas的宽度
        this.ctx.canvas.height = this.playground.height; // 设置canvas的高度
        this.playground.$playground.append(this.$canvas); // 将canvas添加到playground中  html标签都需要append到父标签中

        let width = this.playground.virtual_map_width;
        let height = this.playground.virtual_map_height;
        this.l = height * 0.05;

        // console.log(width, height, this.l)

        this.nx = Math.ceil(width / this.l);
        this.ny = Math.ceil(height / this.l);

        // console.log(this.nx, this.ny);
        // this.start();
    }
    start() {
        // console.log("start");
        this.$canvas.focus();
        this.generate_grid();
    }
    resize() {
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    generate_grid() {
        this.grids = [];
        for (let i = 0; i < this.ny; i++) {
            for (let j = 0; j < this.nx; j++) {
                // console.log(j, i);
                this.grids.push(new Grid(this.playground, this.ctx, j, i, this.l, "rgb(222, 237, 225)"));
            }
        }
    }
    update() {
        this.render();
    }
    render() {
        // this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        if (this.playground.players.length > 0 && this.playground.players[0].character === "me") {
            this.ctx.fillStyle = "rgba(136, 188, 194, 0.8)";
        } else {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        }
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    on_destroy() {
        for (let i = 0; i < this.grids.length; i++) {
            this.grids[i].destroy();
        }
        this.grids = [];
    }
}class MiniMap extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas class="mini-map"></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.bg_color = "rgba(0, 0, 0, 0.3)";
        this.bright_color = "rgba(247, 232, 200, 0.7)";
        this.players = this.playground.players; // TODO: 这里是浅拷贝?
        this.pos_x = this.playground.width - this.playground.height * 0.3; // 小地图左上角在canvas的坐标
        this.pos_y = this.playground.height * 0.7;
        this.width = this.playground.height * 0.3;
        this.height = this.width;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;

        this.playground.$playground.append(this.$canvas);
        this.real_map_width = this.playground.virtual_map_width;

        this.lock = false;
        this.drag = false;
    }

    start() {
        // this.add_listening_events();
    }

    // resize() {
    //     this.pos_x = this.playground.width - this.playground.height * 0.3;
    //     this.pos_y = this.playground.height * 0.7;
    //     this.width = this.playground.height * 0.3;
    //     this.height = this.width;
    //     this.ctx.canvas.width = this.width;
    //     this.ctx.canvas.height = this.height;

    //     this.margin_right = (this.playground.$playground.width() - this.playground.width) / 2;
    //     this.margin_bottom = (this.playground.$playground.height() - this.playground.height) / 2;
    //     this.$canvas.css({
    //         "position": "absolute",
    //         "right": this.margin_right + this.width / 2,
    //         "bottom": this.margin_bottom + this.height / 2
    //     });
    // }

    resize() {
        this.pos_x = this.playground.width - this.playground.height * 0.3;
        this.pos_y = this.playground.height * 0.7;
        this.width = this.playground.height * 0.3;
        this.height = this.width;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;

        // 计算小地图相对于画布的位置
        const margin_right = (this.playground.$playground.width() - this.playground.width) / 2;
        const margin_bottom = (this.playground.$playground.height() - this.playground.height) / 2;
        const left = this.playground.width - this.width - margin_right;
        const top = this.playground.height - this.height - margin_bottom;

        this.$canvas.css({
            "position": "absolute",
            "left": this.playground.$playground.width() - margin_right - this.width / 2 + "px",
            "top": margin_bottom + this.width / 2 + "px"
        });
    }


    // add_listening_events() {
    //     let outer = this;
    //     this.$canvas.on("contextmenu", function() {
    //         return false;
    //     });
    //     this.$canvas.mousedown(function(e) {
    //         if (outer.playground.state === "waiting") {
    //             return true;
    //         }

    //         const rect = outer.ctx.canvas.getBoundingClientRect();
    //         let ctx_x = e.clientX - rect.left, ctx_y = e.clientY - rect.top; // 小地图上的位置
    //         let tx = ctx_x / outer.width * outer.playground.virtual_map_width, ty = ctx_y / outer.height * outer.playground.virtual_map_height; // 大地图上的位置
    //         if (e.which === 1) { // 左键，定位屏幕中心
    //             outer.lock = true;
    //             outer.drag = false;

    //             outer.playground.focus_player = null;
    //             outer.playground.re_calculate_cx_cy(tx, ty);
    //             // (rect_x1, rect_y1)为小地图上框框的左上角的坐标（非相对坐标）
    //             outer.rect_x1 = ctx_x - (outer.playground.width / 2 / outer.playground.scale / outer.playground.virtual_map_width) * outer.width;
    //             outer.rect_y1 = ctx_y - (outer.playground.height / 2 / outer.playground.scale / outer.playground.virtual_map_height) * outer.height;
    //         } else if (e.which === 3) { // 右键，移动过去
    //             let player = outer.playground.players[0];
    //             if (player.character === "me") {
    //                 player.move_to(tx, ty);
    //                 if (outer.playground.mode === "multi mode") {
    //                     outer.playground.mps.send_move_to(tx, ty);
    //                 }
    //             }
    //         }
    //     });

    // this.$canvas.mousemove(function(e) {
    //     const rect = outer.ctx.canvas.getBoundingClientRect();
    //     let ctx_x = e.clientX - rect.left, ctx_y = e.clientY - rect.top; // 小地图上的位置
    //     let tx = ctx_x / outer.width * outer.playground.virtual_map_width, ty = ctx_y / outer.height * outer.playground.virtual_map_height; // 大地图上的位置
    //     if (e.which === 1) {
    //         if (outer.lock) {
    //             outer.drag = true;
    //             outer.playground.focus_player = null;
    //             outer.playground.re_calculate_cx_cy(tx, ty);
    //             outer.rect_x1 = ctx_x - (outer.playground.width / 2 / outer.playground.scale / outer.playground.virtual_map_width) * outer.width;
    //             outer.rect_y1 = ctx_y - (outer.playground.height / 2 / outer.playground.scale / outer.playground.virtual_map_height) * outer.height;
    //         }
    //     }
    // });

    // this.$canvas.mouseup(function(e) {
    //     if (outer.lock) outer.lock = false;
    //     outer.playground.game_map.$canvas.focus();
    // });
    // }

    update() {
        this.resize();
        this.render();
    }

    render() {
        let scale = this.playground.scale;
        this.ctx.clearRect(0, 0, this.width, this.height); // 清除画布上的内容，不加这行的话小地图背景会变黑
        this.ctx.fillStyle = this.bg_color; // 设置背景颜色
        this.ctx.fillRect(0, 0, this.width, this.height); // 绘制小地图背景
        if (this.playground.focus_player) {
            // 计算小地图上框框的左上角坐标
            this.rect_x1 = (this.playground.focus_player.x - this.playground.width / 2 / scale) / this.real_map_width * this.width;
            this.rect_y1 = (this.playground.focus_player.y - this.playground.height / 2 / scale) / this.real_map_width * this.height;
        }
        // 计算小地图上框框的宽度和高度
        let w = this.playground.width / scale / this.real_map_width * this.width;
        let h = this.playground.height / scale / this.real_map_width * this.height;
        this.ctx.save();
        this.ctx.strokeStyle = this.bright_color; // 设置框框的颜色
        this.ctx.setLineDash([15, 5]); // 设置虚线样式
        this.ctx.lineWidth = Math.ceil(3 * scale / 1080); // 设置框框的线宽
        this.ctx.strokeRect(this.rect_x1, this.rect_y1, w, h); // 绘制小地图上的框框
        this.ctx.restore();

        for (let i = 0; i < this.players.length; i++) {
            let obj = this.players[i];
            // if (obj.character != "me" && !obj.visible) // 玩家不可见则跳过
            //     continue;
            // 物体在真实地图上的位置 -> 物体在小地图上的位置
            let x = obj.x / this.real_map_width * this.width, y = obj.y / this.real_map_width * this.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.width * 0.02, 0, Math.PI * 2, false); // 绘制一个圆形
            // x, y: 圆心的坐标，物体在小地图上的位置
            // this.width * 0.05: 圆的半径，这里设为小地图宽度的5%
            // 0: 圆弧的起始角度，从0度开始
            // Math.PI * 2: 圆弧的终止角度，360度，即一个完整的圆
            // false: 画弧的方向，false表示顺时针方向
            if (obj.character === "me") this.ctx.fillStyle = "green"; // 自己的角色用绿色表示
            else this.ctx.fillStyle = "red"; // 其他角色用红色表示
            this.ctx.fill(); // 填充圆形
        }
    }


}
class NoticeBoard extends AcGameObject {
    constructor(playground) {
        super();

        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.text = "已就绪：0人";
    }

    start() {
    }

    write(text) {
        this.text = text;
    }

    update() {
        this.render();
    }

    render() {
        this.ctx.font = "20px serif";
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.text, this.playground.width / 2, 20);
    }
}
class Particle extends AcGameObject {
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
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        if (ctx_x < -0.1 * this.playground.width / scale ||
            ctx_x > 1.1 * this.playground.width / scale ||
            ctx_y < -0.1 * this.playground.height / scale ||
            ctx_y > 1.1 * this.playground.height / scale) {
            return;
        }

        this.ctx.beginPath();
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
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
        this.fireballs = [];
        if (this.character !== "bot") {
            this.img = new Image();
            this.img.src = this.photo;
        }
        if (this.character === "me") {
            this.fireball_coldtime = 3;  /// 技能冷却时间
            this.fireball_img = new Image();
            this.fireball_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png";

            this.blink_coldtime = 5;  // 单位：秒
            this.blink_img = new Image();
            this.blink_img.src = "https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png";
        } else if (this.character === "bot") {
            this.fireball_coldtime = 3;
        }
    }
    start() {    // 什么时候调用start方法？？  start和update都是在引擎里面执行的
        this.playground.player_count++;
        this.playground.notice_board.write("已就绪：" + this.playground.player_count + "人");
        if (this.playground.player_count >= 3) {
            this.playground.state = "fighting";
            this.playground.notice_board.write("游戏开始");
        }
        if (this.character === "me") {
            this.add_listening_events();
        } else if (this.character === "bot") { // 这里应该只让机器人随机游走
            let tx = Math.random() * 3;
            let ty = Math.random() * 3;
            this.move_to(tx, ty);
        }
    }
    add_listening_events() {

        let outer = this;

        this.playground.game_map.$canvas.on("contextmenu", function () {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function (e) {
            if (outer.playground.state !== "fighting") return false;
            const rect = outer.ctx.canvas.getBoundingClientRect();

            let tx = outer.playground.cx + (e.clientX - rect.left) / outer.playground.height;
            let ty = outer.playground.cy + (e.clientY - rect.top) / outer.playground.height;

            if (e.which === 3) {  // 右键
                outer.move_to(tx, ty);
                if (outer.playground.mode === "multi mode") {
                    outer.playground.mps.send_move_to(tx, ty);
                }
            } else if (e.which === 1) {
                if (outer.cur_skill === "fireball") {
                    if (outer.fireball_coldtime > outer.eps) return false;
                    let fireball = outer.shoot_fireball(tx, ty);
                    if (outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_shoot_fireball(tx, ty, fireball.uuid);
                    }
                } else if (outer.cur_skill === "blink") {
                    if (outer.blink_coldtime > outer.eps) return false;

                    outer.blink(tx, ty);

                    if (outer.playground.mode === "multi mode") {
                        outer.playground.mps.send_blink(tx, ty);
                    }

                }
                outer.cur_skill = null;
            }
        });
        this.playground.game_map.$canvas.keydown(function (e) {
            // console.log("keydown", e.which);
            if (e.which === 13) {  // enter
                if (outer.playground.mode === "multi mode") {  // 打开聊天框
                    outer.playground.chat_field.show_input();
                    return false;
                }
            } else if (e.which === 27) {  // esc
                if (outer.playground.mode === "multi mode") {  // 关闭聊天框
                    outer.playground.chat_field.hide_input();
                }
            }

            if (outer.playground.state !== "fighting") return true;

            if (e.which === 81) {  // q
                // console.log("q");
                if (outer.fireball_coldtime > outer.eps)
                    return true;

                outer.cur_skill = "fireball";
                return false;
            } else if (e.which === 70) {  // f
                // console.log("f");
                if (outer.blink_coldtime > outer.eps)
                    return true;

                outer.cur_skill = "blink";
                return false;
            } else if (e.which === 69) {  // e
                // console.log("e");
                outer.cur_skill = "guard";
                return false;
            }
        });

        this.playground.game_map.$canvas.keyup(function (e) {
            if (e.which === 69) {  // e
                // console.log("keyup e");
                outer.cur_skill = null;
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
        let fireball = new FireBall(this.playground, this, x, y, radius, vx, vy, 0.01, color, speed, move_length);
        //  输出这个palyer的uuid
        // console.log("shoot_fireball_player", this.uuid);
        // 输出发射的火球的详细信息
        // console.log("shoot_fireball", fireball.uuid, x, y, radius, vx, vy, 0.01, color, speed, move_length);
        this.fireballs.push(fireball);

        if (this.playground.mode === "multi mode") {
            this.fireball_coldtime = 0.2;
        } else {
            this.fireball_coldtime = 0.01;
        }
        return fireball;
    }
    destroy_fireball(uuid) {
        for (let i = 0; i < this.fireballs.length; i++) {
            let fireball = this.fireballs[i];
            if (fireball.uuid === uuid) {
                fireball.destroy();
                break;
            }
        }
    }

    blink(tx, ty) {
        let d = this.get_dist(this.x, this.y, tx, ty);
        d = Math.min(d, 0.8);
        let angle = Math.atan2(ty - this.y, tx - this.x);
        this.x += d * Math.cos(angle);
        this.y += d * Math.sin(angle);

        this.blink_coldtime = 1;
        this.move_length = 0;  // 闪现完停下来
    }

    get_dist(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    receive_attack(x, y, angle, damage, ball_uuid, attacker) {
        // 输出受到的攻击大小
        // console.log("receive_attack", damage, ball_uuid, attacker.uuid);
        attacker.destroy_fireball(ball_uuid);
        this.x = x;
        this.y = y;
        this.is_attacked(damage, angle);
    }


    move_to(x, y) {
        this.move_length = this.get_dist(this.x, this.y, x, y);
        let angle = Math.atan2(y - this.y, x - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(damage, angle) {

        //  输出受到的攻击大小
        // console.log("is_attacked", damage);
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
        this.spent_time += this.timedelta / 1000;
        this.update_win();
        if ((this.character === "me" && this.playground.state === "fighting") || this.character === "bot") {
            this.update_coldtime();
        }
        this.update_move();

        if (this.character === "me" && this.playground.state === "fighting") {
            this.playground.re_calculate_cx_cy(this.x, this.y);
        }
        this.render();
    }

    update_win() {
        if (this.playground.state === "fighting" && this.character === "me" && this.playground.players.length === 1) {
            this.playground.state = "over";
            this.playground.score_board.win();
        }
    }

    update_coldtime() {
        this.fireball_coldtime -= this.timedelta / 1000;
        this.fireball_coldtime = Math.max(this.fireball_coldtime, 0);

        this.blink_coldtime -= this.timedelta / 1000;
        this.blink_coldtime = Math.max(this.blink_coldtime, 0);
    }


    update_move() {
        if (this.character === "bot" && Math.random() < 1 / 180.0) {
            let index = Math.floor(Math.random() * this.playground.players.length);
            let player = this.playground.players[index];
            if (this.fireball_coldtime < this.eps) {
                this.shoot_fireball(player.x, player.y);
            }
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
                let tx = Math.random() * 3;
                let ty = Math.random() * 3;
                this.move_to(tx, ty);
            }
        } else {
            let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }
        if (this.character === "me" && this.playground.state === "fighting") {
            this.render_skill_coldtime();
        }

    }
    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        if (ctx_x < -0.2 * this.playground.width / scale ||
            ctx_x > 1.2 * this.playground.width / scale ||
            ctx_y < -0.2 * this.playground.height / scale ||
            ctx_y > 1.2 * this.playground.height / scale) {
            if (this.character != "me") { // 一个隐藏的bug，如果是玩家自己并且return，会导致技能图标渲染不出来
                return;
            }
        }
        if (this.character !== "bot") {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (ctx_x - this.radius) * scale, (ctx_y - this.radius) * scale, this.radius * scale * 2, this.radius * scale * 2);
            this.ctx.restore();
        } else {
            this.ctx.beginPath();
            this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
        if (this.character === "me" && this.playground.state === "fighting") {
            this.render_skill_coldtime();
        }
        if (this.cur_skill === "guard") {
            // 以圆形的2倍半径为半径绘制圆形线
            this.ctx.beginPath();
            this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale * 2, 0, Math.PI * 2, false);
            this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"; // 设置圆形线的颜色和透明度
            this.ctx.lineWidth = 2; // 设置线条宽度
            this.ctx.stroke();
        }
    }
    render_skill_coldtime() {
        let x = 1.5, y = 0.9, r = 0.04;
        let scale = this.playground.scale;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x - r) * scale, (y - r) * scale, r * scale * 2, r * scale * 2);
        this.ctx.restore();

        if (this.fireball_coldtime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.fireball_coldtime / 3) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
            this.ctx.fill();
        }

        x = 1.62, y = 0.9, r = 0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.blink_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        this.ctx.restore();

        if (this.blink_coldtime > 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * scale, y * scale);
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.blink_coldtime / 5) - Math.PI / 2, true);
            this.ctx.lineTo(x * scale, y * scale);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
            this.ctx.fill();
        }


    }
    on_destroy() {
        if (this.character === "me") {
            if (this.playground.state === "fighting") {
                this.playground.state = "over";
                this.playground.score_board.lose();
            }
        }

        for (let i = 0; i < this.playground.players.length; i++) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
                break;
            }
        }
    }

}class ScoreBoard extends AcGameObject {
    constructor(playground) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;

        this.state = null;  // win: 胜利，lose：失败

        this.win_img = new Image();
        this.win_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_8f58341a5e-win.png";

        this.lose_img = new Image();
        this.lose_img.src = "https://cdn.acwing.com/media/article/image/2021/12/17/1_9254b5f95e-lose.png";
    }

    start() {
    }

    add_listening_events() {
        let outer = this;
        let $canvas = this.playground.game_map.$canvas;

        $canvas.on('click', function () {
            outer.playground.hide();
            outer.playground.root.menu.show();
        });
    }

    win() {
        this.state = "win";

        let outer = this;
        setTimeout(function () {
            outer.add_listening_events();
        }, 1000);
    }

    lose() {
        this.state = "lose";

        let outer = this;
        setTimeout(function () {
            outer.add_listening_events();
        }, 1000);
    }

    late_update() {
        this.render();
    }

    render() {
        let len = this.playground.height / 2;
        if (this.state === "win") {
            this.ctx.drawImage(this.win_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        } else if (this.state === "lose") {
            this.ctx.drawImage(this.lose_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        }
    }
}
class FireBall extends AcGameObject {
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

        this.update_move();
        if (this.player.character !== "enemy") {
            this.update_attack();
        }


        this.render();
    }
    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player === player) continue;
            if (player.cur_skill === "guard" && this.is_collision_with_guard(player)) {
                this.destroy();
                break;
            } else if (this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }
    get_dist(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    is_collision(player) {
        let dist = this.get_dist(this.x, this.y, player.x, player.y);
        return dist < this.radius + player.radius;
    }
    is_collision_with_guard(player) {
        let dist = this.get_dist(this.x, this.y, player.x, player.y);
        return dist < this.radius + player.radius * 2;

    }
    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(this.damage, angle);

        if (this.playground.mode === "multi mode") {
            this.playground.mps.send_attack(player.uuid, player.x, player.y, angle, this.damage, this.uuid);
        }
        this.destroy();
    }
    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        if (ctx_x < -0.1 * this.playground.width / scale ||
            ctx_x > 1.1 * this.playground.width / scale ||
            ctx_y < -0.1 * this.playground.height / scale ||
            ctx_y > 1.1 * this.playground.height / scale) {
            return;
        }

        this.ctx.beginPath();
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        let fireballs = this.player.fireballs;
        for (let i = 0; i < fireballs.length; i++) {
            if (fireballs[i] === this) {
                fireballs.splice(i, 1);
                break;
            }
        }
    }

}class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;

        console.log("MultiPlayerSocket");

        this.ws = new WebSocket("wss://app1817.acapp.acwing.com.cn/wss/multiplayer/");

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
            } else if (event === "move_to") {
                outer.receive_move_to(uuid, data.tx, data.ty);
            } else if (event === "shoot_fireball") {
                outer.receive_shoot_fireball(uuid, data.tx, data.ty, data.ball_uuid);
            } else if (event === "attack") {
                outer.receive_attack(uuid, data.attackee_uuid, data.x, data.y, data.angle, data.damage, data.ball_uuid);
            } else if (event === "blink") {
                outer.receive_blink(uuid, data.tx, data.ty);
            } else if (event === "message") {
                outer.receive_message(uuid, data.username, data.text);
            }
        };
    }

    get_player(uuid) {
        let players = this.playground.players;
        for (let i = 0; i < players.length; i++) {
            let player = players[i];
            if (player.uuid === uuid)
                return player;
        }

        return null;
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

    send_move_to(tx, ty) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "move_to",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_move_to(uuid, tx, ty) {
        let player = this.get_player(uuid);

        if (player) {
            player.move_to(tx, ty);
        }
    }



    receive_create_player(uuid, username, photo) {
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
            0.05,
            "white",
            0.5,
            "enemy",
            username,
            photo,
        );

        player.uuid = uuid;
        this.playground.players.push(player);
    }

    send_shoot_fireball(tx, ty, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "shoot_fireball",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_shoot_fireball(uuid, tx, ty, ball_uuid) {
        let player = this.get_player(uuid);
        if (player) {
            let fireball = player.shoot_fireball(tx, ty);
            fireball.uuid = ball_uuid;
        }
    }

    send_attack(attackee_uuid, x, y, angle, damage, ball_uuid) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "attack",
            'uuid': outer.uuid,
            'attackee_uuid': attackee_uuid,
            'x': x,
            'y': y,
            'angle': angle,
            'damage': damage,
            'ball_uuid': ball_uuid,
        }));
    }

    receive_attack(uuid, attackee_uuid, x, y, angle, damage, ball_uuid) {
        let attacker = this.get_player(uuid);
        let attackee = this.get_player(attackee_uuid);

        if (attacker && attackee) {
            attackee.receive_attack(x, y, angle, damage, ball_uuid, attacker);
        }
    }

    send_blink(tx, ty) {
        // console.log("send_blink", this.uuid, tx, ty);
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "blink",
            'uuid': outer.uuid,
            'tx': tx,
            'ty': ty,
        }));
    }

    receive_blink(uuid, tx, ty) {
        // console.log("receive_blink", uuid, tx, ty);
        let player = this.get_player(uuid);
        if (player) {
            player.blink(tx, ty);
        }
    }

    send_message(username, text) {
        let outer = this;
        this.ws.send(JSON.stringify({
            'event': "message",
            'uuid': outer.uuid,
            'username': username,
            'text': text,
        }));
    }

    receive_message(uuid, username, text) {
        this.playground.chat_field.add_message(username, text);
    }




}
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
                    <img width="30" src="https://app1817.acapp.acwing.com.cn//static/image/settings/acwing_logo.png">
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
                    <img width="30" src="https://app1817.acapp.acwing.com.cn//static/image/settings/acwing_logo.png">
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
            url: "https://app1817.acapp.acwing.com.cn//settings/acwing/web/apply_code/",
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
            url: "https://app1817.acapp.acwing.com.cn//settings/login",
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
            url: "https://app1817.acapp.acwing.com.cn//settings/register",
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
            url: "https://app1817.acapp.acwing.com.cn//settings/logout",
            type: "GET",
            success: function (resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload();
                }
            }
        });
    }
    getinfo() {  // 是自动会把自己的信息发送给服务器吗？？
        //        console.log("getinfo");
        let outer = this;

        $.ajax({
            url: "https://app1817.acapp.acwing.com.cn//settings/getinfo",
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
        this.$ac_game = $('#' + id);   // $('#')用于选择有特定id的html元素

        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.introduction = new Introduction(this);
        this.playground = new AcGamePlayground(this);
        this.start();
    }
    start() {

    }
}