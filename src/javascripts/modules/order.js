import moment from 'moment';
import method from '../common/method';
import getModule from './index';
import { getIndexTransaction } from '../common/service';

export default class Sale {
  constructor(el) {
    this.$el = $(el);
    this.childMap = {};
    this.gid = method.getUrlParam('gid');
    this.code = method.getUrlParam('channel');

    $(() => {
      this.baseForm = getModule('baseform');
      this.handleDom();
      this.render();
      this.bindEvents();
    })
  }

  handleDom() {
    let $list = $('.list'),
      $btnMore = $('.btn-more'),
      $loading = $('#loading');

    this.childMap.$list = $list;
    this.childMap.$btnMore = $btnMore;
    this.childMap.$loading = $loading;
  }

  render() {
    const {
      $loading,
      $list,
      $btnMore
    } = this.childMap;

    getIndexTransaction(this.gid, 1, 10)
    .then(res => {
      let data= res.data.txList, temp = '';
  
      if (data.list.length == 0) {
        $list.html('<p class="no-data">暂无数据</p>');
      } else {
        // 正式环境 https://etherscan.io/tx/
        // 测试环境 https://ropsten.etherscan.io/tx/
        data.list.forEach((item, index) => {
          temp += `<li class="ui-item">
            <div class="ui-item-head">
              <i class="dot"></i>
              <span class="order-id">${$.t('confirmation.orderId')} <a target="_blank" href="https://ropsten.etherscan.io/tx/${item.payTx}">#${item.payTxId}</a></span>
              <span class="order-time">${moment(item.createTime).format('MMMM Do, h:mm:ss A')}</span>
              <span class="order-status ${this.className(item.userTxStatus)}">${method.userTxStatus(item.userTxStatus)}</span>
            </div>
            <div class="ui-item-body">
              <div class="subscription">
                <div class="token-area eth">
                  <label class="label-token">ETH</label>
                  ~${item.payAmount}
                </div>
                <div class="transfer"><span class="ui-transfer"></span></div>
                <div class="token-area curreny">
                  <label class="label-token">${item.projectToken}</label>
                  ~${item.hopeGetAmount}
                </div>
              </div>
            </div>
          </li>`;
        });
  
        $list.html(temp);

        if (res.data.txInfo.txCountLimit) {
          $('.btn-wrapper').hide();
        }
      }
      $loading.hide();
    })
    .catch(err => {
      $loading.hide();
    });
  }

  className (val) {
    if (val == 2) {
      return 'color-green';
    }
    return 'color-gray';
  }

  bindEvents() {
    const {
      $btnMore
    } = this.childMap;

    $btnMore.on('click', (e) => {
      let path = `./sale.html?gid=${this.gid}`;

      if (!method.isEmpty(this.code)) {
        path = `${path}&channel=${this.code}`;
      }
      location.href = path;
    });
  }
  
}