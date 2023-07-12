import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent as Base } from "@hasib/core/base";
import { PageType, PageMode } from '@hasib/core/utils';
import { DataTableUI, ReportUI, DataTableColumn, CommandIcon } from '@hasib/ui';
import { PtmService } from '../ptm.service';
import { Global } from "../../../core/services";
import { AttachmentComponent } from '../../../ui-custom';
import { attachmentBusinessType } from '../../../shared/enums/attachmentBusinessType';

@Component({
  selector: 'generalCodes',
  templateUrl: './GeneralCodes.component.html',
  styleUrls: ['./GeneralCodes.component.scss']
})
export class GeneralCodesComponent extends Base implements OnInit {
  @ViewChild('codesDT', { static: true }) codesDT: DataTableUI;
  @ViewChild('report', { static: true }) report: ReportUI;
  @ViewChild('attachments', { static: true }) attachments: AttachmentComponent;

  businessType: number = attachmentBusinessType.PtmCodes;
  hideReport: boolean = true;
  reportUrl;
  t = Base.t;
  pageMode = PageMode.inquiryMode;
  hideAttachment: boolean = true;
  codeID = 0;
  codesData: any = [];
  newObj: any = [];
  eventData: any = {};
  editDisable: any = {};
  addDisable: any = {};
  codeType: string = ''
  attachmentTypeData = [{ typeFlag: true, nameAr: 'أساسي', nameEn: 'Basic' }, { typeFlag: false, nameAr: 'اختياري', nameEn: 'Optional' },];
  durationTypeData = [
    { code: 'D', nameAr: 'يوم', nameEn: 'Day' },
    { code: 'M', nameAr: 'شهر', nameEn: 'Month' },
    { code: 'Y', nameAr: 'سنة', nameEn: 'Year' }];
  columns: DataTableColumn[] = [
    { field: 'code', header: 'SHD_CODE', controlType: 'spinner', dataType: 'integer', unique: true, spinnerMin: 500, required: true },
    { field: 'descriptionAR', header: 'SHD_DESC_AR', controlType: 'textBox', dataType: 'arabicText', required: true, unique: true },
    { field: 'descriptionEN', header: 'SHD_DESC_EN', controlType: 'textBox', dataType: 'englishText', required: true, unique: true },
    {
      field: 'isActive', header: 'SHD_IS_ACTIVE', controlType: 'switch', offText: 'SHD_NO', onText: 'SHD_YES',
      renderText: (event) => {
        if (event.data === false)
          return this.t.instant('SHD_NO');
        else if (event.data === true)
          return this.t.instant('SHD_YES');
        else
          return '';
      }
    },
    {
      field: 'isDefault', header: 'SHD_DEFAULT', controlType: 'switch', offText: 'SHD_NO', onText: 'SHD_YES',
      renderText: (event) => {
        if (event.data === false)
          return this.t.instant('SHD_NO');
        else if (event.data === true)
          return this.t.instant('SHD_YES');
        else
          return '';
      }
    },
    {
      field: 'isReserved', header: 'SHD_IS_RESERVED', controlType: 'switch', offText: 'SHD_NO', onText: 'SHD_YES',
      renderText: (event) => {
        if (event.data === true)
          return 'SHD_YES';
        else if (event.data === false)
          return 'SHD_NO';
        else
          return '';
      }
    },
    {
      field: 'typeFlag', header: 'SHD_ATTACHMENT_TYPE', controlType: 'dropDownList',
      controlDataSource: this.attachmentTypeData,
      dataValueField: 'typeFlag', dataTextFieldEn: 'nameEn', dataTextFieldAr: 'nameAr', defaultValue: true
      , renderText: (event) => {
        const obj = this.attachmentTypeData.filter(item => { return item.typeFlag == event.row.typeFlag })[0];
        if (obj) {
          if (this.t.isAr)
            return obj.nameAr;
          else
            return obj.nameEn;
        }
        else
          return '';
      }, visible: false, VisibleMode: 'alwaysHidden'
    },
    {
      field: 'appendixLink', header: 'PTM_LINK', controlType: 'textBox', dataType: 'url', visible: false, VisibleMode: 'alwaysHidden',
      colSpan: 2, isColSpan: true, isColSpanStart: true, compositeHeader: 'PTM_APPENDIX',
    },
    {
      header: 'PTM_ATTACHED', controlType: 'button', viewAs: 'command', visible: false, VisibleMode: 'alwaysHidden', isColSpan: true, commandIcon: CommandIcon.view, onClick: (event) => this.openAttachmentDlg(event?.row?.codeID),
    },
    {
      field: 'duration', header: 'PTM_DURATION', controlType: 'spinner', dataType: 'integer', spinnerMin: 0, visible: false, VisibleMode: 'alwaysHidden', required: true,
      colSpan: 2, isColSpan: true, isColSpanStart: true, compositeHeader: 'PTM_DURATION_OF_THE_AGREEMENT'
    },
    {
      field: 'durationType', header: 'PTM_DURATION_TYPE', controlType: 'dropDownList', isColSpan: true, visible: false, VisibleMode: 'alwaysHidden',
      controlDataSource: this.durationTypeData, dataValueField: 'code', dataTextFieldEn: 'nameEn', dataTextFieldAr: 'nameAr', dataType: 'integer', required: true
      , renderText: (event) => {
        const obj = this.durationTypeData.filter(item => { return item.code == event.row.durationType })[0];
        if (obj) {
          if (this.t.isAr)
            return obj.nameAr;
          else
            return obj.nameEn;
        }
        else
          return '';
      }
    },
    { field: 'sortOrder', header: 'PTM_ORDER', controlType: 'spinner', dataType: 'integer', required: true, unique: true, spinnerMin: 1 },
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
      this.codeType = event.value;
      this.codesDT.columns[6].required = event.value == 'PTC12' ? true : false;
      this.codesDT.columns[6].visible = event.value == 'PTC12' ? true : false;
      this.codesDT.columns[6].VisibleMode = event.value == 'PTC12' ? 'alwaysVisible' : 'alwaysHidden';
      this.codesDT.columns[7].required = event.value == 'PTC19' ? true : false;
      this.codesDT.columns[7].visible = event.value == 'PTC19' ? true : false;
      this.codesDT.columns[7].VisibleMode = event.value == 'PTC19' ? 'alwaysVisible' : 'alwaysHidden';
      this.codesDT.columns[8].required = event.value == 'PTC19' ? true : false;
      this.codesDT.columns[8].visible = event.value == 'PTC19' ? true : false;
      this.codesDT.columns[8].VisibleMode = event.value == 'PTC19' ? 'alwaysVisible' : 'alwaysHidden';
      this.codesDT.columns[9].required = event.value == 'PTC20' ? true : false;
      this.codesDT.columns[9].visible = event.value == 'PTC20' ? true : false;
      this.codesDT.columns[9].VisibleMode = event.value == 'PTC20' ? 'alwaysVisible' : 'alwaysHidden';
      this.codesDT.columns[10].required = event.value == 'PTC20' ? true : false;
      this.codesDT.columns[10].visible = event.value == 'PTC20' ? true : false;
      this.codesDT.columns[10].VisibleMode = event.value == 'PTC20' ? 'alwaysVisible' : 'alwaysHidden';

      this.codesDT.columnsChanged();

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
    let paramObj = event.rowNewData;
    paramObj =
    {
      ...paramObj,
      codeType: this.codeType,
      typeFlag: this.codeType == 'PTC12' ? event.rowNewData.typeFlag : '',
      insertedAttachments: this.attachments ? this.attachments.getInsertedAttachments() : [],
      deletedAttachments: this.attachments ? this.attachments.getDeletedAttachments() : []
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
    let paramObj = event.rowNewData;
    paramObj =
    {
      ...paramObj,
      codeType: this.codeType,
      typeFlag: this.codeType == 'PTC12' ? event.rowNewData.typeFlag : '',
      insertedAttachments: this.attachments ? this.attachments.getInsertedAttachments() : [],
      deletedAttachments: this.attachments ? this.attachments.getDeletedAttachments() : []
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
  openAttachmentDlg(codeID) {
    this.hideAttachment = false;
    this.codeID = codeID ? codeID : this.codesDT.currentMode == 'edit' ? this.codesDT.editDataRow.codeID : '';
    this.attachments.isReadOnlyMode = this.codesDT.currentMode == 'read' ? true : false;
    //this.attach
  }
  // #endregion
}
