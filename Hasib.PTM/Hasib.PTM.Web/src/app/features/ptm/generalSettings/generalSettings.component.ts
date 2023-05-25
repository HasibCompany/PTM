import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent as Base } from "@hasib/core/base";
import { PageMode, PageType } from '@hasib/core/utils';
import { PtmService } from '../ptm.service';
import { FormUI } from '@hasib/ui';
import { DataTableColumn, DataTableUI, DataTableSummary } from '@hasib/ui';
import { EventEmitterService, Global } from '@hasib/core/services';
import { takeUntil } from 'rxjs/operators';
//import { forkJoin } from 'rxjs';

@Component({
  selector: 'generalSettings',
  templateUrl: './generalSettings.component.html',
  styleUrls: ['./generalSettings.component.scss']

})
export class GeneralSettingsComponent extends Base implements OnInit {

  @ViewChild('formEl', { static: true }) formEl: FormUI;
  @ViewChild('groupLevelDT', { static: true }) groupLevelDT: DataTableUI;
  @ViewChild('numberOfLineDT', { static: false }) numberOfLineDT: DataTableUI;

  // #region Init Var. 
  t = Base.t;
  pageMode = PageMode.inquiryMode;
  orgUnitID = this.globalService.getCurrentLegalEntityInfo().orgUnitID;
  updatedSettings: any[] = []; // array for settings bulk
  jasonData: any; //obj to send to DB (settingCode, fieldValue, rowStamp)
  groupLevelData: any = [];
  groupLevelDataOnly = []; // to use when updating the DT only
  numberOfLineData: any = [];
  isGovernment: any = [];
  noOfLines: boolean = true;
  // object to handle selected value from html
  newObj: any = {
    isLinkedFinancial: {},
    isLinkedHR: {},
    currYear: {},
    currPeriod: {},
    fromDate: {},
    toDate: {},
    isLinkedFAM: {},
    isLinkedPurchase: {},
    autoGroupNo: {},
    seperatorGroup: {},
    groupLevels: {},
    statorItemNo: {},
    serialDigits: {},
    seperatorBet: {},
    digits: {},
    autoItemNo: {},
    storeLevel: {},
    autoStoreNo: {},
    // printedDigits: {},
    serialNoDigits: {},
    sortingDate: {},
    allowReturn: {},
    reserveApproved: {},
    reserveLicense: {},
    tempReceipt: {},
    returnStore: {},
    minBalance: {},
    reorderBalance: {},
    upperLimit: {},
    returnZeroPrice: {},
    warnMSG: {},
    receiptZeroPrice: {},
    itemLables: {},
    managerID: {},
    controlID: {},
    printA4: {},
    SerialDocs: {},
    PrintQR: {},
    taxRefund: {},
  };
  disableObj: any = {};

  settingObj: any = [];
  counter: number = 0;
  totalNoDigits: number = 0;
  editDisable: any = {};
  additionResult: number = 0;
  enableDTAdd = false;// var to enable add btn in DT 
  enableDTDelete = false;//var to enable delete icon in DT
  //radio button list data
  docSerial: any = [
    { id: 'O', nameEn: 'Organization', nameAr: 'المنشأة' },
    { id: 'B', nameEn: 'Branch', nameAr: 'الفرع' },
    { id: 'L', nameEn: 'Location', nameAr: 'الموقع' }
  ];
  disableItemsGroupsTab: boolean;
  disableStoreNoTab: boolean;
  disableItemNoTab: boolean;
  isFGLActive: boolean = false;
  isFAMActive: boolean = false;
  isHRMActive: boolean = false;
  isPTMActive: boolean = false;

  managerIDs: any = [];
  controlIDs: any = [];
  emptyObj: any = { fieldValue: null };
  managerErrorMsg: any = '';
  controlErrorMsg: any = '';
  groupLevelColums: DataTableColumn[] = [
    { field: 'nameAR', header: 'PTM_GROUP_DESCRIPTION_ARABIC', controlType: 'textBox', dataType: 'arabicText', unique: true, required: true },
    { field: 'nameEN', header: 'PTM_GROUP_DESCRIPTION_ENGLISH', controlType: 'textBox', dataType: 'englishText', unique: true, required: true },
    { field: 'numberOfDigits', header: 'PTM_NUMBER_OF_DIGITS', controlType: 'spinner', spinnerMin: 1, spinnerMax: 5, required: true },
  ];
  totalDigits: DataTableSummary = {
    title: 'SHD_TOTAL',
    showTitleInColumn: 'nameEN',
    type: 'sum'
    ,
    columns: [
      {
        field: 'numberOfDigits',
        renderText: (event) => {
          this.totalNoDigits = event.result;
          this.calculateItemNoDigits();
          return event.result;

        }
      }
    ]
  };


