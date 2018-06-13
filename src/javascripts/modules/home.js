import "bootstrap-table";
import "bootstrap-table/dist/bootstrap-table-locale-all";
import tableData from '../common/data';
// import { baseURL } from '../common/constants';

export default class Home {
  constructor(el) {
    this.$el = $(el);
    this.$table = $('#table');

    this.tableInit();
  }

  //query params
  queryParams (params) {
    return {

    };
  }
  

  // response
  responseHandler (res) {

  }

  //logo
  logoFormatter (value, row, index) {
    return `<img src="${value}" alt="logo" class="logo" />`;
  }

  // time
  timeFrormatter (value, row, index) {
    return `<i class="dot"></i><span class="time">${value}</span>`;
  }

  //operation
  operateFormatter (value, row, index) {
    return `<a href="./details.html" class="button">Go</a>`;
  }

  // projects init
  tableInit () {
    this.$table.bootstrapTable({
      // locale: 'zh-CN',
      // method: 'GET',
      // url: '',
      // queryParams: this.queryParams,
      // queryParamsType: 'no',
      // contentType: 'application/json',
      // dataType: 'json',
      // responseHandler: function(res) {},
      data: tableData,
      pageNumber: 1,
      pageSize: 6,
      pageList: [10, 20, 50, 100],
      // sidePagination: 'server',
      pagination: true,
      paginationHAlign: 'right',
      paginationLoop: false,
      paginationPreText: '<',//指定分页条中上一页按钮的图标或文字
      paginationNextText: '>',//指定分页条中下一页按钮的图标或文字
      // silentSort: false,
      columns: [
        {
          field: 'logo',
          align: 'center',
          formatter: this.logoFormatter
        },
        {
          title: 'Status',
          field: 'status',
        },
        {
          title: 'Name',
          field: 'name',
        },
        {
          title: 'Description',
          field: 'description',
          align: 'center',
          class: 'color-gray'
        },
        {
          title: 'Symbol',
          field: 'symbol',
          align: 'center'
        },
        {
          title: 'Start',
          field: 'start',
          align: 'center',
          class: 'start-time',
          formatter: this.timeFrormatter
        },
        {
          title: 'End',
          field: 'end',
          align: 'center',
          class: 'end-time',
          formatter: this.timeFrormatter
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
