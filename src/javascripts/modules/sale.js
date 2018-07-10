import QRCode from 'qrcodejs2';
import 'jquery-validation';
import moment from 'moment';
import method from '../common/method';
import Clipboard from 'clipboard';
import i18next from 'i18next';
import jqueryI18next from 'jquery-i18next';
import en from '../../i18/en';
import cn from '../../i18/cn';
import {
  setUserAddress,
  getTransactionInfo,
  submitTransaction,
  getTransactions,
  ownerTransaction
} from '../common/service';
import getModule from './index';

export default class Sale {
  constructor(el) {
    this.$el = $(el);
    this.childMap = {};
    this.flag = false;
    this.gid = null;
    this.priceRate = null; // 兑换比例
    this.defaultEth = null; // 默认购买的最小ETH
    this.txCount = null; // 购买次数
    this.wallet = false; // 钱包是否已经完成
    this.token = false; // 是否进行过购买
    this.result = false; // 结果页
    this.txCountLimit = false; // 是否可购买

    $(() => {
      this.baseForm = getModule('baseform');
      this.validateMethod();
      this.handleDom();
      // this.languageInit();
      this.render();
    });
  }

  handleDom() {
  let $steps = $('.steps'),
    $wallet = $('.wallet-container'),
    $token = $('.token-container'),
    $result = $('.result-container'),
    $walletForm = $('#wallet-form'),
    $tokenForm = $('#token-form'),
    $payInput = $('#payAmount'),
    $getInput = $('#getAmount'),
    $payId = $('#payId'),
    $loading = $('#loading');

    this.childMap.$steps = $steps;
    this.childMap.$wallet = $wallet;
    this.childMap.$token = $token;
    this.childMap.$result = $result;
    this.childMap.$walletForm = $walletForm;
    this.childMap.$tokenForm = $tokenForm;
    this.childMap.$payInput = $payInput;
    this.childMap.$getInput = $getInput;
    this.childMap.$payId = $payId;
    this.childMap.$loading = $loading;
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
      $payInput,
      $loading
    } = this.childMap;

    this.gid = method.getUrlParam('gid');