  numberOfLineColums: DataTableColumn[] = [
    { field: 'nameAR', header: 'SHD_FORM_NAME_ARABIC', controlType: 'textBox' },
    { field: 'nameEN', header: 'SHD_FORM_NAME_ENGLISH', controlType: 'textBox' },
    { field: 'fieldValue', header: 'PTM_NO_OF_LINES', controlType: 'textBox' },
  ];


  constructor(public ptmService: PtmService, private globalService: Global, private es: EventEmitterService) {
    super();
    this.ptmService;
    this.isGovernment = this.globalService.getIsGovernmentPackageType();
  }

  ngOnInit(): void {
    this.setPageType(PageType.multipleRecordsPage);
    this.appToolBar.show();
    this.appToolBar.disableEdit = false;
    if (this.isGovernment) {
      this.docSerial.push({ id: 'S', nameEn: 'Store', nameAr: 'المستودع' });
      this.docSerial.push({ id: 'F', nameEn: 'Fiscal Year', nameAr: 'السنة المالية' });
    }
    // no need for load() here since it's always use the one in onLegalEntityChanged

    this.appToolBar.onEdit = () => {

      this.pageMode = PageMode.editMode;
      this.appToolBar.disableSaveAndCancel = false;
    }

    this.appToolBar.onSave = () => {
      if (!this.formEl.validate()) {

        if (this.checkSpinner())
          this.appAlert.showError('PTM_DIGITS_ITEM_MAX', true);

        else
          this.appAlert.showError('PTM_FILL_ALL_FIELDS');
        return;
      }
      if (this.totalNoDigits > 20) {
        this.appAlert.showError('PTM_DIGITS_ITEM_MAX_20', true);
      } else if (this.checkSpinner()) {
        this.appAlert.showError('PTM_DIGITS_ITEM_MAX', true);
      }

      else {
        this.appAlert.hide();
        //check if no. of levels of DT equals the one in ddl
        let notDelete = this.groupLevelData.filter(item => item.h_DT_ACTION != "delete");
        if (this.newObj.groupLevels.fieldValue != notDelete.length)
          return this.appAlert.showError('PTM_CLASSIFICATION_ITEM_GROUPS_LEVELS_IDENTICAL_NUMBER_GROUP_LEVELS', true);

        let list = this.groupLevelData.filter(item => item.h_DT_ACTION != null);
        if (this.updatedSettings.length > 0 || list.length > 0) {
          this.saveSettings();
          this.calculateItemNoDigits();

        } else {
          this.appAlert.showError('SHD_NO_DATA_CHANGED', true);
        }
      }
    }

    this.appToolBar.onCancel = () => {
      if (this.pageMode == PageMode.editMode) {
        this.loadSettings();
        this.pageMode = PageMode.inquiryMode;
        this.appToolBar.disableEdit = false;
      }
    }
    // to reload the page after changing the org from the menu 
    this.es.onLegalEntityChanged.pipe(takeUntil(this.componentDestroyed)).subscribe(() => {
      this.appAlert.hide();
      if (this.globalService.getCurrentLegalEntityInfo() && this.globalService.getCurrentLegalEntityInfo().orgUnitID) {
        this.orgUnitID = this.globalService.getCurrentLegalEntityInfo().orgUnitID;
        this.isGovernment = this.globalService.getIsGovernmentPackageType();
        this.loadSettings();
      }
      else {
        this.appAlert.showError('SHD_JOURNAL_DEFAULT_ORG_VALIDATION');
      }
    }, error => { this.appAlert.showApiError(error) });

  }

  // check for rules in the Use Case
  checkRules() {
 //   forkJoin([this.SettingsUpdateStatus(), this.checkAppActivate('FGL'), this.checkAppActivate('FAM'), this.checkAppActivate('HRM'), this.checkAppActivate('PTM')]).subscribe(results => {
    //  if (results) {
     /*   if (results[0].extras != null) {
          this.disableItemsGroupsTab = results[0].extras.hasItemGroup;
          this.disableItemNoTab = results[0].extras.hasItem;
          this.disableStoreNoTab = results[0].extras.hasStore;
          if (this.isGovernment) {
            this.disableObj.serialDocs = results[0].extras.hasVoucherSettings;
            this.disableObj.serialNoDigits = results[0].extras.hasVoucherSettings;
          }
          else
            this.disableObj.serialDocs = results[0].extras.hasVoucherSettings;
        }

        this.isFGLActive = results[1];
        this.isFAMActive = results[2];
        this.isHRMActive = results[3];
        this.isPTMActive = results[4];
        */
        // TO DO -- check Active app Linked with purchase system
        // DONE -- check Active app Linked with purchase system
  //    }
   // },
  //    error => { this.appAlert.showError(error) });
 }

