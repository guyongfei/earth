import method from '../common/method';
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
      $regEmail = $register.find('.r-email'),
      $regPass = $register.find('.r-password'),
      $regConfirm = $register.find('.r-confirm-pass'),
      $regCode = $register.find('.r-code'),
      $regBox = $register.find('.r-checkbox'),
      $forgetEmail = $('.f-email'),
      $forgetOld = $('.f-old-password'),
      $forgetNew = $('.f-new-password'),
      $lEmailError = $login.find('.l-email-error'),
      $lPassError = $login.find('.l-password-error'),
      $rEmailError = $register.find('.r-email-error'),
      $rCodeError = $register.find('.r-code-error'),
      $rPassError = $register.find('.r-pass-error'),
      $rConfirmError = $register.find('.r-confirm-error'),
      $rBoxError = $register.find('.r-box-error');

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
    this.childMap.$regCode = $regCode;
    this.childMap.$regConfirm = $regConfirm;
    this.childMap.$regBox = $regBox;

    this.childMap.$forgetEmail = $forgetEmail;
    this.childMap.$forgetOld = $forgetOld;
    this.childMap.$forgetNew = $forgetNew;

    this.childMap.$lEmailError = $lEmailError;
    this.childMap.$lPassError = $lPassError;
    this.childMap.$rEmailError = $rEmailError;
    this.childMap.$rCodeError = $rCodeError;
    this.childMap.$rPassError = $rPassError;
    this.childMap.$rConfirmError = $rConfirmError;
    this.childMap.$rBoxError = $rBoxError;
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

  // trim
  trim (el) {
    return $.trim(el.val());
  }

  // error
  error (el, msg, flag) {
    return flag ? el.text(msg).show() : el.text('').hide();
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
      $loginLink,
      $regEmail,
      $regPass,
      $regCode,
      $regConfirm,
      $regBox,
      $lEmailError,
      $lPassError,
      $rEmailError,
      $rPassError,
      $rCodeError,
      $rConfirmError
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

    // 显示注册弹窗
    $registerLink.on('click', (e) => {
      $login.hide();
      $register.show();
    });

    // 显示登录弹窗
    $loginLink.on('click', (e) => {
      $register.hide();
      $login.show();
    });

    // 表单提交事件
    // 登录
    $loginSubmit.on('click', (e) => {
      
    });

    // 注册
    $regSubmit.on('click', (e) => {
      let email = this.trim($regEmail),
        code = this.trim($regCode),
        pass = this.trim($regPass),
        confirmPass = this.trim($regConfirm);

      if (method.isEmpty(email)) {
        this.error($rEmailError, '请输入邮箱');
      } else if (!method.emailFormat(email)) {
        this.error($rEmailError, '邮箱格式不正确');
      } else {
        console.log('aaaaaaa')
      }

    });


  }

}
