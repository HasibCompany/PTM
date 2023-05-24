import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent as Base } from "@hasib/core/base";
import { DataTableColumn, DataTableUI, ReportDialogUI } from '@hasib/ui';
import { HasibDate, PageType } from '@hasib/core/utils';
import { PtmService } from '../ptm.service';
import { Global, EventEmitterService } from "../../../core/services";
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'purchasingRepresentativesDefinition',
  templateUrl: './purchasingRepresentativesDefinition.component.html',
  styleUrls: ['./purchasingRepresentativesDefinition.component.scss']
})

export class PurchasingRepresentativesDefinitionComponent extends Base implements OnInit {
  t = Base.t;
  @ViewChild('purchaserDataDT', { static: true }) purchaserDataDT: DataTableUI;
  @ViewChild('report', { static: true }) report: ReportDialogUI;

  reportUrl;
  hideReport: boolean = true;

  eventData: any = {};
  disableRow: any = { purchaserNameAR: true, purchaserNameEN: true };
  purchaserData: any = [];

  columns: DataTableColumn[] = [
    {
      field: 'purchaserID', header: 'SHD_EMPLOYEE_NUMBER', controlType: 'lookup', lookupType: 'Employee',
      unique: true, required: true, isColSpan: true, isColSpanStart: true, colSpan: 2, compositeHeader: 'PTM_PURCHASING_REPRESENTATIVE',
      renderText: (event) => {
        if (event && event.row.purchaserID)
          return event.row.purchaserNumber;
      }
    },
    { field: 'purchaserNameEN', fieldAr: 'purchaserNameAR', header: 'PTM_EMPLOYEE_NAME', controlType: 'textBox' }, 
    { field: 'fromDate', header: 'SHD_FROM_DATE', controlType: 'calendar', dateType: 'g' },
    { field: 'toDate', header: 'SHD_TO_DATE', controlType: 'calendar', dateType: 'g' },
    {
      field: 'isActive', header: 'SHD_IS_ACTIVE', controlType: 'switch', defaultValue: true,
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
      field: 'isDefault', header: 'PTM_DEFAULT', controlType: 'checkBox',
      renderText: (event) => {
        if (event.data === true)
          return 'SHD_YES';
        else if (event.data === false)
          return 'SHD_NO';
        else
          return '';
      }
    }
  ];

  constructor(public ptmService: PtmService, public global: Global, private _es: EventEmitterService) {
    super();
  }

  ngOnInit(): void {
    this.setPageType(PageType.dataTablePage);
    this.appToolBar.show();

    this.appToolBar.onPrint = () => { 
      this.hideReport = false;
      var parameter = JSON.stringify({ purchaserID: null });
      this.reportUrl = JSON.stringify({ ReportName: "PurchaserReport", Template: "Template1", ReportTile: ('PTM_PURCHASING_REPRESENTATIVES_DEFINTION'), Orientation: "portrait", Parameter: parameter });
      this.report.viewReport();
    }

    this._es.onLegalEntityChanged.pipe(takeUntil(this.componentDestroyed)).subscribe(() => {
      this.appAlert.hide();
      this.loadPurchaser();
    }, error => { this.appAlert.showError(error) });

    this._es.onBranchChanged.pipe(takeUntil(this.componentDestroyed)).subscribe(() => {
      this.loadPurchaser();
    });
  }

  // DT Events
  onAddEditClick(event, eventType) {
    this.appAlert.hide();
    this.eventData = eventType == 'Add' ? {} : event.row;
  }