  SettingsUpdateStatus() {
  //  return this.ptmService.SettingsUpdateStatus(this.orgUnitID);
  }

  checkAppActivate(/*/appCode*/) {
  //  return this.ptmService.checkAppActivate(appCode);
  }

  loadSettings() {
    this.checkRules();

   //this.ptmService.LoadSettings(this.orgUnitID, '', '').subscribe(data => {
   //   this.settingObj = data;



   //   this.settingObj.lGroup = this.settingObj.filter(item => item.codeGroup == "L");
   //   this.getLFieldValue();

   //   this.settingObj.cGroup = this.settingObj.filter(item => item.codeGroup == "C");
   //   this.getCFieldValue();
   //   // load items group levels DT
   //  /* this.ptmService.LoadSettingsGroupLevel(this.orgUnitID, parseInt(this.newObj.groupLevels.fieldValue), '').subscribe(data => {
   //     this.groupLevelData = data;
   //     this.groupLevelDataOnly = data;
   //   });
   //   */
   //   this.settingObj.iGroup = this.settingObj.filter(item => item.codeGroup == "I");
   //   this.getIFieldValue();

   //   this.settingObj.sGroup = this.settingObj.filter(item => item.codeGroup == "S");
   //   this.getSFieldValue();

   //   this.settingObj.gGroup = this.settingObj.filter(item => item.codeGroup == "G");
   //   this.getGFieldValue();

   //   if (this.isGovernment && this.newObj.isLinkedFinancial.fieldValue == '1' && this.docSerial.length == 4) {
   //     this.docSerial = Object.assign([], this.docSerial);
   //   } else if (this.isGovernment && this.newObj.isLinkedFinancial.fieldValue == '1' && this.docSerial.length == 5) {
   //     this.docSerial = Object.assign([], this.docSerial);
   //   } else if (this.isGovernment && this.newObj.isLinkedFinancial.fieldValue == '0' && this.docSerial.length == 5) {
   //     this.docSerial.pop();
   //     this.docSerial = Object.assign([], this.docSerial);
   //   }
   //   this.docSerial;
   //   this.castingToInt();
   //   this.counter = 0;
   //   this.updatedSettings = [];
   //   this.enableDTAdd = false;
   //   this.enableDTDelete = false;
   //   this.managerErrorMsg = '';
   //   this.controlErrorMsg = '';

   // });



  }
  getGFieldValue() {

    if (this.isGovernment) {

      this.newObj.reserveLicense = this.settingObj.gGroup.filter(item => item.settingCode == "S023")[0];
      if (!this.newObj.reserveLicense) {
        this.newObj.reserveLicense = {};
        this.newObj.reserveLicense.fieldValue = '';
      }

      this.newObj.tempReceipt = this.settingObj.gGroup.filter(item => item.settingCode == "S024")[0];

      if (!this.newObj.tempReceipt) {
        this.newObj.tempReceipt = {};
        this.newObj.tempReceipt.fieldValue = '';
      }
      this.newObj.returnStore = this.settingObj.gGroup.filter(item => item.settingCode == "S025")[0];
      if (!this.newObj.returnStore) {
        this.newObj.returnStore = {};
        this.newObj.returnStore.fieldValue = '';
      }

      this.newObj.warnMSG = this.settingObj.gGroup.filter(item => item.settingCode == "S030")[0];

      if (!this.newObj.warnMSG) {
        this.newObj.warnMSG = {};
        this.newObj.warnMSG.fieldValue = '';
      }
      this.newObj.receiptZeroPrice = this.settingObj.gGroup.filter(item => item.settingCode == "S031")[0];

      if (!this.newObj.receiptZeroPrice) {
        this.newObj.receiptZeroPrice = {};
        this.newObj.receiptZeroPrice.fieldValue = '';
      }

      this.newObj.serialNoDigits = this.settingObj.filter(item => item.settingCode == "S053")[0];

      if (this.newObj.serialNoDigits)
        this.newObj.serialNoDigits.fieldValue = this.newObj.serialNoDigits.fieldValue == null ? '' : this.newObj.serialNoDigits.fieldValue;
      else {
        this.newObj.serialNoDigits = {};
        this.newObj.serialNoDigits.fieldValue = '';
      }

    }
    else {
      this.newObj.sortingDate = this.newObj.reserveLicense = this.newObj.tempReceipt = this.newObj.returnStore = this.newObj.warnMSG = this.newObj.receiptZeroPrice = this.newObj.printA4 = this.newObj.serialNoDigits = this.emptyObj;
    }
    this.newObj.sortingDate = this.settingObj.gGroup.filter(item => item.settingCode == "S020")[0];
    this.newObj.allowReturn = this.settingObj.gGroup.filter(item => item.settingCode == "S021")[0];
    this.newObj.reserveApproved = this.settingObj.gGroup.filter(item => item.settingCode == "S022")[0];
    this.newObj.minBalance = this.settingObj.gGroup.filter(item => item.settingCode == "S026")[0];
    this.newObj.reorderBalance = this.settingObj.gGroup.filter(item => item.settingCode == "S027")[0];
    this.newObj.upperLimit = this.settingObj.gGroup.filter(item => item.settingCode == "S028")[0];
    this.newObj.returnZeroPrice = this.settingObj.gGroup.filter(item => item.settingCode == "S029")[0];
    this.newObj.itemLables = this.settingObj.gGroup.filter(item => item.settingCode == "S046")[0];
    this.newObj.managerID = this.settingObj.gGroup.filter(item => item.settingCode == "S050")[0];
    this.newObj.controlID = this.settingObj.gGroup.filter(item => item.settingCode == "S051")[0];
    this.newObj.SerialDocs = this.settingObj.gGroup.filter(item => item.settingCode == "S052")[0];
    this.newObj.PrintQR = this.settingObj.gGroup.filter(item => item.settingCode == "S054")[0];
    this.newObj.taxRefund = this.settingObj.gGroup.filter(item => item.settingCode == "S055")[0];
  }
  getCFieldValue() {
    this.newObj.groupLevels = this.settingObj.cGroup.filter(item => item.settingCode == "S009")[0];
    this.newObj.seperatorGroup = this.settingObj.cGroup.filter(item => item.settingCode == "S010")[0];
    this.newObj.seperatorGroup.fieldValue = this.newObj.seperatorGroup.fieldValue == null ? '*' : this.newObj.seperatorGroup.fieldValue;
    this.newObj.autoGroupNo = this.settingObj.cGroup.filter(item => item.settingCode == "S011")[0];

  }
  getSFieldValue() {
    this.newObj.storeLevel = this.settingObj.sGroup.filter(item => item.settingCode == "S017")[0];
    this.newObj.autoStoreNo = this.settingObj.sGroup.filter(item => item.settingCode == "S018")[0];

  }
  getIFieldValue() {

    this.newObj.statorItemNo = this.settingObj.iGroup.filter(item => item.settingCode == "S012")[0];
    this.newObj.serialDigits = this.settingObj.iGroup.filter(item => item.settingCode == "S013")[0];
    this.newObj.serialDigits.fieldValue = this.newObj.serialDigits.fieldValue == null ? '' : this.newObj.serialDigits.fieldValue;
    this.newObj.seperatorBet = this.settingObj.iGroup.filter(item => item.settingCode == "S014")[0];
    this.newObj.seperatorBet.fieldValue = this.newObj.seperatorBet.fieldValue == null ? '*' : this.newObj.seperatorBet.fieldValue;

    this.newObj.digits = this.settingObj.iGroup.filter(item => item.settingCode == "S015")[0];
    this.newObj.digits.fieldValue = this.newObj.digits.fieldValue == null ? '' : this.newObj.digits.fieldValue;

    this.newObj.autoItemNo = this.settingObj.iGroup.filter(item => item.settingCode == "S016")[0];

  }
  getLFieldValue() {
    this.newObj.isLinkedFinancial = this.settingObj.lGroup.filter(item => item.settingCode == "S001")[0];
    this.newObj.isLinkedHR = this.settingObj.lGroup.filter(item => item.settingCode == "S002")[0];
    this.newObj.isLinkedFAM = this.settingObj.lGroup.filter(item => item.settingCode == "S003")[0];
    this.newObj.isLinkedPurchase = this.settingObj.lGroup.filter(item => item.settingCode == "S004")[0];

    this.newObj.currYear = this.settingObj.lGroup.filter(item => item.settingCode == "S005")[0];
    this.newObj.currYear.fieldValue = this.newObj.currYear.fieldValue == null ? '' : this.newObj.currYear.fieldValue;

    this.newObj.fromDate = this.settingObj.lGroup.filter(item => item.settingCode == "S006")[0];
    this.newObj.fromDate.fieldValue = this.newObj.fromDate.fieldValue == null ? '' : this.newObj.fromDate.fieldValue;

    this.newObj.toDate = this.settingObj.lGroup.filter(item => item.settingCode == "S007")[0];
    this.newObj.toDate.fieldValue = this.newObj.toDate.fieldValue == null ? '' : this.newObj.toDate.fieldValue;

    this.newObj.currPeriod = this.settingObj.lGroup.filter(item => item.settingCode == "S008")[0];
    this.newObj.currPeriod.fieldValue = this.newObj.currPeriod.fieldValue == null ? '' : this.newObj.currPeriod.fieldValue;
  }
  //for switch controls to become number instead of (true/false)
  castingToInt() {

    this.newObj.isLinkedFinancial.fieldValue = +this.newObj.isLinkedFinancial.fieldValue;
    this.newObj.isLinkedHR.fieldValue = +this.newObj.isLinkedHR.fieldValue;
    this.newObj.isLinkedFAM.fieldValue = +this.newObj.isLinkedFAM.fieldValue;
    this.newObj.isLinkedPurchase.fieldValue = +this.newObj.isLinkedPurchase.fieldValue;
    this.newObj.autoGroupNo.fieldValue = +this.newObj.autoGroupNo.fieldValue;
    this.newObj.autoItemNo.fieldValue = +this.newObj.autoItemNo.fieldValue;
    this.newObj.autoStoreNo.fieldValue = +this.newObj.autoStoreNo.fieldValue;
    this.newObj.allowReturn.fieldValue = +this.newObj.allowReturn.fieldValue;
    this.newObj.reserveApproved.fieldValue = +this.newObj.reserveApproved.fieldValue;
    this.newObj.reserveLicense.fieldValue = +this.newObj.reserveLicense.fieldValue;
    this.newObj.tempReceipt.fieldValue = +this.newObj.tempReceipt.fieldValue;
    this.newObj.returnStore.fieldValue = +this.newObj.returnStore.fieldValue;
    this.newObj.returnZeroPrice.fieldValue = +this.newObj.returnZeroPrice.fieldValue;
    this.newObj.warnMSG.fieldValue = +this.newObj.warnMSG.fieldValue;
    this.newObj.PrintQR.fieldValue = +this.newObj.PrintQR.fieldValue;
    this.newObj.taxRefund.fieldValue = +this.newObj.taxRefund.fieldValue;
    if (this.newObj.managerID.fieldValue != null) {
      this.managerIDs = [parseInt(this.newObj.managerID.fieldValue)];
     // this.loadJobTitle(this.managerIDs[0], 'manager');
    } else
      this.onClearLookup('manager');
    if (this.newObj.controlID.fieldValue != null) {
      this.controlIDs = [parseInt(this.newObj.controlID.fieldValue)];
    //  this.loadJobTitle(this.controlIDs[0], 'control');
    } else
      this.onClearLookup('control');

  }

