import QRCode from 'qrcodejs2';
import 'jquery-validation';
import method from '../common/method';
import Clipboard from 'clipboard';
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
    this.txCount = null;
    this.wallet = false;
    this.token = false;
    this.result = false;

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
    $getInput = $('#getAmount'),
    $payId = $('#payId');

    this.childMap.$steps = $steps;
    this.childMap.$wallet = $wallet;
    this.childMap.$token = $token;
    this.childMap.$result = $result;
    this.childMap.$walletForm = $walletForm;
    this.childMap.$tokenForm = $tokenForm;
    this.childMap.$payInput = $payInput;
    this.childMap.$getInput = $getInput;
    this.childMap.$payId = $payId;
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
        this.txCount = result.txCount;

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

        // 购买代币
        let qrcode = new QRCode(document.getElementById("qrcode"), {
          text: result.platformAddress,
          width : 100,
          height : 100,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        });
        
        $payInput.val(this.defaultEth);
        $getInput.val((this.defaultEth * this.priceRate).toFixed(5));
        $tokenForm.find('.btn-copy').attr('aria-label', result.platformAddress);
        $tokenForm.find('.pay-eth').text(this.defaultEth);
        $tokenForm.find('.number').text(result.priceRate);
        $tokenForm.find('.token').text(result.projectToken);
        $tokenForm.find('.gas-limit').text(method.thousandsFormatter(result.gasPrice.ethGasLimit));
        $tokenForm.find('.gas-price').text(method.thousandsFormatter(result.gasPrice.gasPrice));
        $tokenForm.find('.min-eth').text(result.minPurchaseAmount);
        $tokenForm.find('.platform-address').text(result.platformAddress);

        // 购买结果
        if (result.txCount > 0) {
          $result.find('.token-name').text(result.projectToken);
          $result.find('.gmt-date').text(new Date(result.endTime));
          this.renderList(this.gid);
        }

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

  // 个人列表
  renderList (id) {
    const {
      $result
    } = this.childMap;

    getTransactions(id, 1, 10)
    .then(res => {
      if (res.success) {
        let resData= res.data, temp = '';

        resData.list.forEach((item, index) => {
          temp += `<li class="ui-item">
            <div class="ui-item-head">
              <i class="dot"></i>
              <span class="order-id">订单号 ${item.payTx}</span>
              <span class="order-time">Jun 10th, 5:48 PM</span>
              <span class="order-status">${this.checkTxStatus(item.userTxStatus)}</span>
            </div>
            <div class="ui-item-body">
              <label>认购数量</label>
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

        $result.find('.ui-list').append(temp);

        console.log(this);
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

  // 认筹交易状态
  checkTxStatus (num) {
    let message;
    switch (num) {
      case 0:
        message = '初始状态';
        break;
      case 1:
        message = '认筹成功	';
        break;
      case 2:
        message = '认筹成功但数量不符	';
        break;
      case 3:
        message = '认筹失败';
        break;
      case 4:
        message = '认筹失败';
        break;
      default:
        break;
    }
    return message;
  }

  // destroy
  destroy () {
    const {
      $payId
    } = this.childMap;

    $payId.val('');
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

      if ($this.hasClass('unfinished')) return;
      if (!method.isEmpty($payId.val()) && index != 1) {
        let message = '如果您导航离开 ，您输入的TX散列信息将丢失 ，您的订单可能无法确认。请点击以下的确认付款或取消按钮确认或取消您的订单。';
        if (!confirm(message)) return
        this.destroy();
      }

      $this.addClass('active').siblings().removeClass('active');
      $('.container').eq(index).show().siblings('.container').hide();
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
          $this.text('复制到剪切板!').removeClass('copied');
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
        if (this.wallet) {
          $steps.children().eq(1).trigger('click');
        }
        return false;
  
        setUserAddress({
          projectGid: this.gid,
          getTokenAddress: this.trim($('#receiving-wallet')),
          payEthAddress: this.trim($('#sending-wallet'))
        })
        .then(res => {
          if (res.success) {
            this.wallet = true;
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
            $steps.children().eq(2).addClass('finished').removeClass('unfinished');
            this.renderList(this.gid);
            $wallet.hide();
            $token.hide();
            $result.show();
          }
        })
        .catch(err => {
          console.log(err);
        })

        return false;
      }
    });

    // 取消事件
    $tokenForm.on('click', '.btn-cancel', (e) => {
      e.preventDefault();

      if (!method.isEmpty($payId.val())) {
        let message = '如果您导航离开 ，您输入的TX散列信息将丢失 ，您的订单可能无法确认。请点击以下的确认付款或取消按钮确认或取消您的订单。';
        if (!confirm(message)) return
        this.destroy();
        if (this.wallet && this.token) {
          $steps.children().eq(2).trigger('click');
        }
      }
    });

    // 购买更多代币
    $result.on('click', '.btn-buy', (e) => {
      e.preventDefault();

      $steps.children().eq(1).trigger('click');

    });

  }
}
