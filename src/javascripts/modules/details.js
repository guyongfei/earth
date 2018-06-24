import { projectDetails } from '../common/service';
import method from '../common/method';

export default class Details {
  constructor(el) {
    this.$el = $(el);
    this.childMap = {};
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

      headTemp = `
        <h3 class="name">${data.projectName}</h3>
        <label for="label" class="label">${method.checkStatus(data.projectStatus)}</label>
        <p class="divide">目前代币的价格</p>
        <p>1ETH: ${data.priceRate}${data.projectName}</p>
        <button class="get-token-btn">马上获得代币</button>
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
          <a class="col-3" href="${data.websites.officialLink}"><img src="" alt=""><span>website</span></a>
          <a class="col-3" href="${data.websites.whitePaperLink}"><img src="" alt=""><span>white bool</span></a>
          <a class="col-3" href="${data.websites.twitter}"><img src="" alt=""><span>twitter</span></a>
          <a class="col-3" href="${data.websites.facebook}"><img src="" alt=""><span>facebook</span></a>
        </div>
        <div class="row">
          <a class="col-3" href="${data.websites.telegram}"><img src="" alt=""><span>telegram</span></a>
          <a class="col-3" href="${data.websites.reddit}"><img src="" alt=""><span>reddit</span></a>
          <a class="col-3" href="${data.websites.biYong}"><img src="" alt=""><span>biyong</span></a>
          <a class="col-3" href="${data.websites.gitHub}"><img src="" alt=""><span>github</span></a>
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
    })
    .catch(err => {
      console.log(err);
    });

  }

  // 绑定的事件
  bindEvents () {

  }

}
