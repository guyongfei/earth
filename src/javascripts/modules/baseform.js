export default class Baseform {
  constructor(el) {
    this.$el = $(el);
    this.childMap = {};
    this.handleDom();
    this.bindEvents();
  }

  handleDom () {
    let $container = $('.form-container'),
      $login = $('.login-form'),
      $register = $('.register-form'),
      $forget = $('.forget-form'),
      $loginSubmit = this.$el.find('.l-submit-button'),
      $regSubmit = this.$el.find('.r-submit-button'),
      $forgetSubmit = this.$el.find('.f-submit-button'),
      $loginLink = $('.login-link'),
      $registerLink = $('.register-link'),
      $loginFoot = $('.f-login-btn'),
      $closeForm = $('.form-close'),
      $loginEmail = $('.l-email'),
      $loginPass = $('.l-passowrd'),
      $regEmail = $('.r-email'),
      $regPass = $('.r-password'),
      $forgetEmail = $('.f-email'),
      $forgetOld = $('.f-old-password'),
      $forgetNew = $('.f-new-password');

    this.childMap.$login = $login;
    this.childMap.$register = $register;
    this.childMap.$forget = $forget;
    this.childMap.$loginSubmit = $loginSubmit;
    this.childMap.$regSubmit = $regSubmit;
    this.childMap.$forgetSubmit = $forgetSubmit;
    this.childMap.$loginLink = $loginLink;
    this.childMap.$registerLink = $registerLink;
    this.childMap.$container = $container;
    this.childMap.$loginFoot = $loginFoot;
    this.childMap.$closeForm = $closeForm;
    this.childMap.$loginEmail = $loginEmail;
    this.childMap.$loginPass = $loginPass;
    this.childMap.$regEmail = $regEmail;
    this.childMap.$regPass = $regPass;
    this.childMap.$forgetEmail = $forgetEmail;
    this.childMap.$forgetOld = $forgetOld;
    this.childMap.$forgetNew = $forgetNew;
  }

  execInAnimation (callback) {
    const {
      $container
    } = this.childMap;

    this.$el.show().stop().animate({ opacity: 1 }, 300);
    $container.stop().animate({ 'top': '20%' });
  }

  execOutAnimation (callback) {
    const {
      $container
    } = this.childMap;

    this.$el.stop().animate({ opacity: 0 }, 300).hide(0);
    $container.stop().animate({ 'top': 0 });

    callback && callback();
  }

  // 错误提示
  error (el, msg) {
    return $(el).text(msg);
  }

  // 销毁事件
  destroy () {
    const {
      $login,
      $register,
      $forget
    } = this.childMap;
  }

  bindEvents () {
    const {
      $login,
      $register,
      $forget,
      $loginSubmit,
      $regSubmit,
      $forgetSubmit,
      $loginFoot,
      $closeForm,
      $registerLink,
      $loginLink
    } = this.childMap;

    // 底部登录事件
    $loginFoot.on('click', (e) => {
      this.execInAnimation();
    });

    // 关闭登录|注册|忘记密码弹窗
    $closeForm.on('click', (e) => {
      this.execOutAnimation((() => {
        this.destroy();
      }));
    });

    // 去注册事件
    $registerLink.on('click', (e) => {
      $login.hide();
      $register.show();
    });

    // 去登录事件
    $loginLink.on('click', (e) => {
      $register.hide();
      $login.show();
    });

    // 表单提交事件
    $loginSubmit.on('click', (e) => {
    });

  }

}
