import moment from 'moment';
import { getTransactionInfo, getIndex } from '../common/service';
import method from '../common/method';
import '../lib/jquery.plugin.min';
import '../lib/jquery.countdown.min';
import '../lib/jquery.countdown-zh-CN';
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
      $sectionTop = $('.section-top'),
      $sectionMid = $('.section-middle'),
      $proHead = $sectionMid.find('.project-head'),
      $proBody = $sectionMid.find('.project-body'),
      $proFoot = $sectionMid.find('.project-foot'),
      $proMain = $sectionMid.find('.project-main');
    
    this.childMap.$loading = $loading;
    this.childMap.$sectionTop = $sectionTop;
    this.childMap.$sectionMid = $sectionMid;
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
      let proMainTemp, commonTemp, proHeadTemp, proBodyTemp, proFootTemp, getTokenAmount = null;
      let that = this;
      this.gid = result.projectGid;
      
      // 根据status，显示不同的内容
      commonTemp = `
        <h2 class="project-status">${method.checkStatus(result.projectStatus)}</h2>
      `;

      if (result.freeGiveEnd > 0) {
        getTokenAmount = parseInt(result.priceRate * (1 + result.freeGiveRate));
      } else {
        getTokenAmount = result.priceRate;
      }
      
      switch (result.projectStatus) {
        case 0:
        case 1:
        case 2:
        
        proMainTemp = `
          ${commonTemp}
          <div class="unstart-wrapper" style="display:none;">
            <div class="project-start">${result.projectToken} ICO ${$.t('detail.start')}</div>
            <div class="project-countdown-wrapper clearfix" id="project-countdown"></div>
          </div>
          <div class="start-wrapper" style="display:none;">
            <div class="discounts">
              <p class="discounts-txt">${this.discountFormmatter(result.freeGiveRate)}${$.t('detail.discountsTitle')}</p>
              <div class="discounts-countdown-wrapper clearfix" id="discounts-countdown"></div>
            </div>
            <div class="token-rate">
              1 ETH : ${method.thousandsFormatters(getTokenAmount)} ${result.projectToken}
            </div>
            <button class="get-token-btn" data-id="${result.projectGid}">${$.t('detail.btnText')}</button>
          </div>
          `;
          break;
        case 3:
        case 4:
          proMainTemp = `
            ${commonTemp}
            <p class="color-gray align-center">${$.t('detail.end')}</p>
            <div class="collect-total">
              <div class="collect-item">
                ${method.thousandsFormatters(result.soldAmount)} ETH
              </div>
              <div class="collect-item">
                ${method.thousandsFormatters(result.soldTokenAmount)} ${result.projectToken}
              </div>
            </div>
          `;
          break;
        default:
          break;
      }

      proHeadTemp = `
        <div class="head-details">
          <div class="project-logo">
            <img src="${result.projectLogoLink}" alt="logo" class="logo">
          </div>
          <div class="project-info">
            <h3 class="project-name">${result.projectName}</h3>
            <div class="links">
              <a href="${result.websites.twitter}" target="_blank" class="icon twitter ${this.whetherClick(result.websites.twitter)}"></a>
              <a href="${result.websites.facebook}" target="_blank" class="icon facebook ${this.whetherClick(result.websites.facebook)}"></a>
              <a href="${result.websites.telegram}" target="_blank" class="icon telegram ${this.whetherClick(result.websites.telegram)}"></a>
              <a href="${result.websites.reddit}" target="_blank" class="icon reddit ${this.whetherClick(result.websites.reddit)}"></a>
              <a href="${result.websites.biYong}" target="_blank" class="icon biyong ${this.whetherClick(result.websites.biYong)}"></a>
              <a href="${result.websites.gitHub}" target="_blank" class="icon github ${this.whetherClick(result.websites.gitHub)}"></a>
            </div>
          </div>
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
      `;
      
      $proHead.html(proHeadTemp);
      $proBody.html(proBodyTemp);
      $proFoot.html(proFootTemp);
      $proMain.html(proMainTemp);
      
      // progress
      let proWidth = $('.progress-status').width(),
        progress = result.soldAmount / 15000,
        progressLen = progress * proWidth,
        softcap = result.softCap / 15000 * proWidth,
        hardcap = result.hardCap / 15000 * proWidth;
      
      if (result.soldAmount != 0) {
        progressLen > 24 && $('.circle-outer').css({ 'marginLeft': '-24px' });
        $('.progress-bar').css({ 'width': `${progressLen}px`, 'right': `${progressLen}px` });
        $('.circle-outer').css({ 'left': `${progressLen}px` });
      }

      $('.softcap').css('left', `${softcap}px`);
      $('.hardcap').css('left', `${hardcap}px`);

      switch (result.projectStatus) {
        case 0:
          $('.unstart-wrapper').show();

          let dateTime = (result.startTime - result.currentTime) / 1000;
          this.proStartCountdown(dateTime, result.freeGiveEnd / 1000);
          break;
        case 1:
        case 2:
          $('.start-wrapper').show();
          if (result.freeGiveEnd > 0) {
            $('.project-main').addClass('is-discounts');
            this.disStartCountdown(result.freeGiveEnd / 1000);
          } else {
            $('.discounts').hide();
            $('.project-main').addClass('no-discounts');
          }
          break;
        default:
          break;
      }

      $('.eth-raised-amount').text(method.thousandsFormatters(result.soldAmount));
      $loading.hide();
    })
    .catch(err => {
      $loading.hide();
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

  timeFormatter (timestamp) {
    let lang = method.getCookie('witshare.i18n.language');
    let text = null;
    let diff_time = parseInt(timestamp / 1000),
      day = Math.floor(diff_time / (24 * 60 * 60)),
      hour = Math.floor((diff_time - day * (24 * 60 * 60)) / 3600);

    day = day < 10 ? '0' + day : day;
    hour = hour < 10 ? '0' + hour : hour;

    switch (lang) {
      case 'en':
        text = `${day} ${$.t('common.day')} ${hour} ${$.t('common.hour')} left`;
        break;
      case 'cn':
        text = `剩下${day}${$.t('common.day')}${hour}${$.t('common.hour')}`;
        break;
      default:
        break;
    }
    return text;
  }

  discountFormmatter (value) {
    if (method.isEmpty(value)) return '';
    return `${parseFloat(value) * 100}%`;
  }

  // project start countdown
  proStartCountdown (date1, date2) {
    let lang = method.getCookie('witshare.i18n.language');
    let type = lang === 'cn' ? 'zh-CN' : ''; 

    $.countdown.setDefaults($.countdown.regionalOptions[type]);
    $('#project-countdown').countdown({
      until: date1,
      padZeroes: true,
      format: 'dHMS',
      onExpiry: () => {
        $('.unstart-wrapper').hide();
        $('.start-wrapper').show();
        this.disStartCountdown(date2);
      }
    });
  }

  // discounts start countdown
  disStartCountdown (date) {
    let lang = method.getCookie('witshare.i18n.language');
    let type = lang === 'cn' ? 'zh-CN' : ''; 

    $.countdown.setDefaults($.countdown.regionalOptions[type]);
    $('#discounts-countdown').countdown({
      until: date,
      padZeroes: true,
      format: 'dHMS',
      onExpiry: () => {
        $('.discounts').hide();
        $('.project-main').removeClass('is-discounts');
        this.renderProject();
      }
    });
  }

  // 项目开始后，局部刷新
  renderProject () {
    getIndex()
    .then(({ success, data, message }) => {
      let result = data.defaultProject;
      let getTokenAmount = '';
      switch (result.projectStatus) {
        case 0:
          break;
        case 1:
        case 2:
          if (result.freeGiveEnd > 0) {
            getTokenAmount = parseInt(result.priceRate * (1 + result.freeGiveRate));
          } else {
            getTokenAmount = result.priceRate;
          }
          $('.project-main').removeClass('is-discounts').addClass('no-discounts');
          $('.token-rate').text(`1 ETH : ${method.thousandsFormatters(getTokenAmount)} ${result.projectToken}`);
          $('.eth-raised-amount').text(method.thousandsFormatters(result.soldAmount));
          break;
        case 3:
        case 4:
          break;
        default:
          break;
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

}