  saveSettings() {
    // when many controls has changed - handle as bulk
    if (this.formEl.validate() && this.updatedSettings.length > 1) {

      this.jasonData = JSON.stringify(this.updatedSettings);
    //  this.updateSettingsBulk(this.jasonData);

    }
    // when only one control has changed
    else if (this.formEl.validate() && this.updatedSettings.length == 1 || this.groupLevelData.filter(item => item.h_DT_ACTION != null).length > 0) {
    //  if (this.updatedSettings.length == 1)
     //   this.updateSettings(this.updatedSettings[0].settingCode, this.updatedSettings[0].fieldValue, this.updatedSettings[0].rowStamp);
     // else if (this.groupLevelData.filter(item => item.h_DT_ACTION != null))
        this.updateGroupLevelSettings();
    }

    this.appToolBar.disableSaveAndCancel = true;
    this.appToolBar.disableEdit = false;
    this.pageMode = PageMode.inquiryMode;
    this.appToolBar.loaded(true);
  }

  // if updating one control
  updateSettings(/*settingCode: any, fieldValue: any, rowStamp: any*/) {
   /* let settingObj: any = { organizationID: this.orgUnitID, settingCode: settingCode, fieldValue: fieldValue, rowStamp: rowStamp };
    let paramsObj: any = {
      Settings: settingObj,
      SettingsGroupLevel: this.groupLevelData
    };
   /* this.ptmService.UpdateSettings(paramsObj).subscribe((data: any) => {

      if (data.affectedRows > 0) {
        this.pageMode = PageMode.inquiryMode;
        this.appToolBar.saved();
        this.appAlert.showSuccess('SHD_DATA_SAVED_SUCCESSFULY');
        this.loadSettings();
      } else
        this.appAlert.showError('SHD_DATA_NOT_SAVED');
    });*/
  }

