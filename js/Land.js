// 大地类
function Land() {
    // 打头的那个大地（因为大地是平铺22张的）的x值
    this.x = 0;
}
Land.prototype.update = function () {
    this.x -= 2;
    // 只动一个图，就瞬间拉回来
    if (this.x < - 23.125) {
        this.x = 0;
    }
};
Land.prototype.render = function () {
    // 画22个
    for (var i = 0; i < 22; i++) {
        game.ctx.drawImage(game.R['land'], 23.125 * i + this.x, game.canvas.height - 80, 23.125, 80);
    }
};