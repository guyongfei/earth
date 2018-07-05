import { userinfo, logout } from '../common/service';
import method from '../common/method';
import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';
import en from '../../i18/en';
import cn from '../../i18/cn';
import getModule from './index';

export default class Header {
  constructor(el) {
    this.$el = $(el);
    this.childMap = {};

    $(() => {
      this.handleDom();
      this.headRender();
      this.languageInit();
      this.bindEvents();
      this.baseForm = getModule('baseform');
    });

    
  }

  handleDom () {
    let $switch = $('.lang-switch'),
      $langLayer = $('.lang-fixed-layer'),
      $langWrap = $('.langs-wrap'),
      $langClose = $('.close-btn'),
      $langs = $('.langs'),
      $nickname = $('.nickname'),
      $login = this.$el.find('.login'),
      $logined = this.$el.find('.logined'),
      $logout = this.$el.find('.logout'),
      $footer = $('#footer');

    this.childMap.$switch = $switch;
    this.childMap.$langLayer = $langLayer;
    this.childMap.$langWrap = $langWrap;
    this.childMap.$langClose = $langClose;
    this.childMap.$langs = $langs;
    this.childMap.$nickname = $nickname;
    this.childMap.$login = $login;
    this.childMap.$logined = $logined;
    this.childMap.$logout = $logout;
    this.childMap.$footer = $footer;

  }

  headRender () {
    const {
      $login,
      $logined,
      $logout,
      $footer,
      $nickname
    } = this.childMap;

    // let logined = method.getCookie('logined');

    // if (logined) {
    userinfo()
    .then(res => {
      if (res.success) {
        let data = res.data;
        $login.hide();
        $logined.show();
        $footer.hide();
        $nickname.text(data.nickname);
        $logout.show();
      }
    })
    .catch(err => {
      console.log(err);
    });
    // }

  }

  languageInit () {
    const {
      $switch,
      $langs
    } = this.childMap;

    let i18;
    let lang = method.getCookie('international.language');

    if (method.isEmpty(lang)) {
      lang = 'en';
      method.setCookie('international.language', 'en');
    }

    if (lang == 'en') {
      $switch.find('.lang-btn').text('English');
      $langs.children().eq(0).addClass('l-active');
    } else {
      $switch.find('.lang-btn').text('简体中文');
      $langs.children().eq(1).addClass('l-active');
    }

    i18 = lang == 'cn' ? cn : en;

    // i18 next
    // i18 next
    i18next.init({
      lng: lang,
      resources: {
        ...i18
      }
    }, function(err, t) {
      jqueryI18next.init(i18next, $);
      $(document).localize();
    });

  }

  execInAnimation (callback) {
    const {
      $langLayer,
      $langWrap,
      $logout
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
      $langClose,
      $login,
      $logout,
      $langs
    } = this.childMap;

    // 侧边栏
    $switch.on('click', (e) => {
      this.execInAnimation();
    });

    // 登录
    $login.on('click', (e) => {
      this.execOutAnimation();
      this.baseForm.execInAnimation();
    });

    // 关闭多语言
    $langClose.on('click', (e) => {
      this.execOutAnimation();
    });

    // 多语言切换事件
    $langs.on('click', '.lang', (e) => {
      console.log(e);
      let $this = $(e.currentTarget),
        lang = $this.data('lang');
      
      if ($this.hasClass('l-active')) return;
      method.setCookie('international.language', lang);
      $this.addClass('l-active').siblings().removeClass('l-active');
      location.reload();
    });

    // 退出登录
    $logout.on('click', '.btn-logout', (e) => {
      logout()
      .then(res => {
        method.removeCookie('logined');
        location.href = './index.html';
      })
      .catch(er => {
        console.log(err);
      });
    });

  }
}