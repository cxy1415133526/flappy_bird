// 死亡场景
function GameOverScene() {
    // 一旦游戏gameover了，就new出它了
    // 它从被new出来的一瞬间开始呢，就开始记录帧编号
    this.f = 0;
}
GameOverScene.prototype.update = function () {
    // 帧编号加1
    this.f ++;
    // 死亡之后的40帧以内，显示gameover字样，下移动画
    if(this.f < 40) {
        // gameover字样的y，减去54是因为这个字的图片是54高度的。
        this.goY = this.f * 6 - 54;
    }
}
GameOverScene.prototype.render = function () {
    // 计算
    game.ctx.drawImage(game.R['gameover'], game.canvas.width / 2 - 204 / 2, this.goY);
    // 死亡之后40帧之后，显示按钮
    if(this.f > 40) {
        game.ctx.drawImage(game.R['btn'], game.canvas.width / 2 - 116 / 2, 280);
    }
}