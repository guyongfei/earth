import 'jquery-validation';
import EventEmitter from '../lib/event';
import method from '../common/method';
import { baseURL } from '../common/constants';
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
    this.count = 90;
    this.lastTime = null;
    this.remainTime = 301;
    this.imgToken = null;

    $(() => {
      this.handleDom();
      this.validateMethod();
      this.bindEvents();
      
      EventEmitter.call(this);
    });
    
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
      $valideCode = $('#valideImg');
    
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
    this.childMap.$valideCode = $valideCode;
  }

  render () {
    const { $valideCode } = this.childMap;

    this.imgToken = this.uuidv4();
    $valideCode.attr('src', `${baseURL}/verify-code/img?imgToken=${this.imgToken}`)
  }

  refreshCode () {
    const { $valideCode } = this.childMap;

    let date = new Date().getTime();

    if (this.lastTime) {
      this.remainTime = date - this.lastTime;
    }

    this.lastTime = date;
    if (this.remainTime < 300) return;

    this.imgToken = this.uuidv4();
    $valideCode.attr('src', `${baseURL}/verify-code/img?imgToken=${this.imgToken}`);
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
    $container.stop().animate({ 'top': '15%' });
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

  countDown (el) {
    $(el).attr('disabled', 'disabled').text(this.count+'s');
    this.timer = setInterval(() => {
      this.count--;
      $(el).text(this.count+'s');
      if (this.count == 0) {
        clearInterval(this.timer);
        this.count = 90;
        $(el).removeAttr('disabled').text($.t('common.again'));
      }
    }, 1000);
  }
  
  // validate method
  validateMethod () {
    $.validator.addMethod('pwdFormat', (value, el) => {
      return /[0-9a-zA-Z]{6,20}$/.test(value);
    })
  }

  uuidv4() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // 错误提示
  error (el, message) {
    el.find('.request-error').text(message).fadeIn(300);
    setTimeout(() => {
      el.find('.request-error').fadeOut(300);
    }, 3000);
  }

  switchEye (e, id) {
    let $this = $(e.currentTarget);

    if ($this.hasClass('close')) {
      $this.removeClass('close').addClass('open');
      $(id).attr('type', 'text');
    } else {
      $this.removeClass('open').addClass('close');
      $(id).attr('type', 'password');
    }
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

    this.count = 90;
    this.timer = null;

    $regForm.find('.send-code').removeAttr('disabled').text($.t('common.get'));
    $forgetForm.find('.send-code').removeAttr('disabled').text($.t('common.get'));

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
      $valideCode
    } = this.childMap;

    // 图片验证码
    $valideCode.on('click', (e) => {
      this.refreshCode();
    });

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
    $regLink.on('click', (e) => {
      this.render();
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
          required: $.t('error.email1'),
          email: $.t('error.email2')
        },
        password: {
          required: $.t('error.password1'),
          pwdFormat: $.t('error.password2')
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
        imgCode: {
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
          required: $.t('error.email1'),
          email: $.t('error.email2')
        },
        code: {
          required: $.t('error.code'),
        },
        imgCode: {
          required: $.t('error.imgCode')
        },
        password: {
          required: $.t('error.password1'),
          pwdFormat: $.t('error.password2')
        },
        confirm_password: {
          required: $.t('error.password3'),
          pwdFormat: $.t('error.password2'),
          equalTo: $.t('error.password4')
        },
        agree: {
          required: $.t('error.terms')
        }
      },
      // 给未通过验证的元素进行处理
      highlight: (el) => {
      },
      submitHandler: (form) => {
        register({
          email: this.trim($('#regEmail')),
          password: this.trim($('#regPassword')),
          verifyCode: this.trim($('#regCode')),
          imgToken: this.imgToken,
          imgVerifyCode: this.trim($('#imgCode'))
        })
        .then(res => {
          this.error($reg, $.t('register.success'))
          method.setCookie('logined', true);
          // 强制页面刷新
          setTimeout(() => {
            window.location.reload();
          }, 300);
        })
        .catch(err => {
          this.refreshCode();
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
          required: $.t('error.email1'),
          email: $.t('error.email2')
        },
        code: {
          required: $.t('error.code'),
        },
        password: {
          required: $.t('error.password1'),
          pwdFormat: $.t('error.password2')
        }
      },
      // 给未通过验证的元素进行处理
      highlight: (el) => {
      },
      submitHandler: (form) => {

        let email = this.trim($('#forgetEmail')),
          password = this.trim($('#forgetPassword')),
          verifyCode = this.trim($('#forgetCode'));

        passRequest('reset', email, password, verifyCode)
        .then(res => {
          this.error($forget, $.t('forget.success'));
          setTimeout(() => {
            $closeForm.trigger('click');
          }, 300);
        })
        .catch(err => {
          this.error($forget, err.message);
        });
      }
    });

    // 登录 密码切换
    $loginForm.on('click', '.btn-eye', (e) => {
      e.preventDefault();

      this.switchEye(e, '#loginPassword');
    });

    // 注册 密码切换
    // 忘记密码 密码切换
    $regForm.on('click', '.btn-pass-eye', (e) => {
      e.preventDefault();

      this.switchEye(e, '#regPassword');
    });

    $regForm.on('click', '.btn-confirm-eye', (e) => {
      e.preventDefault();

      this.switchEye(e, '#regConfirmPassword');
    });

    // 忘记密码 密码切换
    $forgetForm.on('click', '.btn-eye', (e) => {
      e.preventDefault();

      this.switchEye(e, '#forgetPassword');
    });


    // 注册时点击 获取验证码
    $regCodeBtn.on('click', (e) => {
      e.preventDefault();
      let $email = $('#regEmail'),
        $imgCode = $('#imgCode'),
        emailVal = this.trim($email),
        imgCodeVal = this.trim($imgCode);

      if (!$regForm.validate().element($imgCode) || !$regForm.validate().element($email)) return;
      
      emailCode('register', emailVal, this.imgToken, imgCodeVal)
      .then(res => {
        this.countDown($regCodeBtn);
        this.error($reg, $.t('common.sendSuccess'));
      })
      .catch(err => {
        this.refreshCode();
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
        this.error($forget, $.t('common.sendSuccess'));
      })
      .catch(err => {
        this.error($forget, err.message);
      });
    });

  }

}

extendMethod(Baseform.prototype, EventEmitter.prototype);