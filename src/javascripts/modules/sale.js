import QRCode from 'qrcodejs2';
import 'jquery-validation';
import method from '../common/method';
import ClipboardJS from 'clipboard';
import getModule from './index';
import {
  getTransactionInfo,
  submitIndexTransaction
} from '../common/service';

export default class Sale {
  constructor(el) {
    this.$el = $(el);
    this.childMap = {};
    this.gid = method.getUrlParam('gid');
    this.code = method.getUrlParam('channel') || '';
    this.result = {};
    this.priceRate = null; // 兑换比例
    this.minPurchaseAmount = null; // 购买的最小ETH
    this.maxPurchaseAmount = null; // 购买的最大ETH

    $(() => {
      this.baseForm = getModule('baseform');
      this.validateMethod();
      this.handleDom();
      this.render();
      this.bindEvents();
    });
  }

  handleDom() {
    let $form = $('#submit-form'), 
      $wallet = $form.find('.wallet-container'),
      $tokens = $form.find('.tokens-container'),
      $prove = $form.find('.prove-container'),
      $payInput = $('.payAmount'),
      $getInput = $('.getAmount'),
      $paytxInput = $('.trade-id'),
      $codeInput = $('.invite-code'),
      $btnSubmit = $('.btn-submit'),
      $loading = $('#loading');

    this.childMap.$form = $form;
    this.childMap.$wallet = $wallet;
    this.childMap.$tokens = $tokens;
    this.childMap.$prove = $prove;
    this.childMap.$payInput = $payInput;
    this.childMap.$getInput = $getInput;
    this.childMap.$paytxInput = $paytxInput;
    this.childMap.$codeInput = $codeInput;
    this.childMap.$btnSubmit = $btnSubmit;
    this.childMap.$loading = $loading;
  }

  render() {
    const {
      $wallet,
      $tokens,
      $payInput,
      $getInput,
      $paytxInput,
      $btnSubmit
    } = this.childMap;

    getTransactionInfo(this.gid)
    .then(res => {
    
      let result = res.data,
        payEthAddress = result.payEthAddress,
        getTokenAddress = result.getTokenAddress;
      
      this.result = result;
      this.minPurchaseAmount = result.minPurchaseAmount;
      this.maxPurchaseAmount = result.maxPurchaseAmount;

      // pay、get address is empty
      if (!method.isEmpty(payEthAddress)) {
        $wallet.find('.sending-wallet').attr('disabled', true).val(payEthAddress);
      }
      if (!method.isEmpty(getTokenAddress)) {
        $wallet.find('.receiving-wallet').attr('disabled', true).val(getTokenAddress);
      }

      // 购买代币
      new QRCode(document.getElementById("qrcode"), {
        text: result.platformAddress,
        width : 115,
        height : 115,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      });

      $payInput.val(result.minPurchaseAmount);
      $getInput.val((result.minPurchaseAmount * result.priceRate).toFixed(9));
      $tokens.find('.proportion').text(result.priceRate);
      $tokens.find('.buy-eth-amount').text(result.minPurchaseAmount);
      $tokens.find('.token').text(result.projectToken);
      $tokens.find('.platform-address').text(result.platformAddress);
      $tokens.find('.btn-copy').attr('aria-label', result.platformAddress);

      $('.buy-min-eth').text(result.minPurchaseAmount);
      $('.buy-max-eth').text(result.maxPurchaseAmount);
      $('.gas-limit').text(method.thousandsFormatter(result.gasPrice.ethGasLimit));
      $('.gas-price').text(result.gasPrice.gasPriceGWei);

      if (result.txCountLimit) {
        $paytxInput.attr('disabled', true);
        $btnSubmit.attr('disabled', true);
      }
      this.checkCodeStatus(this.code);
    })
    .catch(err => {
      console.log(err);
    })
  }

  // validate method
  validateMethod () {
    $.validator.addMethod('walletFormat', (value, el) => {
      return /^(0x)?([a-fA-F0-9]{40})$/.test(value);
    });

    $.validator.addMethod('hashFormat', (value, el) => {
      return /^0x?([A-Fa-f0-9]{64})$/.test(value);
    });

    $.validator.addMethod('decimalFormat', (value, el) => {
      return /(^\d+)((\.\d{1,9})|(\.?))?$/.test(value);
    });

    $.validator.addMethod('codeFormat', (value, el) => {
      return method.isEmpty(value) || /^(?=.*?[A-Za-z]+)(?=.*?[0-9]+).*$/.test(value);
    });
  }

  checkCodeStatus (value) {
    const {
      $codeInput
    } = this.childMap;

    let reg = /^[0-9a-z]{6}$/;
    if (method.isEmpty(value)) return;
    if (reg.test(value)) {
      $codeInput.attr('disabled', true).val(this.code);
    } else {
      $codeInput.val(this.code);
    }
  }