  // updating setting Bulk
  updateSettingsBulk(/*JsonData*/) {
  //  let bulkObj: any = { JsonData: JsonData, organizationID: this.orgUnitID };
    /*let paramsObj: any = {
      Settings: bulkObj,
      SettingsGroupLevel: this.groupLevelData
    };*/

   /* this.ptmService.UpdateSettingsBulk(paramsObj).subscribe((data: any) => {

      if (data.affectedRows > 0) {
        this.pageMode = PageMode.inquiryMode;
        this.appToolBar.saved();
        this.appAlert.showSuccess('SHD_DATA_SAVED_SUCCESSFULY');
        this.loadSettings();
      }
      else
        this.appAlert.showError('SHD_DATA_NOT_SAVED');
    });*/
  }

  // when edit groupLevel DT ONLY without updating any settings
  updateGroupLevelSettings() {

 /*   this.ptmService.UpdateSettingsGroupLevel(this.groupLevelDataOnly).subscribe((data: any) => {

      if (data.affectedRows > 0) {
        this.pageMode = PageMode.inquiryMode;
        this.appToolBar.saved();
        this.appAlert.showSuccess('SHD_DATA_SAVED_SUCCESSFULY');
        this.loadSettings();
      }
      else
        this.appAlert.showError('SHD_DATA_NOT_SAVED');
    });*/
  }
  // onChanged event
  settingChanged(event, eventTab3?) {
    this.appAlert.hide();
    if (event.settingCode == "S053" && event.fieldValue < 6) {
      this.appAlert.showError('PTM_SERIAL_ITEM_LESS');
    }

    if (event.settingCode == "S013")
      this.calculateItemNoDigits();
    else if (event.settingCode == "S009") {
      this.enableDTAdd = true;
      this.enableDTDelete = true;
    }
    var i: number = 0;
    //check if the changed setting has modified previously
    for (i = 0; i < this.counter; i++) {
      if (this.updatedSettings[i].settingCode == event.settingCode) {
        if ((event.settingCode == 'S014' && event.fieldValue == '*') || (event.settingCode == 'S010' && event.fieldValue == '*'))
          this.updatedSettings[i] = { settingCode: event.settingCode, fieldValue: null, rowStamp: event.rowStamp };
        else {
          this.updatedSettings[i] = { settingCode: event.settingCode, fieldValue: event.fieldType == 'Switch' ? +(event.fieldValue) : event.fieldValue, rowStamp: event.rowStamp };
        }
        return;
      }

    }
    if (event.fieldType) {
      if (event.fieldType == "Switch") {
        if (event.settingCode == 'S001') {// isFininialLinked
          if (event.fieldValue) {// if isLinked ture
            this.LoadFiscalYear();
            if (this.isGovernment && this.docSerial.length == 4) {
              this.docSerial.push({ id: 'F', nameEn: 'Fiscal Year', nameAr: 'السنة المالية' });
              this.docSerial = Object.assign([], this.docSerial);// to display the new list in screen
            } else if (this.isGovernment && this.docSerial.length == 5) {
              this.docSerial.pop();
              this.docSerial = Object.assign([], this.docSerial);
            }
          }
          else {
            //if isLinked switched to false --> let fieldvalue be null
            this.updatedSettings[this.counter] = { settingCode: 'S005', fieldValue: null, rowStamp: this.newObj.currYear.rowStamp };
            this.updatedSettings[++this.counter] = { settingCode: 'S006', fieldValue: null, rowStamp: this.newObj.fromDate.rowStamp };
            this.updatedSettings[++this.counter] = { settingCode: 'S007', fieldValue: null, rowStamp: this.newObj.toDate.rowStamp };
            this.updatedSettings[++this.counter] = { settingCode: 'S008', fieldValue: null, rowStamp: this.newObj.currPeriod.rowStamp };
            if (this.isGovernment && this.docSerial.length == 5) {
              this.docSerial.pop();
              this.docSerial = Object.assign([], this.docSerial);
              //if isLinkedSwitch OFF, and the radio button value was fiscal Year, change to the default value -S-
              if (this.newObj.SerialDocs.fieldValue == 'F') {
                this.newObj.SerialDocs.fieldValue = 'S';
                this.updatedSettings[++this.counter] = { settingCode: 'S052', fieldValue: 'S', rowStamp: this.newObj.SerialDocs.rowStamp };
              }
            }
            this.counter++;
          }
        }
        var str = +(event.fieldValue);// to get the number instead of (true/false)
        this.updatedSettings[this.counter] = { settingCode: event.settingCode, fieldValue: str, rowStamp: event.rowStamp };
      }
      else {// not a switch control

        if (eventTab3) {
          if (!this.updatedSettings.filter(item => item.settingCode == 'S015')) {
            this.updatedSettings[this.counter] = { settingCode: eventTab3.settingCode, fieldValue: this.additionResult, rowStamp: eventTab3.rowStamp };
            this.counter += 1;
          }
        }
        if ((event.settingCode == 'S014' && event.fieldValue == '*') || (event.settingCode == 'S010' && event.fieldValue == '*'))
          this.updatedSettings[this.counter] = { settingCode: event.settingCode, fieldValue: null, rowStamp: event.rowStamp };
        else
          this.updatedSettings[this.counter] = { settingCode: event.settingCode, fieldValue: event.fieldValue, rowStamp: event.rowStamp };
      }
      this.counter += 1;
    }
  }

