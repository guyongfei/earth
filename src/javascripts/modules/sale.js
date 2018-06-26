import QRCode from 'qrcodejs2';
import 'jquery-validation';
import method from '../common/method';
import {
  setUserAddress,
  getUserAddress,
  submitTransaction,
  getTransactions,
  ownerTransaction
} from '../common/service';

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
    $walletForm = $('#wallet-form'),
    $tokenForm = $('#token-form');

    this.childMap.$steps = $steps;
    this.childMap.$wallet = $wallet;
    this.childMap.$token = $token;
    this.childMap.$result = $result;
    this.childMap.$walletForm = $walletForm;
    this.childMap.$tokenForm = $tokenForm;
  }

  // 页面初始化
  render() {
    const {
      $token
    } = this.childMap;

    this.gid = method.getUrlParam('gid');

    var qrcode = new QRCode(document.getElementById("qrcode"), {
      text: 'https://www.baidu.com',
      width : 100,
      height : 100,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }

   // validate method
   validateMethod () {
    $.validator.addMethod('walletFormat', (value, el) => {
      return /^(0x)?([a-fA-F0-9]{40})$/.test(value);
    });

    $.validator.addMethod('hashFormat', (value, el) => {
      return /^0x?([A-Fa-f0-9]{64})$/.text(value);
    });

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
      $walletForm,
      $tokenForm
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

    // 购买代币
    $tokenForm.validate({
      rules: {
        payAmount: {
          required: true,
          number: true
        },
        getAmount: {
          required: true,
          min: 1
        },
        payId: {
          required: true,
          hashFormat: true
        }
      },
      messages: {
        payAmount: {
          required: '输入有效号码',
          number: '请输入合法的数字'
        },
        getAmount: {
          required: '输入有效号码',
          min: '最小购买量为10 000VRA(~0.22679 ETH)'
        },
        payId: {
          required: '输入一个有效的TX散列(在您的钱包旁边找到的一个长字符串)'
        }
      },
      // 给未通过验证的元素进行处理
      highlight: (el) => {
      },
      submitHandler: (form) => {
        console.log('ajax');
        // $token.on('click', '.btn-confirm', (e) => {
        //   submitTransaction({
        //     projectGid: this.gid,
        //     priceRate: 500.0,
        //     payAmount: 1.0,
        //     payCoinType: 0,
        //     payTx: "0xdc9f30b716597999eafa0cabaa0b33423845e2f13d4c30d845018d4cf7bad959",
        //     hopeGetAmount: 500
        //   })
        //   .then(res => {
        //     console.log(res);
        //   })
        //   .catch(err => {
        //     console.log(er);
        //   })
        // });
      }
    });

    $tokenForm.on('input', '#payAmount', (e) => {
      console.log(e);
      let currentValue = this.trim($(e.currentTarget));
      console.log(currentValue);
    });

    // ownerTransaction('0xdc9f30b716597999eafa0cabaa0b33423845e2f13d4c30d845018d4cf7bad959')
    // .then(res => {

    // })
    // .catch(err => {
    //   console.log(err);
    // });

    // getTransactions('0xdc9f30b716597999eafa0cabaa0b33423845e2f13d4c30d845018d4cf7bad959', '', '', '', '')
    // .then(res => {

    // })
    // .catch(err => {
    //   console.log(err);
    // });

  }
}
