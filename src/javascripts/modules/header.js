import { userinfo } from '../common/service';
import method from '../common/method';

export default class Header {
  constructor(el) {
    this.$el = $(el);
    this.childMap = {};

    this.handleDom();
    this.render();
    this.bindEvents();
  }

  handleDom () {
    let $switch = $('.lang-switch'),
      $langLayer = $('.lang-fixed-layer'),
      $langWrap = $('.langs-wrap'),
      $langClose = $('.close-btn'),
      $langs = $('.langs');

    this.childMap.$switch = $switch;
    this.childMap.$langLayer = $langLayer;
    this.childMap.$langWrap = $langWrap;
    this.childMap.$langClose = $langClose;
    this.childMap.$langs = $langs;
  }

  render () {
    userinfo()
    .then(res => {
      if (res.success) {

      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  execInAnimation (callback) {
    const {
      $langLayer,
      $langWrap
    } = this.childMap;

    $langLayer.show().stop().animate({ opacity: 1 }, 300);
    $langWrap.stop().animate({ 'right': 0 });
  }

  execOutAnimation (callback) {
    const {
      $langLayer,
      $langWrap
    } = this.childMap;

    $langLayer.stop().animate({ opacity: 0 }, 300).hide(0);
    $langWrap.stop().animate({ 'right': '-320px' });
  }

  bindEvents () {
    const {
      $switch,
      $langClose
    } = this.childMap;

    // 多语言切换
    $switch.on('click', (e) => {
      this.execInAnimation();
    });

    // 关闭多语言
    $langClose.on('click', (e) => {
      this.execOutAnimation();
    });

  }
}