  // onChanged event for RadioButtonList Controls - mandatory to take the choosen value
  rblSettingsChanged(event, selectedValue) {

    selectedValue.fieldValue = event.item.id;

    this.settingChanged(selectedValue);

    if (selectedValue.settingCode == "S012" && selectedValue.fieldValue == "1") { // الجزء الثابت في رقم الصنف = رقم المجموعة
      this.newObj.seperatorBet.fieldValue = this.newObj.seperatorGroup.fieldValue;
      this.newObj.autoItemNo.fieldValue = true;
      this.settingChanged(this.newObj.seperatorBet);
      this.settingChanged(this.newObj.autoItemNo);
    }
  }

  cblChanged(event, selected) {

    if (event) {
      this.settingChanged(selected);
    }
  }


  onEmployeeSelects(event, type) {

    if (event.selectedItems.length > 0) {
      this.managerErrorMsg = '';
      this.controlErrorMsg = '';
      if (this.validateEmployee(/*event.selectedIDs[0], type*/)) {
        this.appAlert.hide();
        if (type == 'manager') {
          this.newObj.managerJobAR = event.selectedItems[0].jobTitleAR;
          this.newObj.managerJobEN = event.selectedItems[0].jobTitleEN;

          this.newObj.managerID.fieldValue = event.selectedIDs[0].toString();
          this.managerIDs = event.selectedIDs;
          this.settingChanged(this.newObj.managerID);

        }
        else if (type == 'control') {
          this.newObj.controlJobAR = event.selectedItems[0].jobTitleAR;
          this.newObj.controlJobEN = event.selectedItems[0].jobTitleEN;

          this.newObj.controlID.fieldValue = event.selectedIDs[0].toString();
          this.controlIDs = event.selectedIDs;
          this.settingChanged(this.newObj.controlID);
        }
      }
    }
    else {
      this.onClearLookup(type, 'select');
    }
  }

