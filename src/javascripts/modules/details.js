import moment from 'moment';
import { projectDetails, getTransactionInfo, getIndex } from '../common/service';
import method from '../common/method';
import getModule from './index';

export default class Details {
  constructor(el) {
    this.$el = $(el);
    this.childMap = {};
    this.gid = null;

    $(() => {
      this.baseForm = getModule('baseform');
      this.handleDom();
      this.render();
      this.bindEvents();
    });
    
  }

  handleDom () {
    let $header = $('.box-head'),
      $section = $('.section'),
      $footer = $('.box-foot'),
      $loading = $('#loading');

    this.childMap.$header = $header;
    this.childMap.$section = $section;
    this.childMap.$footer = $footer;
    this.childMap.$loading = $loading;
  }

  // 初始化
  render () {
    const {
      $header,
      $section,
      $footer,
      $loading
    } = this.childMap;
    console.log(method.thousandsFormatters(123131444.323))
    console.log(method.thousandsFormatters(123131444.00))
    console.log(method.thousandsFormatters(12.4244))
    getIndex()
    .then(({ success, data, message }) => {
      if (!success) { console.log('no data'); };
      let result = data.defaultProject;
      let headTemp, headCommonTemp, proHeadTemp, proBodyTemp, proFootTemp;
      
      this.gid = result.projectGid;
      
      // 根据status，显示不同的内容
      // result.projectStatus = 3;
      headCommonTemp = `
        <h3 class="name">${result.projectName}</h3>
        <p class="devide">${method.checkTxtStatus(result.projectStatus)}</p>
        <div class="devide-line"></div>
        <label for="label" class="label">${method.checkStatus(result.projectStatus)}</label>
      `;

      switch (result.projectStatus) {
        case 0:
        headTemp = `
          ${headCommonTemp}
          <div class="countdown">
            <div class="time"><p class="top">Year</p><p class="bottom">${moment(result.startTime).format('YYYY')}</p></div>
            <span class="delimiter">:</span>
            <div class="time"><p class="top">Month</p><p class="bottom">${moment(result.startTime).format('MM')}</p></div>
            <span class="delimiter">:</span>
            <div class="time"><p class="top">Day</p><p class="bottom">${moment(result.startTime).format('DD')}</p></div>
          </div>
          <button class="get-token-btn" data-id="${result.projectGid}" disabled="disabled">马上获得代币</button>
          `;
          break;
        case 1:
          headTemp = `
            ${headCommonTemp}
            <p class="devide">${$.t('detail.current')}</p>
            <div class="token-rate-items">
              <fieldset class="token-item eth">
                <legend align="left" class="token-name">ETH</legend>
                1
              </fieldset>
              <span class="equal-sign">=</span>
              <fieldset class="token-item eth">
                <legend align="left" class="token-name">${result.projectToken}</legend>
                ${result.priceRate}
              </fieldset>
            </div>
            <button class="get-token-btn" data-id="${result.projectGid}">${$.t('detail.btnText')}</button>
            <p>${$.t('detail.saled')}<span class="sale-numbers">${method.thousandsFormatters(result.soldAmount)}</span></p>
          `;
          break;
        case 2:
          break;
        case 3:
          headTemp = `
            ${headCommonTemp}
            <p>${$.t('detail.end')}</p>
            <div class="collect-total">
              <div class="collect-item">
                <fieldset class="token-item eth">
                  <legend align="left" class="token-name">Token</legend>
                  ${this.numberFormat(result.soldAmount, result.priceRate)}ETH
                </fieldset>
              </div>
              <div class="collect-item">
                <fieldset class="token-item eth">
                  <legend align="left" class="token-name">Token</legend>
                  ${result.soldAmount}${result.projectToken}
                </fieldset>
              </div>
            </div>
          `;
          break;
        case 4:
          break;
        default:
          break;
      }

      proHeadTemp = `
        <div class="project-logo">
          <img src="${result.projectLogoLink}" alt="logo">
        </div>
        <div class="project-details">
          <h3>
            <span class="project-name">${result.projectName}</span>
            <span class="project-status">${method.checkStatus(result.projectStatus)}</span>
          </h3>
          <p class="project-infos">${result.projectInstruction}</p>
        </div>
      `;

      proBodyTemp = `
        <div class="row">
          <a class="col-3" target="_blank" href="${result.websites.officialLink}"><img src="./images/details/website.png" alt=""><span>website</span></a>
          <a class="col-3" target="_blank" href="${result.websites.whitePaperLink}"><img src="./images/details/whitebook.png" alt=""><span>white book</span></a>
          <a class="col-3" target="_blank" href="${result.websites.twitter}"><img src="./images/details/twitter.png" alt=""><span>twitter</span></a>
          <a class="col-3" target="_blank" href="${result.websites.facebook}"><img src="./images/details/facebook.png" alt=""><span>facebook</span></a>
        </div>
        <div class="row">
          <a class="col-3" target="_blank" href="${result.websites.telegram}"><img src="./images/details/telegram.png" alt=""><span>telegram</span></a>
          <a class="col-3" target="_blank" href="${result.websites.reddit}"><img src="./images/details/reddit.png" alt=""><span>reddit</span></a>
          <a class="col-3" target="_blank" href="${result.websites.biYong}"><img src="./images/details/biyong.png" alt=""><span>biyong</span></a>
          <a class="col-3" target="_blank" href="${result.websites.gitHub}"><img src="./images/details/github.png" alt=""><span>github</span></a>
        </div>
      `;

      proFootTemp = `
        <div class="row">
          <div class="col-4">
            <p class="top">${$.t('common.projectName')}</p>
            <p class="bottom">${result.projectName}</p>
          </div>
          <div class="col-4">
            <p class="top">${$.t('common.startTime')}</p>
            <p class="bottom">
              <i class="dot bg-color-green"></i><span class="start-time">${method.timeFormatter(result.startTime)}</span>
            </p>
          </div>
          <div class="col-4">
            <p class="top">${$.t('common.endTime')}</p>
            <p class="bottom">
              <i class="dot bg-color-orange"></i><span class="end-time">${method.timeFormatter(result.endTime)}</span>
            </p>
          </div>
        </div>
      `;

      $header.html(headTemp);
      $footer.find('.project-head').html(proHeadTemp);
      $footer.find('.project-body').html(proBodyTemp);
      $footer.find('.project-foot').html(proFootTemp);
      $footer.find('.desc-field').text(result.projectContent);

      $loading.hide();
    })
    .catch(err => {
      console.log(err);
    });

  }

  // 绑定的事件
  bindEvents () {
    const {
      $header,
      $footer
    } = this.childMap;

    // 获取代币
    $header.on('click', '.get-token-btn', (e) => {
      e.preventDefault();
      let $this = $(e.currentTarget),
        gid = $this.data('id');

      getTransactionInfo(this.gid)
      .then(res => {
        window.location.href = `./sale.html?gid=${gid}`;
      })
      .catch(err => {
        if (err.status === 401) {
          return this.baseForm.execInAnimation();
        }
      });

    });

  }

  checkStatus (val) {
    switch (val) {
      case 0:
        return false;
        break;
      case 1:
      case 2:
        return true;
        break;
      case 3:
        return false;
        break;
      default:
        return false;
        break;
    }
  }

  numberFormat (val1, val2) {
    return (parseFloat(val1) / parseFloat(val2)).toFixed(4);
  }

}
