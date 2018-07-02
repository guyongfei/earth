import "bootstrap-table";
import "bootstrap-table/dist/bootstrap-table-locale-all";
import { baseURL } from '../common/constants';
import method from '../common/method';

export default class Home {
  constructor(el) {
    this.$el = $(el);
    this.$table = $('#table');

    this.tableRender();
  }

  //query params
  queryParams (params) {
    return {
      pageSize: params.pageSize,
      pageNum: params.pageNumber,
      ascOrdesc: params.sortOrder == 'desc' ? '-1' : '1',
      orderCondition: params.sortName || ''
    };
  }

  // response
  responseHandler ({ success, data, message }) {
    let d = {};
    d.total = data.total || 0;
    d.rows = data.list || [];
    return d;
  }

  //logo
  logoFormatter (value, row, index) {
    return `<a class="link" href="./details.html?gid=${row.projectGid}"><img src="${value}" alt="logo" class="logo" /></a>`;
  }

  // name
  nameFormatter (value, row, index) {
    return `<a class="link" href="./details.html?gid=${row.projectGid}">${row.projectName}</a>`; 
  }

  // status
  statusFormatter (value, row, index) {
    return `<span>${method.checkStatus(value)}</span>`
  }

  // time
  timerFormatter (value, row, index) {
    return `<i class="dot"></i><span class="time">${method.timeFormatter(value)}</span>`;
  }

  //operation
  operateFormatter (value, row, index) {
    return `<a href="./details.html?gid=${row.projectGid}" class="button">Go</a>`;
  }

  // projects init
  tableRender () {
    this.$table.bootstrapTable({
      locale: 'zh-CN',
      method: 'GET',
      url: `${baseURL}/project/list`,
      queryParams: this.queryParams,
      queryParamsType: 'no',
      contentType: 'application/json',
      dataType: 'json',
      responseHandler: this.responseHandler,
      pageNumber: 1,
      pageSize: 2,
      pageList: [10, 20, 50, 100],
      sidePagination: 'server',
      pagination: true,
      paginationHAlign: 'right',
      paginationLoop: false,
      paginationPreText: '<',//指定分页条中上一页按钮的图标或文字
      paginationNextText: '>',//指定分页条中下一页按钮的图标或文字
      silentSort: false,
      columns: [
        {
          field: 'projectLogoLink',
          align: 'center',
          formatter: this.logoFormatter
        },
        {
          title: 'Name',
          field: 'projectName',
          align: 'left',
          formatter: this.nameFormatter
        },
        {
          title: 'Token',
          field: 'projectToken',
          align: 'left'
        },
        {
          title: 'Synopsis',
          field: 'projectInstruction',
          align: 'center',
          class: 'color-gray'
        },
        {
          title: 'Start time',
          field: 'startTime',
          align: 'center',
          class: 'start-time',
          formatter: this.timerFormatter
        },
        {
          title: 'End time',
          field: 'endTime',
          align: 'center',
          class: 'end-time',
          formatter: this.timerFormatter
        },
        {
          title: 'Satus',
          field: 'projectStatus',
          formatter: this.statusFormatter
        },
        {
          title: 'Operation',
          field: 'operation',
          align: 'center',
          formatter: this.operateFormatter
        }
      ]
      // onSort: function (name, order) {
      //   this.$table.bootstrapTable('selectPage', 1);
      // }
    })
  }
}
