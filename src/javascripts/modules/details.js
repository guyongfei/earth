
export default class Details {
  constructor(el) {
    this.$el = $(el);
    this.childMap = {};
    this.handleDom();
    this.render();
    this.bindEvents();
  }

  handleDom () {
    let $head = $('.box-head');

    this.childMap.$head = $head;
  }

  //千分位
  thousandsFormatter (number) {
    let num = (number || 0).toString(),
      result = '';
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
  }

  // 初始化
  render () {
    const {
      $head
    } = this.childMap;
    console.log(this.thousandsFormatter(12334))
    $head.find('.sale-numbers').text(this.thousandsFormatter(1231324254));
  }

  // 绑定的事件
  bindEvents () {

  }

}
