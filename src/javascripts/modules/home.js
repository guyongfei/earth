import "bootstrap-table";
import "bootstrap-table/dist/bootstrap-table-locale-all";
// import { baseURL } from '../common/constants';

export default class Home {
  constructor(el) {
    this.$el = $(el);
    this.$table = $('#table');

    this.tableInit();
  }

  // projects init
  tableInit () {
    this.$table.bootstrapTable({
      locale: 'zh-CN',
      method: 'GET',
      url: '../data/global.json',
      pagination: true,
      paginationHAlign: 'right',
      paginationLoop: false,
      paginationPreText: '<',
      paginationNextText: '>',
      columns: [
        {
          title: 'Logo',
          field: 'logo',
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
        },
        {
          title: 'Symbol',
          field: 'symbol',
        },
        {
          title: 'Start',
          field: 'start',
        },
        {
          title: 'End',
          field: 'end',
        },{
          title: 'Operation',
          field: 'operation',
        }
      ]
    })
  }
}
