export class AcGame {
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