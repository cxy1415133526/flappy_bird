// 小鸟类
function Bird() {
    // 小鸟的位置，注意，这个位置就是以画布左上角为0、0点的坐标系中，小鸟的鸟心的位置。
    // 注意这个位置不是小鸟的左上角，而是小鸟的鸟心的位置
    this.x = game.canvas.width / 2;
    this.y = 100;
    // 旋转角度
    this.r = 0.1;
    // 下落增量，
    this.dy = 1;
    // 扑腾翅膀
    this.step = 0;
    // 状态，自己是否在向上飞
    this.isFly = false;
    // 自己AABB盒
    this.x1 = this.x - 57.67 / 2;   // this.x是鸟心，而this.x1是小鸟左边线，所以要减去宽度一半
    this.x2 = this.x + 57.67 / 2;
    this.y1 = this.y - 20;          // 小鸟的高度是40,20就是高度的一半
    this.y2 = this.y + 20;
}
// 更新方法
Bird.prototype.update = function () {
    // 状态模式，当这个小鸟现在不在向上飞的时候
    if (!this.isFly) {
        // 不在飞
        // 根据牛顿力学，下落增量是线性的，每帧变化量要增加
        this.dy += 0.6;

    } else {
        // 在飞，在飞的时候dy增加的快一点，真实，就是说小鸟向上飞的时候压力更大。
        this.dy += 0.9;
        // 判断dy如果是正数了，就切换回不飞状态
        if (this.dy > 0) {
            this.isFly = false;
        }
    }

    // y的增量
    this.y += this.dy;
    if(this.y < 0) {
        this.y = 0;
    }

    // 旋转
    this.r += 0.05;

    // 扑腾翅膀
    if (game.f % 3 == 0) {
        this.step++;
        if (this.step > 2) {
            this.step = 0;
        }
    }

    // 每帧都要更改自己的AABB盒
    this.x1 = this.x - 57.67 / 2;   // this.x是鸟心，而this.x1是小鸟左边线，所以要减去宽度一半
    this.x2 = this.x + 57.67 / 2;
    this.y1 = this.y - 20;      // 小鸟的高度是40,20就是高度的一半
    this.y2 = this.y + 20;

    // 判断鸟是否坠地
    if(this.y2 > game.canvas.height - 80 - 20){
        console.log('坠地了');
        game.gameover();
    }
};
// 渲染方法
Bird.prototype.render = function () {
    // 保存画布状态
    game.ctx.save();
    // 移动画布的原点到鸟心
    game.ctx.translate(this.x, this.y);
    // 旋转
    game.ctx.rotate(this.r);
    // 画
    game.ctx.drawImage(game.R.bird, 57.67 * this.step, 0, 57.67, 40, -57.67 / 2, -40 / 2, 57.67, 40);
    // 恢复画布状态
    game.ctx.restore();
};
// 飞方法
Bird.prototype.fly = function () {
    // 让开始飞的这一瞬间，dy的值是-20，瞬间将正数dy变为了一个负数
    // 并且这个负数绝对值还挺大的。这个绝对值会慢慢减小，就是说会向上飞越来越趋近于停
    this.dy = -18;
    // 让开始飞的这一瞬间，鸟头一定是斜向上的
    this.r = -1;
    // 设置状态为开始飞。为什么要设置一个状态呢，因为考拉老师觉得，鸟向上飞的时候dy应该更大一些，更快的要把速度减为0，逼真
    this.isFly = true;
    // 播放声音
    document.getElementById('so').load();
    document.getElementById('so').play();
};