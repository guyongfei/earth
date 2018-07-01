import { projectDetails } from '../common/service';
import method from '../common/method';
import getModule from './index';

export default class Details {
  constructor(el) {
    this.$el = $(el);
    this.childMap = {};

    $(() => {
      this.userForm = getModule('baseform');
    });

    this.handleDom();
    this.render();
    this.bindEvents();
  }

  handleDom () {
    let $header = $('.box-head'),
      $footer = $('.box-foot')

    this.childMap.$header = $header;
    this.childMap.$footer = $footer;
  }

  // 初始化
  render () {
    const {
      $header,
      $footer
    } = this.childMap;
    
    let gid = method.getUrlParam('gid');
    projectDetails(gid)
    .then(({ success, data, message }) => {
      if (!success) { console.log('no data'); }; 
      let headTemp, proHeadTemp, proBodyTemp, proFootTemp;
      let flag = !this.checkStatus(data.projectStatus),
        className = flag ? 'disabled' : '';

      headTemp = `
        <h3 class="name">${data.projectName}</h3>
        <label for="label" class="label">${method.checkStatus(data.projectStatus)}</label>
        <p class="divide">目前代币的价格</p>
        <p>1ETH: ${data.priceRate}${data.projectName}</p>
        <button class="get-token-btn" data-id="${data.projectGid}">马上获得代币</button>
        <p>已卖代币数：<span class="sale-numbers">${method.thousandsFormatter(data.soldAmount)}</span></p>
      `;

      proHeadTemp = `
        <div class="project-logo">
          <img src="${data.projectLogoLink}" alt="logo">
        </div>
        <div class="project-details">
          <h3>
            <span class="project-name">${data.projectName}</span>
            <span class="project-status">${method.checkStatus(data.projectStatus)}</span>
          </h3>
          <p class="project-infos">${data.projectInstruction}</p>
        </div>
      `;

      proBodyTemp = `
        <div class="row">
          <a class="col-3" href="${data.websites.officialLink}"><img src="./images/details/website.png" alt=""><span>website</span></a>
          <a class="col-3" href="${data.websites.whitePaperLink}"><img src="./images/details/whitebook.png" alt=""><span>white bool</span></a>
          <a class="col-3" href="${data.websites.twitter}"><img src="./images/details/twitter.png" alt=""><span>twitter</span></a>
          <a class="col-3" href="${data.websites.facebook}"><img src="./images/details/facebook.png" alt=""><span>facebook</span></a>
        </div>
        <div class="row">
          <a class="col-3" href="${data.websites.telegram}"><img src="./images/details/telegram.png" alt=""><span>telegram</span></a>
          <a class="col-3" href="${data.websites.reddit}"><img src="./images/details/reddit.png" alt=""><span>reddit</span></a>
          <a class="col-3" href="${data.websites.biYong}"><img src="./images/details/biyong.png" alt=""><span>biyong</span></a>
          <a class="col-3" href="${data.websites.gitHub}"><img src="./images/details/github.png" alt=""><span>github</span></a>
        </div>
      `;

      proFootTemp = `
        <div class="row">
          <div class="col-4">
            <p class="top">Name</p>
            <p class="bottom">${data.projectName}</p>
          </div>
          <div class="col-4">
            <p class="top">Start time</p>
            <p class="bottom">
              <i class="dot bg-color-green"></i><span class="start-time">${method.timeFormatter(data.startTime)}</span>
            </p>
          </div>
          <div class="col-4">
            <p class="top">End time</p>
            <p class="bottom">
              <i class="dot bg-color-orange"></i><span class="end-time">${method.timeFormatter(data.endTime)}</span>
            </p>
          </div>
        </div>
      `;

      $header.html(headTemp);
      $footer.find('.project-head').html(proHeadTemp);
      $footer.find('.project-body').html(proBodyTemp);
      $footer.find('.project-foot').html(proFootTemp);
      $footer.find('.desc-field').text(data.projectContent);

      if (flag) {
        $header.find('.get-token-btn').attr('disabled', 'disabled');
      }
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
        gid = $this.data('id'),
        logined = method.getCookie('logined');
      
      if (logined) {
        window.location.href = `./sale.html?gid=${gid}`;
      } else {
        this.userForm.execInAnimation();
      }
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

}
