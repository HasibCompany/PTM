import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent as Base } from "@hasib/core/base";
import { PageType, PageMode } from '@hasib/core/utils';
import { DataTableUI, ReportUI, DataTableColumn } from '@hasib/ui';
import { PtmService } from '../ptm.service';
import { EventEmitterService, Global } from "../../../core/services";
import { forkJoin } from 'rxjs';
import { SharedService } from '../../../shared';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'purchaseOrderPermit',
  templateUrl: './purchaseOrderPermit.component.html',
  styleUrls: ['./purchaseOrderPermit.component.scss']
})
export class PurchaseOrderPermitComponent extends Base implements OnInit {
  @ViewChild('permitionsDT', { static: true }) permitionsDT: DataTableUI;
  @ViewChild('report', { static: true }) report: ReportUI;
  hideReport: boolean = true;
  reportUrl;
  t = Base.t;
  pageMode = PageMode.inquiryMode;
  permitionsData: any = [];
  permissionTypeData: any = [
    { constantTypeID: 'PFT01', nameAR: 'مجموعة مستخدمين', nameEN: 'Users Group' },
    { constantTypeID: 'PFT02', nameAR: 'منصب إداري', nameEN: 'Managerial Position' },
    { constantTypeID: 'PFT03', nameAR: 'مسمى وظيفى', nameEN: 'Job Title' },
    { constantTypeID: 'PFT04', nameAR: 'مستخدم', nameEN: 'User' },
  ];
  permitionPersonData: any = [];
  userGroupData: any = [];
  administrativePostData: any = [];
  professionData: any = [];// from hrm
  productUserData: any = [];


  eventData: any = {};
  eventDisable: any = {};
  newObj: any = {};


  attachmentTypeData = [{ typeFlag: true, nameAr: 'أساسي', nameEn: 'Basic' }, { typeFlag: false, nameAr: 'اختياري', nameEn: 'Optional' },];

