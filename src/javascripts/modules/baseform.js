import 'jquery-validation';
import EventEmitter from '../lib/event';
import method from '../common/method';
import { extendMethod } from '../common/utils';
import { emailCode, login, register, forget, passRequest } from '../common/service';

export default class Baseform {
  constructor(el) {
    this.$el = $(el);
    this.childMap = {};
    this.loginValidator = null;
    this.regValidator = null;
    this.forgetValidator = null;
    this.timer = null;
    this.count = 60;
    this.handleDom();
    this.validateMethod();
    this.bindEvents();

    EventEmitter.call(this);
  }

  handleDom () {
    let $container = $('.form-container'),
      $login = $('.login-form-container'),
      $reg = $('.register-form-container'),
      $forget = $('.forget-form-container'),
      $loginForm = $('#loginForm'),
      $regForm = $('#regForm'),
      $forgetForm = $('#forgetForm'),
      $regCodeBtn = $regForm.find('.send-code'),
      $forgetCodeBtn = $forgetForm.find('.send-code'),
      $loginLink = $('.login-link'),
      $regLink = $('.register-link'),
      $forgetLink = $('.forget-link'),
      $loginFoot = $('.f-login-btn'),
      $closeForm = $('.form-close'),
      $loginHead = $('.login'),
      $langLayer = $('.lang-fixed-layer'),
      $langWrap = $('.langs-wrap');
  
    this.childMap.$login = $login;
    this.childMap.$reg = $reg;
    this.childMap.$forget = $forget;
    this.childMap.$loginForm = $loginForm;
    this.childMap.$regForm = $regForm;
    this.childMap.$forgetForm = $forgetForm;
    this.childMap.$regCodeBtn = $regCodeBtn;
    this.childMap.$forgetCodeBtn = $forgetCodeBtn;
    this.childMap.$loginLink = $loginLink;
    this.childMap.$regLink = $regLink;
    this.childMap.$forgetLink = $forgetLink;
    this.childMap.$container = $container;
    this.childMap.$loginFoot = $loginFoot;
    this.childMap.$closeForm = $closeForm;
    this.childMap.$loginHead = $loginHead;
    this.childMap.$langLayer = $langLayer;
    this.childMap.$langWrap = $langWrap;
  }

  execInAnimation (callback) {
    const {
      $login,
      $reg,
      $forget,
      $container
    } = this.childMap;

    $login.show();
    $reg.hide();
    $forget.hide();
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

  slideExecOutAnimation (callback) {
    const {
      $langLayer,
      $langWrap
    } = this.childMap;

    $langLayer.stop().animate({ opacity: 0 }, 300).hide(0);
    $langWrap.stop().animate({ 'right': '-320px' });
  }

  // trim
  trim (el) {
    return $.trim(el.val());
  }

  countDown (el) {
    $(el).attr('disabled', 'disabled').text(this.count+'s');
    this.timer = setInterval(() => {
      this.count--;
      $(el).text(this.count+'s');
      if (this.count == 0) {
        clearInterval(this.timer);
        this.count = 60;
        $(el).removeAttr('disabled').text('重新获取');
      }
    }, 1000);
  }
  
  // validate method
  validateMethod () {
    $.validator.addMethod('pwdFormat', (value, el) => {
      return /[0-9a-zA-Z]{6,20}$/.test(value);
    })
  }

  // 错误提示
  error (el, message) {
    el.find('.request-error').text(message).fadeIn(300);
    setTimeout(() => {
      el.find('.request-error').fadeOut(300);
    }, 3000);
  }
  
  // 销毁事件
  destroy () {
    const {
      $login,
      $reg,
      $forget,
      $regForm,
      $forgetForm
    } = this.childMap;

    document.getElementById('loginForm').reset();
    document.getElementById('regForm').reset();
    document.getElementById('forgetForm').reset();

    this.count = 60;
    this.timer = null;

    $regForm.find('.send-code').removeAttr('disabled').text('获取验证码');
    $forgetForm.find('.send-code').removeAttr('disabled').text('获取验证码');

    this.loginValidator.resetForm();
    this.regValidator.resetForm();
    this.forgetValidator.resetForm();

  }

  bindEvents () {
    const {
      $login,
      $reg,
      $forget,
      $loginForm,
      $regForm,
      $forgetForm,
      $regCodeBtn,
      $forgetCodeBtn,
      $loginFoot,
      $closeForm,
      $regLink,
      $loginLink,
      $forgetLink,
      $loginHead
    } = this.childMap;

    // 底部登录事件
    $loginFoot.on('click', (e) => {
      this.execInAnimation();
    });

    // 侧边栏登录事件
    $loginHead.on('click', (e) => {
      this.slideExecOutAnimation();
      this.execInAnimation();
    });

    // 关闭登录|注册|忘记密码弹窗
    $closeForm.on('click', (e) => {
      this.execOutAnimation((() => {
        this.destroy();
      }));
    });

    // 显示注册弹窗
    $regLink.on('click', (e) => {
      $login.hide();
      $reg.show();
    });

    // 显示登录弹窗
    $loginLink.on('click', (e) => {
      $reg.hide();
      $login.show();
    });

    // 忘记密码弹窗
    $forgetLink.on('click', (e) => {
      $login.hide();
      $forget.show();
    });

    // 表单提交事件
    // 登录表单检验
    this.loginValidator = $loginForm.validate({
      rules: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          pwdFormat: true
        }
      },
      messages: {
        email: {
          required: '请输入您的邮箱地址',
          email: '请输入正确的邮箱地址'
        },
        password: {
          required: '请输入您的密码',
          pwdFormat: '请输入6-20位字母或者数字'
        }
      },
      // 给未通过验证的元素进行处理
      highlight: (el) => {
      },
      submitHandler: (form) => {
        login({
          email: this.trim($('#loginEmail')),
          password: this.trim($('#loginPassword'))
        })
        .then(res => {
          method.setCookie('logined', true);
          this.error($login, 'Login successed!');
          setTimeout(() => {
            window.location.reload();
          }, 300);
        })
        .catch(err => {
          this.error($login, err.message);
        });
      }
    });