  validForm () {
    const {
      $form
    } = this.childMap;

    return $form.validate({
      rules: {
        receiving: {
          required: true,
          walletFormat: true
        },
        sending: {
          required: true,
          walletFormat: true
        },
        payAmount: {
          required: true,
          min: this.minPurchaseAmount,
          max: this.maxPurchaseAmount,
          decimalFormat: true
        },
        getAmount: {
          required: true
        },
        tradeId: {
          required: true,
          hashFormat: true
        },
        invitation: {
          codeFormat: true
        }
      },
      messages: {
        receiving: {
          required: $.t('wallet.inputTip1'),
          walletFormat: $.t('wallet.inputTip3')
        },
        sending: {
          required: $.t('wallet.inputTip2'),
          walletFormat: $.t('wallet.inputTip3')
        },
        payAmount: {
          required: $.t('buyTokens.inputTip1'),
          min: `${$.t('buyTokens.inputTip3')} ${this.minPurchaseAmount}ETH`,
          max: `${$.t('buyTokens.inputTip4')} ${this.maxPurchaseAmount}ETH`,
          decimalFormat: $.t('error.number')
        },
        getAmount: {
          required: $.t('buyTokens.inputTip1'),
          decimalFormat: $.t('error.number')
        },
        tradeId: {
          required: $.t('buyTokens.inputTip5'),
          hashFormat: $.t('buyTokens.inputTip5')
        },
        invitation: {
          codeFormat: $.t('prove.inputTip2')
        }
      }
    });
  }

  trim (el) {
    return $.trim(el.val());
  }

  className (val) {
    if (val == 2) {
      return 'color-green';
    }
    return 'color-gray';
  }

  destroy () {
    const {
      
    } = this.childMap;
  }

  // 绑定的事件
  bindEvents() {
    const {
      $wallet,
      $tokens,
      $prove,
      $payInput,
      $getInput,
      $paytxInput,
      $codeInput,
      $btnSubmit
    } = this.childMap;

    // 购买代币输入框
    $tokens.on('input', '.payAmount', (e) => {
      let value = this.trim($(e.currentTarget));
      let total = (value * this.result.priceRate).toFixed(9);

      total = total > 0 ? total : ''; 
      $('.getAmount').val(total);
      $('.buy-eth-amount').text(value);
    });

    $tokens.on('input', '.getAmount', (e) => {
      let value = this.trim($(e.currentTarget));
      let eth = (value / this.result.priceRate).toFixed(9);

      eth = eth > 0 ? eth : '';
      $('.payAmount').val(eth);
      $('.buy-eth-amount').text(eth);
    });

    // 复制到剪切板
    $tokens.on('click', '.btn-copy', (e) => {

      e.preventDefault();
      let $this = $(e.target);
      let clipboard = new ClipboardJS('.btn-copy', {
        text: function(trigger) {
          return trigger.getAttribute('aria-label');
        }
      });

      clipboard.on('success', function(e) {
        $this.text($.t('buyTokens.copiedSuccess')).addClass('copied');
        setTimeout(() => {
          $this.text($.t('buyTokens.copiedFail')).removeClass('copied');
          clipboard.destroy();
        }, 3000);
      });

      clipboard.on('error', function(e) {
        alert('Copied failed');
      });
    });


    $btnSubmit.on('click', (e) => {
      let paytxValue = this.trim($paytxInput),
        payValue = parseFloat(this.trim($payInput)),
        getValue = parseFloat(this.trim($getInput)),
        codeValue = this.trim($codeInput) || '';

      // 如果表单验证通过
      if (!this.validForm().form()) return;
      let params = {
        projectGid: this.projectGid,
        payEthAddress: this.result.payEthAddress,
        getTokenAddress: this.result.getTokenAddress,
        priceRate: this.result.priceRate,
        payAmount: payValue,
        payCoinType: 0,
        payTx: paytxValue,
        hopeGetAmount: getValue,
        channel: codeValue
      };

      $btnSubmit.attr('disabled', true);
      submitIndexTransaction(params)
      .then(res => {
        $btnSubmit.attr('disabled', false);
        let path = `./order.html?gid=${this.gid}`;

        if (!method.isEmpty(this.code)) {
          path = `${path}&channel=${this.code}`;
        }
        location.href = path;
      })
      .catch(err => {
        $btnSubmit.attr('disabled', false);
        if (err.status === 401) {
          return this.baseForm.execInAnimation();
        }
        if (!err.success) alert(err.message);
      });
    });

    // 前往订单页
    $wallet.on('click', '.btn-order', (e) => {
      let path = `./order.html?gid=${this.gid}`;

      if (!method.isEmpty(this.code)) {
        path = `${path}&channel=${this.code}`;
      }
      location.href = path;
    });
  }
  
}