  validateEmployee(/*empID, lookupType*/): boolean {
    let validity = true;
 /*   this.ptmService.loadValidateEmployeeRules(empID, 2).subscribe(data => {
      if (data) {// isValid true if emp service ended
        this.appAlert.showError('PTM_EMP_OUT_SERVICE');
        this.onClearLookup(lookupType);
        validity = false;
      }
    });*/
    return validity;
  }
  onClearLookup(lookupType, sender?) {
    switch (lookupType) {
      case 'manager':
        this.managerIDs = [];
        this.newObj.managerID.fieldValue = null;
        this.newObj.managerJobAR = this.newObj.managerJobEN = null;
        if (sender == 'select')
          this.managerErrorMsg = 'PTM_NO_EMP_NUMBER';
        this.settingChanged(this.newObj.managerID);
        break;
      case 'control':
        this.controlIDs = [];
        this.newObj.controlID.fieldValue = null;
        this.newObj.controlJobAR = this.newObj.controlJobEN = null;
        if (sender == 'select')
          this.controlErrorMsg = 'PTM_NO_EMP_NUMBER';
        this.settingChanged(this.newObj.controlID);

        break;
    }
  }
  onEditClick(event) {
    if (event && event.row) {

      this.editDisable = {
        nameAR: true,
        nameEN: true,
      }
    }
  }