    // 注册表单校验
    this.regValidator = $regForm.validate({
      rules: {
        email: {
          required: true,
          email: true
        },
        code: {
          required: true
        },
        password: {
          required: true,
          pwdFormat: true
        },
        confirm_password: {
          required: true,
          pwdFormat: true,
          equalTo: '#regPassword'
        },
        agree: {
          required: true
        }
      },
      messages: {
        email: {
          required: '请输入您的邮箱地址',
          email: '请输入正确的邮箱地址'
        },
        code: {
          required: '请输入验证码',
        },
        password: {
          required: '请输入您的密码',
          pwdFormat: '请输入6-20位字母或者数字'
        },
        confirm_password: {
          required: '请再次输入密码',
          pwdFormat: '请输入6-20位字母或者数字',
          equalTo: '两次输入的密码需要一致'
        },
        agree: {
          required: '请同意条款和条件,以创建帐户'
        }
      },
      // 给未通过验证的元素进行处理
      highlight: (el) => {
      },
      submitHandler: (form) => {
        register({
          email: this.trim($('#regEmail')),
          password: this.trim($('#regPassword')),
          verifyCode: this.trim($('#regCode'))
        })
        .then(res => {
          this.error($reg, 'Register successed!!')
          method.setCookie('logined', true);
          // 强制页面刷新
          setTimeout(() => {
            window.location.reload();
          }, 300);
        })
        .catch(err => {
          this.error($reg, err.message);
        });
      }
    });

    // 忘记密码表单校验
    this.forgetValidator = $forgetForm.validate({
      rules: {
        email: {
          required: true,
          email: true
        },
        code: {
          required: true
        },
        password: {
          required: true,
          pwdFormat: true
        }
      },
      messages: {
        email: {
          required: '请输入您的邮箱地址',
          email: '请输入正确的邮箱地址'
        },
        code: {
          required: '请输入验证码',
        },
        password: {
          required: '请输入您的密码',
          pwdFormat: '请输入6-20位字母或者数字'
        }
      },
      // 给未通过验证的元素进行处理
      highlight: (el) => {
      },
      submitHandler: (form) => {
        console.log(form);
        let email = this.trim($('#forgetEmail')),
          password = this.trim($('#forgetPassword')),
          verifyCode = this.trim($('#forgetCode'));

        passRequest('reset', email, password, verifyCode)
        .then(res => {
          this.error($forget, 'Reset password successed!');
          setTimeout(() => {
            $closeForm.trigger('click');
          }, 300);
        })
        .catch(err => {
          this.error($forget, err.message);
        });
      }
    });

    // 注册时点击 获取验证码
    $regCodeBtn.on('click', (e) => {
      e.preventDefault();
      let $email = $('#regEmail'),
        emailVal = this.trim($email);

      if (!$regForm.validate().element($email)) return;
      emailCode('register', emailVal)
      .then(res => {
        this.countDown($regCodeBtn);
        this.error($reg, '验证码已经发送至邮箱');
      })
      .catch(err => {
        this.error($reg, err.message);
      });
    });

    // 忘记密码点击 获取验证码
    $forgetCodeBtn.on('click', (e) => {
      e.preventDefault();
      let $email = $('#forgetEmail'),
        emailVal = this.trim($email);

      if (!$forgetForm.validate().element($email)) return;
      emailCode('other', emailVal)
      .then(res => {
        this.countDown($forgetCodeBtn);
        this.error($forget, '验证码已经发送至邮箱');
      })
      .catch(err => {
        this.error($forget, err.message);
      });
    });

  }

}

extendMethod(Baseform.prototype, EventEmitter.prototype);