  permitionsColumn: DataTableColumn[] = [
    {
      field: 'permitFor', header: 'PTM_VALIDITY_TYPE', controlType: 'dropDownList', controlDataSource: this.permissionTypeData, required: true,
      dataValueField: 'constantTypeID', dataTextFieldEn: 'nameEN', dataTextFieldAr: 'nameAR',
      renderText: (event) => {
        var obj = this.permissionTypeData.filter(item => { return item.constantTypeID == event.data })[0];
        if (obj != undefined) {
          if (this.permissionTypeData && this.permissionTypeData.length > 0) {
            if (this.t.isAr)
              return obj.nameAR
            else
              return obj.nameEN;
          }
        }
      }
    },
    {
      field: 'permissionID', header: 'PTM_AUTORIZED_PERSON', controlType: 'lookup', controlDataSource: this.permitionPersonData, required: true,
      dataValueField: 'permissionID', dataTextFieldEn: 'permissionNameEN', dataTextFieldAr: 'permissionNameAR',
      renderText: (event) => {//check depending on previous column data
        if (this.t.isAr)
          return event.row.permissionNameAR
        else
          return event.row.permissionNameEN;
      }
    },
    { field: 'fromAmount', header: 'PTM_FROM_AMOUNT', controlType: 'spinner', dataType: 'real', required: true, unique: true, },
    { field: 'toAmount', header: 'PTM_TO_AMOUNT', controlType: 'spinner', dataType: 'real', required: true, unique: true, },
    {
      field: 'fromDate', header: 'PTM_FROM_DATE', controlType: 'calendar', required: true
    },
    {
      field: 'toDate', header: 'PTM_TO_DATE', controlType: 'calendar'
    },
    {
      field: 'isActive', header: 'SHD_IS_ACTIVE', controlType: 'switch',
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
  constructor(private ptmService: PtmService, private sharedService: SharedService, public global: Global, private es: EventEmitterService) {
    super();
    this.ptmService;
  }
  //#endregion
  ngOnInit() {
    this.setPageType(PageType.dataTablePage);
    this.appToolBar.show();

    this.es.onLegalEntityChanged.pipe(takeUntil(this.componentDestroyed)).subscribe(() => {
      this.appAlert.hide();
      if (this.global.getCurrentLegalEntityInfo() && this.global.getCurrentLegalEntityInfo().orgUnitID) {
        this.reset();
      }
      else {
        this.appAlert.showError('SHD_JOURNAL_DEFAULT_ORG_VALIDATION');
      }
    }, error => { this.appAlert.showApiError(error) });

    this.es.onBranchChanged.pipe(takeUntil(this.componentDestroyed)).subscribe(() => {
      this.appAlert.hide();
      if (this.global.getCurrentLegalEntityInfo().orgUnitID && this.global.getCurrentBranchInfo().branchID) {
        this.reset();
        this.loadBasicData();
      }
      else {
        this.appAlert.showError('SHD_JOURNAL_BRANCH_ORG_VALIDATION');
      }
    });
  }
  loadBasicData() {
    forkJoin([this.LoadUserGroup(), this.LoadAdministrativePost(), this.LoadProductUser(), this.LoadSettings()]).subscribe(results => {
      if (results) {
        this.userGroupData = results[0];
        this.administrativePostData = results[1];
        this.productUserData = results[2];
        this.userGroupData.forEach(item => {
          this.permitionPersonData.push({ permissionID: item.userGroupID, permissionNameEN: item.groupNameEN, permissionNameAR: item.groupNameAR, permitFor: 'PFT01' });
        });
        this.administrativePostData.forEach(item => {
          this.permitionPersonData.push({ permissionID: item.administrativePostID, permissionNameEN: item.nameEN, permissionNameAR: item.nameAR, permitFor: 'PFT02' });
        });
        this.productUserData.forEach(item => {
          this.permitionPersonData.push({ permissionID: item.userID, permissionNameEN: item.userNameEN, permissionNameAR: item.userNameAR, permitFor: 'PFT04' });
        });
        //if linked with hrm then load profession data
        if (results[3].length > 0) {
          if (+(results[3][0].fieldValue) == 1) {
            this.ptmService.LoadProfession({}).subscribe(data => {
              if (data && data.length > 0) {
                this.professionData = data;
                this.professionData.forEach(item => {
                  this.permitionPersonData.push({ permissionID: item.professionID, permissionNameEN: item.nameEN, permissionNameAR: item.nameAR, permitFor: 'PFT03' });
                });
              }
            })
          }
        }

      }
    });
  }
  LoadUserGroup() {
    return this.ptmService.LoadUserGroup({ appCode: 'PTM' });
  }
  LoadProductUser() {
    return this.ptmService.LoadProductUser({});
  }
  LoadAdministrativePost() {
    return this.sharedService.loadAdministrativePost({});
  }
  LoadSettings() {
    return this.ptmService.LoadSettings({ organizationID: this.global.getCurrentLegalEntityInfo().orgUnitID, settingCode: 'PT008' });
  }
  // #region Crud .
  //Loading data accourding to the value choosen from DDL
  screenCodeChanged(event) {
    this.appAlert.hide();
    if (event.value && event.value != null) {
      this.loadData();
    } else {
      this.reset();
    }
  }
  cellEvents(event, type) {
    this.appAlert.hide(); type;
    switch (event.field) {
      case 'permitFor':
        let constantTypeID = type == 'add' ? event.newData.constantTypeID : event.newData.value;
        switch (constantTypeID) {
          case 'PFT01':
            this.permitionsColumn[1].controlDataSource = this.permitionPersonData.filter(x => x.permitFor == 'PFT01');
            break;
          case 'PFT02':
            this.permitionsColumn[1].controlDataSource = this.permitionPersonData.filter(x => x.permitFor == 'PFT02');
            break;
          case 'PFT03'://not completed yet
            this.permitionsColumn[1].controlDataSource = this.permitionPersonData.filter(x => x.permitFor == 'PFT03');
            break;
          case 'PFT04':
            this.permitionsColumn[1].controlDataSource = this.permitionPersonData.filter(x => x.permitFor == 'PFT04');
            break;
        }
        this.permitionsDT.columnsChanged();
        break;
      case 'permissionID':
        let permissionData = type == 'add' ? event.newData : event.newData;
        this.newObj.permissionNameEN = permissionData.selectedItems[0].permissionNameEN;
        this.newObj.permissionNameAR = permissionData.selectedItems[0].permissionNameAR;
        break;
    }
  }
  //insert new record
  onSaveAddRow(event) {
    this.appAlert.hide();
    let paramObj =
    {
      screenCode: this.newObj.screenCode,
      permitFor: event.rowNewData.permitFor,
      userGroupID: event.rowNewData.permitFor == 'PFT01' ? event.rowNewData.permissionID[0] : null,
      administrativePostID: event.rowNewData.permitFor == 'PFT02' ? event.rowNewData.permissionID[0] : null,
      professionID: event.rowNewData.permitFor == 'PFT03' ? event.rowNewData.permissionID[0] : null,
      userID: event.rowNewData.permitFor == 'PFT04' ? event.rowNewData.permissionID[0] : null,
      fromAmount: event.rowNewData.fromAmount,
      toAmount: event.rowNewData.toAmount,
      fromDate: event.rowNewData.fromDate,
      toDate: event.rowNewData.toDate,
      isActive: event.rowNewData.isActive,
    };
    this.ptmService.InsertPOPermit(paramObj).subscribe((output: any) => {
      if (output.valid && output.insertedID != null) {
        this.appAlert.showSuccess();
        this.loadData();
        this.permitionsDT.commitRow(true);

      }
      else {//used this way cause the constraint belongs to multiple columns
        let fieldName = this.t.isAr ? 'صاحب الصلاحية' : 'Authorized Person';
        let value = this.t.isAr ? this.newObj.permissionNameAR : this.newObj.permissionNameEN;
        this.appAlert.showError(output.message, true, undefined, [fieldName, value]);
      }
    },
      error => {
        this.appAlert.showApiError(error);
      })
  }
  //update existing record
  onSaveEditRow(event) {
    this.appAlert.hide();
    let paramObj =
    {
      pOpermitID: event.rowNewData.pOpermitID,
      screenCode: this.newObj.screenCode,
      permitFor: event.rowNewData.permitFor,
      userGroupID: event.rowNewData.permitFor == 'PFT01' ? event.rowNewData.permissionID[0] : null,
      administrativePostID: event.rowNewData.permitFor == 'PFT02' ? event.rowNewData.permissionID[0] : null,
      professionID: event.rowNewData.permitFor == 'PFT03' ? event.rowNewData.permissionID[0] : null,
      userID: event.rowNewData.permitFor == 'PFT04' ? event.rowNewData.permissionID[0] : null,
      fromAmount: event.rowNewData.fromAmount,
      toAmount: event.rowNewData.toAmount,
      fromDate: event.rowNewData.fromDate,
      toDate: event.rowNewData.toDate,
      isActive: event.rowNewData.isActive,
      rowStamp: event.rowNewData.rowStamp
    };
    this.ptmService.UpdatePOPermit(paramObj).subscribe((output: any) => {
      if (output.valid && output.affectedRows > 0) {
        this.appAlert.showSuccess();
        this.loadData();
        this.permitionsDT.commitRow(true);
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
    let paramObj =
    {
      pOpermitID: event.row.pOpermitID,
      rowStamp: event.row.rowStamp
    };
    this.ptmService.DeletePOPermit(paramObj).subscribe((output: any) => {
      if (output.valid && output.affectedRows > 0) {
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
    this.ptmService.LoadPOPermit({ screenCode: this.newObj.screenCode }).subscribe(data => {
      data.forEach(element => {
        element.permissionID = [element.permissionID];
      });
      this.permitionsData = data;
      // this.permitionsDT.refresh();
    });
  }
  onAddClick() {
    if (this.permitionsData.filter(item => item.isActive == true).length < 1) {
      this.eventData = { isActive: true };//IDC9
    }
  }
  reset() {
    this.permitionsData = [];
    this.appToolBar.disablePrint = true;
  }
  onEditClick(event) {
    switch (event.row.permitFor) {
      case 'PFT01':
        this.permitionsColumn[1].controlDataSource = this.permitionPersonData.filter(x => x.permitFor == 'PFT01');
        break;
      case 'PFT02':
        this.permitionsColumn[1].controlDataSource = this.permitionPersonData.filter(x => x.permitFor == 'PFT02');
        break;
      case 'PFT03'://not completed yet
        this.permitionsColumn[1].controlDataSource = this.permitionPersonData.filter(x => x.permitFor == 'PFT03');
        break;
      case 'PFT04':
        this.permitionsColumn[1].controlDataSource = this.permitionPersonData.filter(x => x.permitFor == 'PFT04');
        break;
    }
    this.permitionsDT.columnsChanged();
  }
  onCancelEditRow(event) {
    event;
    this.appAlert.hide();
  }
  // #endregion
}