  // to calculate the value of "Number of digits of the item no." when USER choose "Group Number" for "Stator in Item No." setting
  calculateItemNoDigits() {
    this.additionResult = (+this.newObj.serialDigits.fieldValue) + this.totalNoDigits;
    if (this.pageMode != 0 && this.newObj.statorItemNo.fieldValue == '1') {
      this.newObj.digits.fieldValue = this.additionResult;

      this.settingChanged(this.newObj.digits);
    }
  }

  onSaveAddRow() {

    this.groupLevelDT.commitRow(true);

  }

  onSaveEditRow(DTtype, event?) {

    switch (DTtype) {
      case 'groupLevel':
        this.groupLevelDT.commitRow(true);
        break;
      case 'numberOfLine':
        this.numberOfLineDT.commitRow(true);
        let paramsObj: any = { settingCode: event.rowNewData.settingCode, fieldValue: event.rowNewData.fieldValue, rowStamp: event.rowNewData.rowStamp, fieldType: 'Number' };
        this.settingChanged(paramsObj);
        break;
    }

  }
  onDeleteRow() {

    this.groupLevelDT.commitRow(true);

  }
  checkSpinner() {

    if (this.newObj.digits.fieldValue > 30 && this.newObj.statorItemNo.fieldValue == '0')
      return true;
    if (this.newObj.statorItemNo.fieldValue == '1' && this.additionResult > 30)
      return true;
    else
      return false;
  }
  loadJobTitle(/*,empID type*/) {
  //  let paramObj = { employeeID: empID, NumberID: '' };
 /*   this.ptmService.loadEmployee(paramObj).subscribe(results => {
      if (results) {
        switch (type) {
          case 'manager':
            this.newObj.managerJobAR = results[0].jobTitleAR;
            this.newObj.managerJobEN = results[0].jobTitleEN;
            break;
          case 'control':
            this.newObj.controlJobAR = results[0].jobTitleAR;
            this.newObj.controlJobEN = results[0].jobTitleEN;
            break;
        }
      }
    },
      error => { this.appAlert.showError(error) }
    );*/
  }

  LoadFiscalYear() {
  /*  this.ptmService.LoadFiscalYear(null, this.orgUnitID, 'YO').subscribe(data => {
      if (data && data[0]) {

      //  this.LoadFiscalYearPeriod(data[0].fiscalYearID);
        this.newObj.currYear.fieldValue = data[0].yearName;
        this.newObj.fromDate.fieldValue = data[0].startDate;
        this.newObj.toDate.fieldValue = data[0].endDate;
        this.updatedSettings[this.counter] = { settingCode: 'S005', fieldValue: this.newObj.currYear.fieldValue, rowStamp: this.newObj.currYear.rowStamp };
        this.updatedSettings[++this.counter] = { settingCode: 'S006', fieldValue: this.newObj.fromDate.fieldValue, rowStamp: this.newObj.fromDate.rowStamp };
        this.updatedSettings[++this.counter] = { settingCode: 'S007', fieldValue: this.newObj.toDate.fieldValue, rowStamp: this.newObj.toDate.rowStamp };
      } else {
        this.updatedSettings[--this.counter] = { settingCode: 'S001', fieldValue: 0, rowStamp: this.newObj.isLinkedFinancial.rowStamp };
        this.newObj.isLinkedFinancial.fieldValue = false;
        this.appAlert.showError('PTM_FINANCIAL_YEAR_NOT_DEFINED');
      }

    });*/}
  LoadFiscalYearPeriod(/*fiscalYearID*/) {
  /*  this.ptmService.LoadFiscalYearPeriod(null, fiscalYearID, 'PO').subscribe(data => {
      if (data && data[0]) {
        this.newObj.currPeriod.fieldValue = this.t.isAr ? data[0].periodNameAR : data[0].periodNameEN;
        this.updatedSettings[++this.counter] = { settingCode: 'S008', fieldValue: this.newObj.currPeriod.fieldValue, rowStamp: this.newObj.currPeriod.rowStamp };

      }
    });*/
  }
}
