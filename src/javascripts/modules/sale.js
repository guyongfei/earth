import QRCode from 'qrcodejs2';
import 'jquery-validation';
import method from '../common/method';
import {
  setUserAddress,
  getTransactionInfo,
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
    this.priceRate = null;
    this.defaultEth = 2;
    this.payTx = null;

    this.validateMethod();
    this.handleDom();
    this.render();
    this.bindEvents();
  }

  handleDom() {
  let $steps = $('.steps'),
    $wallet = $('.wallet-container'),
    $token = $('.token-container'),
    $result = $('.result-container'),
    $walletForm = $('#wallet-form'),
    $tokenForm = $('#token-form'),
    $payInput = $('#payAmount'),
    $getInput = $('#getAmount');

    this.childMap.$steps = $steps;
    this.childMap.$wallet = $wallet;
    this.childMap.$token = $token;
    this.childMap.$result = $result;
    this.childMap.$walletForm = $walletForm;
    this.childMap.$tokenForm = $tokenForm;
    this.childMap.$payInput = $payInput;
    this.childMap.$getInput = $getInput;
  }

  // 页面初始化
  render() {
    const {
      $steps,
      $token,
      $wallet,
      $result,
      $walletForm,
      $tokenForm,
      $getInput,
      $payInput
    } = this.childMap;

    this.gid = method.getUrlParam('gid');

    // 用户项目交易信息
    getTransactionInfo(this.gid)
    .then(res => {
      if (res.success) {
        
        let result = res.data,
          payEthAddress = result.payEthAddress,
          getTokenAddress = result.getTokenAddress;

        this.priceRate = result.priceRate;
        this.payTx = result.platformAddress;

        if (!method.isEmpty(payEthAddress)) {
          $('#sending-wallet').attr('disabled', true).val(payEthAddress);
        }
        if (!method.isEmpty(getTokenAddress)) {
          $('#receiving-wallet').attr('disabled', true).val(getTokenAddress);
        }
        
        // 导航栏
        if (!method.isEmpty(payEthAddress) && !method.isEmpty(getTokenAddress)) {
          if (result.txCount > 0) {
            $steps.children().eq(0).removeClass('unfinished').addClass('finished');
            $steps.children().eq(1).removeClass('unfinished').addClass('finished');
            $steps.children().eq(2).removeClass('unfinished').addClass('finished active');
            $wallet.hide();
            $token.hide();
            $result.show();
          } else {
            $steps.children().eq(0).removeClass('unfinished').addClass('finished');
            $steps.children().eq(1).addClass('active');
            $wallet.hide();
            $token.show();
            $result.hide();
          }
        } else {
          $steps.children().eq(0).addClass('active');
          $wallet.show();
          $token.hide();
          $result.hide();
        }

        // 购买代币
        var qrcode = new QRCode(document.getElementById("qrcode"), {
          text: result.platformAddress,
          width : 100,
          height : 100,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });

        $payInput.val(this.defaultEth);
        $getInput.val((this.defaultEth * this.priceRate).toFixed(5));
        $tokenForm.find('.pay-eth').text(this.defaultEth);
        $tokenForm.find('.number').text(result.priceRate);
        $tokenForm.find('.token').text(result.projectToken);
        $tokenForm.find('.gas-limit').text(result.gasPrice.ethGasLimit);
        $tokenForm.find('.gas-price').text(result.gasPrice.gasPrice);
        $tokenForm.find('.min-eth').text(result.minPurchaseAmount);
        $tokenForm.find('.platform-address').text(result.platformAddress);

      }
    })
    .catch(err => {
      console.log(err);
    });
  }

   // validate method
   validateMethod () {
    $.validator.addMethod('walletFormat', (value, el) => {
      return /^(0x)?([a-fA-F0-9]{40})$/.test(value);
    });

    $.validator.addMethod('hashFormat', (value, el) => {
      return /^0x?([A-Fa-f0-9]{64})$/.test(value);
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
      $tokenForm,
      $payInput,
      $getInput
    } = this.childMap;

    // Tab 切换
    $steps.on('click', '.step', (e) => {
      if (!this.flag) return;
      let $this = $(e.currentTarget),
        index = $this.index();

      console.log(index);
      $this.addClass('active').siblings().removeClass('active');
    });

    // 购买代币输入框
    $tokenForm.on('input', '#payAmount', (e) => {
      let value = this.trim($(e.currentTarget));
      let total = (value * this.priceRate).toFixed(5);

      total = total > 0 ? total : ''; 
      $('#getAmount').val(total);
      $('.pay-eth').text(value);
    });

    $tokenForm.on('input', '#getAmount', (e) => {
      let value = this.trim($(e.currentTarget));
      let eth = (value / this.priceRate).toFixed(5);

      eth = eth > 0 ? eth : '';
      $('#payAmount').val(eth);
      $('.pay-eth').text(eth);
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
          if (res.success) {
            $wallet.hide();
            $token.show();
            $result.hide();
          }
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
          required: '输入一个有效的TX散列(在您的钱包旁边找到的一个长字符串)',
          hashFormat: '输入一个有效的TX散列(在您的钱包旁边找到的一个长字符串)'
        }
      },
      // 给未通过验证的元素进行处理
      highlight: (el) => {
      },
      submitHandler: (form) => {
        console.log(form);
        let payValue = parseFloat(this.trim($payInput)),
          getValue = parseFloat(this.trim($getInput));

        submitTransaction({
          projectGid: this.gid,
          priceRate: this.priceRate,
          payAmount: payValue,
          payCoinType: 0,
          payTx: this.payTx,
          hopeGetAmount: getValue
        })
        .then(res => {
          if (res.success) {
            $wallet.hide();
            $token.hide();
            $result.show();
          }
        })
        .catch(err => {
          console.log(er);
        })

        return false;
      }
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