    // 用户项目交易信息
    getTransactionInfo(this.gid)
    .then(res => {
      if (res.success) {
        
        let result = res.data,
          payEthAddress = result.payEthAddress,
          getTokenAddress = result.getTokenAddress,
          minPurchase = null;

        this.priceRate = result.priceRate;
        this.txCount = result.txCount;
        this.defaultEth = result.minPurchaseAmount;
        this.txCountLimit = result.txCountLimit;

        minPurchase = (this.defaultEth * this.priceRate).toFixed(9);

        if (!method.isEmpty(payEthAddress)) {
          $('#sending-wallet').attr('disabled', true).val(payEthAddress);
        }
        if (!method.isEmpty(getTokenAddress)) {
          $('#receiving-wallet').attr('disabled', true).val(getTokenAddress);
        }
        
        // 导航栏
        if (!method.isEmpty(payEthAddress) && !method.isEmpty(getTokenAddress)) {
          this.wallet = true;
          if (result.txCount > 0) {
            this.result = true;
            $steps.children().eq(0).removeClass('unfinished').addClass('finished');
            $steps.children().eq(1).removeClass('unfinished').addClass('finished');
            $steps.children().eq(2).removeClass('unfinished').addClass('finished active');
            $wallet.hide();
            $token.hide();
            $result.show();
          } else {
            this.token = true;
            $steps.children().eq(0).removeClass('unfinished').addClass('finished');
            $steps.children().eq(1).addClass('active');
            $wallet.hide();
            $token.show();
            $result.hide();
          }
        } else {
          this.wallet = false;
          $steps.children().eq(0).addClass('active');
          $wallet.show();
          $token.hide();
          $result.hide();
        }

        // true 禁止认筹
        if (this.txCountLimit) {
          $steps.children().eq(1).removeClass('finished').addClass('disabled');
          $token.hide();
          $result.find('.btn-buy').hide();
        }

        // 购买代币
        let qrcode = new QRCode(document.getElementById("qrcode"), {
          text: result.platformAddress,
          width : 100,
          height : 100,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });

        $('.token-name').text(result.projectToken);
        
        $payInput.val(this.defaultEth);
        $getInput.val(minPurchase);
        $tokenForm.find('.btn-copy').attr('aria-label', result.platformAddress);
        $tokenForm.find('.pay-eth').text(this.defaultEth);
        $tokenForm.find('.number').text(result.priceRate);
        $tokenForm.find('.token').text(result.projectToken);
        $tokenForm.find('.gas-limit').text(method.thousandsFormatter(result.gasPrice.ethGasLimit));
        $tokenForm.find('.gas-price').text(result.gasPrice.gasPriceGWei);
        $tokenForm.find('.min-eth').text(result.minPurchaseAmount);
        $tokenForm.find('.platform-address').text(result.platformAddress);

        // 购买结果
        $result.find('.gmt-date').text(moment.utc(new Date(result.endTime)).format('MMMM Do, h:mm A'));
        result.txCount > 0 && this.renderList(this.gid)
      }

      this.bindEvents();
      $loading.hide();
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

    $.validator.addMethod('decimalFormat', (value, el) => {
      return /(^\d+)((\.\d{1,9})|(\.?))?$/.test(value);
    });
  }

  updateTransactionInfo () {
    const {
      $steps,
      $result
    } = this.childMap;

    getTransactionInfo(this.gid)
    .then(res => {
      this.txCountLimit = res.data.txCountLimit;
      if (this.txCountLimit) {
        $steps.children().eq(1).removeClass('finished').addClass('disabled');
        $result.find('.btn-buy').hide();
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  // 个人列表
  renderList () {
    const {
      $result
    } = this.childMap;

    getTransactions(this.gid, 1, 10)
    .then(res => {
      if (res.success) {
        let resData= res.data, temp = '';
        
        // 正式环境 https://etherscan.io/tx/
        // 测试环境 https://ropsten.etherscan.io/tx/

        resData.list.forEach((item, index) => {
          temp += `<li class="ui-item">
            <div class="ui-item-head">
              <i class="dot"></i>
              <span class="order-id">${$.t('confirmation.orderId')} <a target="_blank" href="https://ropsten.etherscan.io/tx/${item.payTx}">#${item.payTxId}</a></span>
              <span class="order-time">${moment(item.createTime).format('MMMM Do, h:mm:ss A')}</span>
              <span class="order-status">${method.userTxStatus(item.userTxStatus)}</span>
            </div>
            <div class="ui-item-body">
              <label>${$.t('confirmation.number')}</label>
              <div class="subscription">
                <div class="eth">
                  ~${item.payAmount}ETH
                </div>
                <div class="transfer"><span class="ui-transfer"></span></div>
                <div class="curreny">~${item.hopeGetAmount} ${item.projectToken}</div>
              </div>
            </div>
          </li>`;
        });

        $result.find('.ui-list').html(temp);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

  // trim
  trim (el) {
    return $.trim(el.val());
  }

  // destroy
  destroy () {
    const {
      $payId,
      $payInput,
      $getInput,
      $tokenForm
    } = this.childMap;

    $payInput.val(this.defaultEth);
    $getInput.val((this.defaultEth * this.priceRate).toFixed(9));
    $payId.val('');
    $tokenForm.find('.pay-eth').text(this.defaultEth);
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
      $getInput,
      $payId
    } = this.childMap;

    // Tab 切换
    $steps.on('click', '.step', (e) => {
      let $this = $(e.currentTarget),
        index = $this.index();

      if ($this.hasClass('disabled')) return;
      if ($this.hasClass('unfinished')) return;

      if (!method.isEmpty($payId.val()) && index != 1) {
        let message = $.t('sale.alert');
        if (!confirm(message)) return
        this.destroy();
      }

      $this.addClass('active').siblings().removeClass('active');
      $('.container').eq(index).show().siblings('.container').hide();
    });

    // 购买代币输入框
    $tokenForm.on('input', '#payAmount', (e) => {
      let value = this.trim($(e.currentTarget));
      let total = (value * this.priceRate).toFixed(9);

      total = total > 0 ? total : ''; 
      $('#getAmount').val(total);
      $('.pay-eth').text(value);
    });

    $tokenForm.on('input', '#getAmount', (e) => {
      let value = this.trim($(e.currentTarget));
      let eth = (value / this.priceRate).toFixed(9);

      eth = eth > 0 ? eth : '';
      $('#payAmount').val(eth);
      $('.pay-eth').text(eth);
    });

    // 复制到剪切板
    $tokenForm.on('click', '.btn-copy', (e) => {
      e.preventDefault();
      let $this = $(e.target);
      let clipboard = new Clipboard('.btn-copy', {
        target: (trigger) => {
          return trigger.nextElementSibling;
        },
        text: function(trigger) {
          return trigger.getAttribute('aria-label');
        }
      });

      clipboard.on('success', function(e) {
        $this.text('Copied!').addClass('copied');
        setTimeout(() => {
          $this.text($.t('buyTokens.copy')).removeClass('copied');
        }, 3000);
      });

      clipboard.on('error', function(e) {
          console.log(e);
      });
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
          required: $.t('wallet.inputTip1'),
          walletFormat: $.t('wallet.inputTip3')
        },
        sending: {
          required: $.t('wallet.inputTip2'),
          walletFormat: $.t('wallet.inputTip3')
        }
      },
      // 给未通过验证的元素进行处理
      highlight: (el) => {
      },
      submitHandler: (form) => {

        // 禁止购买，提示消息
        if (this.txCountLimit) {
          return alert($.t('buyTokens.error'));
        }

        // 钱包地址已填写，下一步到buy Tokens
        if (this.wallet) {
          $steps.children().eq(1).addClass('active').siblings().removeClass('active');
          $wallet.hide();
          $token.show();
          $result.hide();
          this.destroy();
          return;
        }
        
        // 钱包地址未填写，请求数据
        $walletForm.find('.btn-step').attr('disabled', true);
        setUserAddress({
          projectGid: this.gid,
          getTokenAddress: this.trim($('#receiving-wallet')),
          payEthAddress: this.trim($('#sending-wallet'))
        })
        .then(res => {
          if (res.success) {
            this.wallet = true;
            $('#sending-wallet').attr('disabled', true);
            $('#receiving-wallet').attr('disabled', true);
            $steps.children().eq(0).removeClass('unfinished').addClass('finished');
            $steps.children().eq(1).addClass('active').siblings().removeClass('active');
            $wallet.hide();
            $token.show();
            $result.hide();
          }
          $walletForm.find('.btn-step').attr('disabled', false);
        })
        .catch(err => {
          $walletForm.find('.btn-step').attr('disabled', false);
          if (err.status === 401) {
            return this.baseForm.execInAnimation();
          }
        });

      }
    });

    // 购买代币
    $tokenForm.validate({
      rules: {
        payAmount: {
          required: true,
          min: this.defaultEth,
          decimalFormat: true,
        },
        getAmount: {
          required: true,
        },
        payId: {
          required: true,
          hashFormat: true
        }
      },
      messages: {
        payAmount: {
          required: $.t('buyTokens.inputTip1'),
          min: `${$.t('buyTokens.inputTip3')}${this.defaultEth}ETH`,
          decimalFormat: $.t('error.number')
        },
        getAmount: {
          required: $.t('buyTokens.inputTip1'),
          decimalFormat: $.t('error.number')
        },
        payId: {
          required: $.t('buyTokens.inputTip4'),
          hashFormat: $.t('buyTokens.inputTip4')
        }
      },
      // 给未通过验证的元素进行处理
      highlight: (el) => {
      },
      submitHandler: (form) => {
        let payValue = parseFloat(this.trim($payInput)),
          getValue = parseFloat(this.trim($getInput)),
          $step1 = $steps.children().eq(1),
          $step2 = $steps.children().eq(2);
            
          $tokenForm.find('.btn-confirm').attr('disabled', true);
          submitTransaction({
            projectGid: this.gid,
            priceRate: this.priceRate,
            payAmount: payValue,
            payCoinType: 0,
            payTx: this.trim($payId),
            hopeGetAmount: getValue
          })
          .then(res => {
            
            if ($step1.hasClass('unfinished')) {
              $step1.removeClass('unfinished').addClass('finished');
            }

            if ($step2.hasClass('unfinished')) {
              $step2.removeClass('unfinished').addClass('finished');
            }

            $step2.addClass('active').siblings().removeClass('active');

            // 更新 transactioninfo
            this.updateTransactionInfo();
            // 刷新购买列表
            this.renderList();

            this.destroy();
            $wallet.hide();
            $token.hide();
            $result.show();
            $tokenForm.find('.btn-confirm').attr('disabled', false);
          })
          .catch(err => {
            $tokenForm.find('.btn-confirm').attr('disabled', false);
            if (err.status === 401) {
              return this.baseForm.execInAnimation();
            }
          });
      }
    });

    // 取消事件
    $tokenForm.on('click', '.btn-cancel', (e) => {
      e.preventDefault();
 
      if (!method.isEmpty($payId.val())) {
        let message = $.t('sale.alert');
        if (!confirm(message)) return
        this.destroy();
        if (this.wallet && this.token) {
          $steps.children().eq(2).trigger('click');
        }
      } else {
        if (this.wallet) {
          $steps.children().eq(2).trigger('click');
        }
      }
    });

    // 购买更多代币
    $result.on('click', '.btn-buy', (e) => {
      e.preventDefault();
      
      $steps.children().eq(1).trigger('click');  
    });
    
    // 交易号hover事件
    $tokenForm.find('.tips').hover((e) => {
      $('.tips-description').fadeIn(300);
    }, (e) => {
      $('.tips-description').fadeOut(300);
    });

  }
}
