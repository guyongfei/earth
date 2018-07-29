import moment from 'moment';
import { getTransactionInfo, getIndex } from '../common/service';
import method from '../common/method';
import getModule from './index';

export default class Details {
  constructor(el) {
    this.$el = $(el);
    this.childMap = {};
    this.gid = null;
    this.code = method.getUrlParam('channel');

    $(() => {
      this.baseForm = getModule('baseform');
      this.handleDom();
      this.render();
      this.bindEvents();
    });
    
  }

  handleDom () {
    let $loading = $('#loading'),
      $section = $('.section'),
      $proHead = $section.find('.project-head'),
      $proBody = $section.find('.project-body'),
      $proFoot = $section.find('.project-foot'),
      $proMain = $section.find('.project-main');
    
    this.childMap.$loading = $loading;
    this.childMap.$section = $section;
    this.childMap.$proHead = $proHead;
    this.childMap.$proBody = $proBody;
    this.childMap.$proFoot = $proFoot;
    this.childMap.$proMain = $proMain;
  }

  // 初始化
  render () {
    const {
      $loading,
      $proHead,
      $proBody,
      $proFoot,
      $proMain
    } = this.childMap;
    
    getIndex()
    .then(({ success, data, message }) => {
      let result = data.defaultProject;
      let proMainTemp, commonTemp, proHeadTemp, proBodyTemp, proFootTemp;
      
      this.gid = result.projectGid;
      
      // 根据status，显示不同的内容
      commonTemp = `
        <h2 class="project-status">${method.checkStatus(result.projectStatus)}</h2>
      `;

      switch (result.projectStatus) {
        case 0:
        proMainTemp = `
          ${commonTemp}
          <div class="countdown">
            <div class="time"><p class="top">Year</p><p class="bottom">${moment(result.startTime).format('YYYY')}</p></div>
            <span class="delimiter">:</span>
            <div class="time"><p class="top">Month</p><p class="bottom">${moment(result.startTime).format('MM')}</p></div>
            <span class="delimiter">:</span>
            <div class="time"><p class="top">Day</p><p class="bottom">${moment(result.startTime).format('DD')}</p></div>
          </div>
          <button class="get-token-btn" data-id="${result.projectGid}" disabled="disabled">${$.t('detail.btnText')}</button>
          `;
          break;
        case 1:
        case 2:
          proMainTemp = `
            ${commonTemp}
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
            <p class="sale-numbers">${method.thousandsFormatters(result.soldTokenAmount)}</p>
            <p class="sale-txt">${$.t('detail.saled')}</p>
          `;
          break;
        case 3:
        case 4:
          proMainTemp = `
            ${commonTemp}
            <p>${$.t('detail.end')}</p>
            <div class="collect-total">
              <div class="collect-item">
                <fieldset class="token-item eth">
                  <legend align="left" class="token-name">Token</legend>
                  ${method.thousandsFormatters(result.soldAmount)}ETH
                </fieldset>
              </div>
              <div class="collect-item">
                <fieldset class="token-item eth">
                  <legend align="left" class="token-name">Token</legend>
                  ${method.thousandsFormatters(result.soldTokenAmount)}${result.projectToken}
                </fieldset>
              </div>
            </div>
          `;
          break;
        default:
          break;
      }

      proHeadTemp = `
        <div class="head-details">
          <img src="${result.projectLogoLink}" alt="logo" class="project-logo">
          <span class="project-name">${result.projectName}</span>
        </div>
        <p class="project-instruction">${result.projectInstruction}</p>
      `;

      proBodyTemp = `
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

      proFootTemp = `
      <div class="btn-links">
        <a href="${result.websites.officialLink}" target="_blank" class="${this.whetherClick(result.websites.officialLink)}">${$.t('links.website')}</a>
        <a href="${result.websites.whitePaperLink}" target="_blank" class="${this.whetherClick(result.websites.whitePaperLink)}">${$.t('links.whitepaper')}</a>
      </div>
      <div class="links">
        <a href="${result.websites.twitter}" target="_blank" class="icon twitter ${this.whetherClick(result.websites.twitter)}"></a>
        <a href="${result.websites.facebook}" target="_blank" class="icon facebook ${this.whetherClick(result.websites.facebook)}"></a>
        <a href="${result.websites.telegram}" target="_blank" class="icon telegram ${this.whetherClick(result.websites.telegram)}"></a>
        <a href="${result.websites.reddit}" target="_blank" class="icon reddit ${this.whetherClick(result.websites.reddit)}"></a>
        <a href="${result.websites.biYong}" target="_blank" class="icon biyong ${this.whetherClick(result.websites.biYong)}"></a>
        <a href="${result.websites.gitHub}" target="_blank" class="icon github ${this.whetherClick(result.websites.gitHub)}"></a>
      </div>
      `;
      // progress
      let proWidth = $('.progress-status').width(),
        progress = result.soldAmount / result.hardCap,
        progressLen = progress * proWidth,
        currentRate = parseInt(progress * 100),
        softcap = result.softCap / result.hardCap * proWidth;
      
      $proHead.html(proHeadTemp);
      $proBody.html(proBodyTemp);
      $proFoot.html(proFootTemp);
      $proMain.html(proMainTemp);

      if (result.soldAmount != 0) {
        if (progressLen > 16) {
          $('.circle-outer').css({ 'marginLeft': '-16px' });
          $('.current').css('marginLeft', '-20px');
        }
        $('.progress-bar').css({ 'width': `${progressLen}px`, 'right': `${progressLen}px` });
        $('.circle-outer').css({ 'left': `${progressLen}px` });
        $('.current').css('left', `${progressLen}px`).text(`${currentRate}%`);
      }

      $('.softcap').css('left', `${softcap}px`);
      
      $loading.hide();
    })
    .catch(err => {
      console.log(err);
    });

  }

  // 绑定的事件
  bindEvents () {
    const {
      $proMain
    } = this.childMap;

    // 获取代币
    $proMain.on('click', '.get-token-btn', (e) => {
      e.preventDefault();
      let $this = $(e.currentTarget),
        gid = $this.data('id');

      getTransactionInfo(gid)
      .then(res => {
        let path = `./sale.html?gid=${gid}`;

        if (!method.isEmpty(this.code)) {
          path = `${path}&channel=${this.code}`;
        }
        location.href = path;
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

  whetherClick (val) {
    if (val == null || val == '#') {
      return 'point-events';
    }
  }

}
