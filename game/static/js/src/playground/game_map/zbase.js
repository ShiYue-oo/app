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
}