import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent as Base } from "@hasib/core/base";
import { PageType, PageMode } from '@hasib/core/utils';
import { DataTableUI, ReportUI, DataTableColumn } from '@hasib/ui';
import { PtmService } from '../ptm.service';
import { Global } from "../../../core/services";
@Component({
  selector: 'purchaseOrderPermit',
  templateUrl: './purchaseOrderPermit.component.html',
  styleUrls: ['./purchaseOrderPermit.component.scss']
})
export class PurchaseOrderPermitComponent extends Base implements OnInit {
  @ViewChild('codesDT', { static: true }) codesDT: DataTableUI;
  @ViewChild('report', { static: true }) report: ReportUI;
  hideReport: boolean = true;
  reportUrl;
  t = Base.t;
  pageMode = PageMode.inquiryMode;
  codesData: any = [];
  newObj: any = [];
  eventData: any = {};
  editDisable: any = {};
  addDisable: any = {};
  codeType: string = ''
  attachmentTypeData = [{ typeFlag: true, nameAr: 'أساسي', nameEn: 'Basic' }, { typeFlag: false, nameAr: 'اختياري', nameEn: 'Optional' },];
  columns: DataTableColumn[] = [
    { field: '', header: 'PTM_VALIDITY_TYPE', controlType: 'dropDownList' },
    { field: '', header: 'PTM_AUTORIZED_PERSON', controlType: 'lookup'},
    { field: '', header: 'PTM_FROM_AMOUNT', controlType: 'spinner' },
    { field: '', header: 'PTM_TO_AMOUNT', controlType: 'spinner' },
    { field: '', header: 'PTM_FROM_DATE', controlType: 'calendar' },
    { field: '', header: 'PTM_TO_DATE', controlType: 'calendar' },
    {
      field: 'isActive', header: 'SHD_IS_ACTIVE', controlType: 'checkBox',
      renderText: (event) => {
        if (event.data === false)
          return this.t.instant('SHD_NO');
        else if (event.data === true)
          return this.t.instant('SHD_YES');
        else
          return '';
      }
    },
  ];
  //#region constructor
  constructor(private ptmService: PtmService, public global: Global) {
    super();
    this.ptmService;
  }
  //#endregion
  ngOnInit() {
    this.setPageType(PageType.dataTablePage);
    this.appToolBar.show();
    this.appToolBar.disablePrint = true;
    this.appToolBar.onPrint = () => {
      //this.hideReport = false;
      //var parameter = JSON.stringify({});
      //parameter = JSON.stringify({ codeType: this.codeType });
      //this.reportUrl = JSON.stringify({ ReportName: "GeneralCodesReport", Template: "Template1", ReportTile: ('WIM_GENERAL_CODES'), Orientation: "portrait", Parameter: parameter });
      //this.report.viewReport();
    }
  }
  // #region Crud .
  //Loading data accourding to the value choosen from DDL
  codeTypeChanged(event) {
    this.appAlert.hide();
    if (event.value && event.value != null) {
      if (event.value == 'PTC12') {
        this.codesDT.columns[6].visible = true;
        this.codesDT.columns[6].VisibleMode = 'alwaysVisible';
        this.codesDT.columnsChanged();
      }
      else {
        this.codesDT.columns[6].visible = false;
        this.codesDT.columns[6].VisibleMode = 'alwaysHidden';
        this.codesDT.columnsChanged();
      }
      this.loadData();
    } else {
      this.reset();
    }
  }
  //insert new record
  onSaveAddRow(event) {
    this.appAlert.hide();
    if (!event.rowNewData.isDefault && !(this.codesData.filter(item => item.isDefault == true).length >= 1)) {
      this.appAlert.showError('PTM_THERE_MUST_LEAST_ONE_ACTIVE_DEFAULT_VALUE_CODE_TYPE');
      return;
    }
    let paramObj =
    {
      codeType: this.codeType,
      code: event.rowNewData.code,
      descriptionAR: event.rowNewData.descriptionAR,
      descriptionEN: event.rowNewData.descriptionEN,
      isActive: event.rowNewData.isActive,
      isDefault: event.rowNewData.isDefault,
      typeFlag: this.codeType == 'PTC12' ? event.rowNewData.typeFlag : '',
      sortOrder: event.rowNewData.sortOrder,
    };
    this.ptmService.insertCodes(paramObj).subscribe((output: any) => {
      if (output.valid && output.insertedID != null) {
        this.appAlert.showSuccess();
        this.loadData();
        this.codesDT.commitRow(true);

      }
      else {
        this.appAlert.showError(output.message);
      }
    },
      error => {
        this.appAlert.showApiError(error);
      })
  }
  //update existing record
  onSaveEditRow(event) {
    this.appAlert.hide();
    let data = event.rowNewData;
    let obj = this.codesData.filter(item => item.isDefault == true)
    if (!data.isDefault && obj.length <= 0) {
      this.appAlert.showError('PTM_THERE_MUST_LEAST_ONE_ACTIVE_DEFAULT_VALUE_CODE_TYPE');
      return;
    }
    let paramObj =
    {
      codeType: this.codeType,
      codeID: event.rowNewData.codeID,
      code: event.rowNewData.code,
      descriptionAR: event.rowNewData.descriptionAR,
      descriptionEN: event.rowNewData.descriptionEN,
      isActive: event.rowNewData.isActive,
      isDefault: event.rowNewData.isDefault,
      sortOrder: event.rowNewData.sortOrder,
      typeFlag: this.codeType == 'PTC12' ? event.rowNewData.typeFlag : '',
      rowStamp: event.rowNewData.rowStamp
    };
    this.ptmService.updateCodes(paramObj).subscribe((output: any) => {
      if (output.valid && output.affectedRows) {
        this.appAlert.showSuccess();
      
        this.loadData();
        this.codesDT.commitRow(true);
      }
      else {
        this.appAlert.showError(output.message);
      }
    },
      error => {
        this.appAlert.showApiError(error);
      })
  }
  //delete a record
  ondDeleteRow(event) {
    this.appAlert.hide();
    let data = event.row;
    // لا يمكن حذف البيانات المحجوزة للنظام
    if (data.isReserved) {
      this.appAlert.showError('PTM_RESERVED_CODES_CANNOT_BE_UPDATED_DELETED');
      return;
    }
    if (data.isDefault && !(this.codesData.filter(item => item.isDefault == true).length > 1) && this.codesData.length > 1) {
      this.appAlert.showError('PTM_THERE_MUST_LEAST_ONE_ACTIVE_DEFAULT_VALUE_CODE_TYPE');
      return;
    }
    let paramObj =
    {
      codeType: this.codeType,
      codeID: event.row.codeID,
      rowStamp: event.row.rowStamp
    };
    this.ptmService.deleteCodes(paramObj).subscribe((output: any) => {
      if (output.valid && output.affectedRows) {
        this.appAlert.showDeleteSuccess();
        this.loadData();
      }
      else {
        this.appAlert.showError(output.message);
      }
    },
      error => {
        this.appAlert.showApiError(error);
      })
  }
  loadData() {
    let param = { codeType: this.codeType };
    this.ptmService.LoadCodes(param).subscribe(data => {
      this.codesData = data;
      this.codesDT.refresh();
    });
  }
  onAddClick() {
    let max = this.codesData.length == 0 ? 499 : this.codesData.reduce((op, item) => op = op > item.code ? op : item.code, 499);
    this.eventData =
    {
      code: max + 1
    };
    this.addDisable = {
      isReserved: true
    }
  }
  reset() {
    this.codeType = '';
    this.codesData = [];
    this.appToolBar.disablePrint = true;
  }
  onEditClick(event) {
  
    if (event.row.isReserved == true) {

      this.editDisable = {
        ...this.editDisable,
        code: true,
        descriptionAR: true,
        descriptionEN: true,
        isReserved: true,
        typeFlag: true,
        sortOrder: true
        //isActive: true,
        // isDefault: true
      }
    } else {
      this.editDisable = {
        ...this.editDisable,
        code: true,
        descriptionAR: false,
        descriptionEN: false,
        isReserved: true,
        typeFlag: false,
        sortOrder: false
        // isActive: false,
        // isDefault: false
      }
    }
  }
  onCancelEditRow(event) {
    event;
    this.appAlert.hide();
  }
  // #endregion
}
