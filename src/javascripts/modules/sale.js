import { QRCode } from 'qrcodejs';
import 'jquery-validation';
import method from '../common/method';
import { setUserAddress, getUserAddress } from '../common/service';

export default class Sale {
  constructor(el) {
    this.$el = $(el);
    this.childMap = {};
    this.flag = false;
    this.gid = null;

    this.validateMethod();
    this.render();
    this.handleDom();
    this.bindEvents();
  }

  handleDom() {
  let $steps = $('.steps'),
    $wallet = $('.wallet-container'),
    $token = $('.token-container'),
    $result = $('.result-container'),
    $walletForm = $('#wallet-form');

    this.childMap.$steps = $steps;
    this.childMap.$wallet = $wallet;
    this.childMap.$token = $token;
    this.childMap.$result = $result;
    this.childMap.$walletForm = $walletForm;
  }

  // 页面初始化
  render() {
    const {
      $token
    } = this.childMap;

    this.gid = method.getUrlParam('gid');

    // let code = new QRCode(document.getElementById("qrcode"), {
    //   width : 100,
    //   height : 100
    // });

  }

   // validate method
   validateMethod () {
    $.validator.addMethod('walletFormat', (value, el) => {
      return /^(0x)?([a-fA-F0-9]{40})$/.test(value);
    })
  }

  // trim
  trim (el) {
    return $.trim(el.val());
  }

  // 绑定的事件
  bindEvents() {
    const {
      $steps,
      $wallet,
      $token,
      $result,
      $walletForm
    } = this.childMap;

    // Tab 切换
    $steps.on('click', '.step', (e) => {
      if (!this.flag) return;
      let $this = $(e.currentTarget),
        index = $this.index();

      console.log(index);
      $this.addClass('active').siblings().removeClass('active');
    });

    // 表单提交事件
    // 钱包地址弹窗，点击下一步
     $walletForm.validate({
      rules: {
        receiving: {
          required: true,
          walletFormat: true
        },
        sending: {
          required: true,
          walletFormat: true
        }
      },
      messages: {
        receiving: {
          required: '输入您的收款钱包地址',
          walletFormat: '输入一个有效的ETH钱包地址(以0x开头及42个字符长度)'
        },
        sending: {
          required: '输入您的发送ETH的钱包地址',
          walletFormat: '输入一个有效的ETH钱包地址(以0x开头及42个字符长度)'
        }
      },
      // 给未通过验证的元素进行处理
      highlight: (el) => {
      },
      submitHandler: (form) => {
        console.log('ajax');
        setUserAddress({
          projectGid: this.gid,
          getTokenAddress: this.trim($('#receiving-wallet')),
          payEthAddress: this.trim($('#sending-wallet'))
        })
        .then(res => {
          $wallet.hide();
          $token.show();
          $result.hide();
        })
        .catch(err => {
          console.log(err.message);
        });

      }
    });

  }
}