  onAddEditCell(event, eventType) {
    this.appAlert.hide();
    event
    eventType
    if (event.field == "purchaserID") {
      if (event && event.newData.selectedIDs && event.newData.selectedIDs[0])
        this.eventData = { purchaserID: event.newData.selectedIDs, purchaserNumber: event.newData.selectedItems[0].code, purchaserNameAR: event.newData.selectedItems[0].descAR, purchaserNameEN: event.newData.selectedItems[0].descEN };
      else
        this.eventData = { purchaserID: [], purchaserNumber: event.newData.selectedItems[0].code, purchaserNameAR: null, purchaserNameEN: null };
    }

    //if (event.field == "fromDate") {
    //  if (event.newData && event.newData != "") {
    //    if (this.eventData.toDate && event.newData > this.eventData.toDate.substring(0, 10)) {
    //      this.eventData = { ...this.eventData, fromDate: "", validDates: false };
    //      return;
    //    }
    //    else {
    //      this.eventData = { ...this.eventData, fromDate: event.newData, validDates: true };
    //    }
    //  }
    //}

    //if (event.field == "toDate") {
    //  if (event.newData && event.newData != "") {
    //    if (this.eventData.fromDate && event.newData < this.eventData.fromDate.substring(0, 10)) {
    //      this.eventData = { ...this.eventData, toDate: "", validDates: false, isActive: false };
    //      return;
    //    }
    //    else {
    //      if (event.newData >= HasibDate.getTodayGregorian())
    //        this.eventData = { ...this.eventData, fromDate: event.newData, validDates: true };
    //      else
    //        this.eventData = { ...this.eventData, fromDate: event.newData, validDates: true, isActive: false }; // R3
    //    }
    //  }
    //}
  }

  onSaveAddRow(event) {
    this.appAlert.hide();
    let data = event.rowNewData;
    data.purchaserID = event.rowNewData.purchaserID[0];

    if (data.fromDate && data.fromDate != "" && data.toDate && data.toDate != "" && data.fromDate > data.toDate) {
      this.appAlert.showError("PTM_DATES_ENTERED_NOT_VALID");
      return;
    }
    else if (data.toDate && data.toDate != "" && data.toDate < HasibDate.getTodayGregorian()) {
      data.isActive = false;
    }

    this.ptmService.insertPurchaser(data).subscribe((output: any) => {
      if (output.valid && output.affectedRows) {
        this.appAlert.showSuccess();
        this.purchaserDataDT.commitRow();
        this.purchaserDataDT.dataChanged();
        this.loadPurchaser();
      }
      else
        this.appAlert.showError(output.message);
    },
      error => { this.appAlert.showApiError(error); });
  }

  onSaveEditRow(event) {
    this.appAlert.hide();
    let data = event.rowNewData;
    data.purchaserID = event.rowNewData.purchaserID[0];

    if (data.fromDate && data.fromDate != "" && data.toDate && data.toDate != "" && data.fromDate > data.toDate) {
      this.appAlert.showError("PTM_DATES_ENTERED_NOT_VALID");
      return;
    }
    else if (data.toDate && data.toDate != "" && data.toDate < HasibDate.getTodayGregorian()) {
      data.isActive = false;
    }

    this.ptmService.updatePurchaser(data).subscribe((output: any) => {
      if (output.valid && output.affectedRows) {
        this.appAlert.showSuccess();
        this.purchaserDataDT.commitRow();
        this.purchaserDataDT.dataChanged();
        this.loadPurchaser();
      }
      else
        this.appAlert.showError(output.message);
    },
      error => { this.appAlert.showApiError(error); });
  }

  onDeleteRow(event) {
    let data = event.row;
    data.purchaserID = event.row.purchaserID[0];

    this.ptmService.deletePurchaser(data).subscribe((output: any) => {
      if (output.valid && output.affectedRows) {
        this.appAlert.showDeleteSuccess();
        this.loadPurchaser();
      }
      else
        this.handleErrorMessages(output.Message);
    },
      error => { this.handleErrorMessages(error); });
  }

  loadPurchaser() {
    this.ptmService.LoadPurchaser({}).subscribe((data: any) => {
      this.purchaserData = this.handleLookupIDs('load', JSON.parse(JSON.stringify(data)), 'purchaserID');
    });
  }

  handleLookupIDs(actionType, data, columnName) {
    if (actionType == 'load') {
      for (let i = 0; i < data.length; i++) {
        if (data[i][columnName] != null)
          data[i][columnName] = [data[i][columnName]];
      }
    }
    else if (data.length > 0) { // on Save
      for (let i = 0; i < data.length; i++) {
        if (data[i][columnName] != null)
          data[i][columnName] = data[i][columnName][0];
      }
    }
    return data;
  }

  handleErrorMessages(error) {
    if (error.error.Message && error.error.Message.indexOf('The DELETE statement conflicted with the REFERENCE') > -1) {
      this.appAlert.showError('PTM_PURCHASING_REPRESENTATIVE_USED_CANNONT_DELETED');
      return;
    }
    this.appAlert.showApiError(error);
  }

}
