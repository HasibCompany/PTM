import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent as Base } from "@hasib/core/base";
import { PageType } from '@hasib/core/utils';
import { DataTableColumn, DataTableUI } from '@hasib/ui';
import { Global } from "../../../core/services";
import { PtmService } from '../ptm.service';
@Component({
  selector: 'purchasingCyclesSettings',
  templateUrl: './purchasingCyclesSettings.component.html',
  styleUrls: ['./purchasingCyclesSettings.component.scss']
})
export class PurchasingCyclesSettingsComponent extends Base implements OnInit {
  @ViewChild('purchasingCyclesDT', { static: true }) purchasingCyclesDT: DataTableUI;
  t = Base.t;
  purchaseRepresentativeDlg: boolean = true;
  allowedUserDlg: boolean = true;
  allowedUsersObj: any = {
    permitFor: '',
    fromAmount: '', toAmount: '', fromDate: '', toDate: '', allowedUsers: [], userGroupID: '', userGroupIDs: []
  };


  allowedRepresentativesData: any = [];
  purchaseCycle: boolean = true;
  tenderCycle: boolean = true;
  purchasingCyclesData: any;
  isGovernment: boolean = this.global.getIsGovernmentPackageType();

  //todo create an array namrd itemTypes of object each object contains :nameAr,nameEN,id
  //todo replace each nameAr in itemTypes with the correct translation

  itemTypes: any[] = [
    { 'nameAr': 'صنف معرف', 'nameEn': 'Defined item', 'id': 'buyKnownItem', isChecked: false },
    { 'nameAr': 'صنف غير معرف', 'nameEn': 'Undefined item', 'id': 'buyUnkownItem', isChecked: false },
    { 'nameAr': 'خدمة', 'nameEn': 'Service', 'id': 'buyService', isChecked: false },
  ];

  //todo create an array named purchaseType of object each object contains :nameAr,nameEN,id
  purchaseType: any[] = [
    { nameAr: 'منافسة', nameEm: 'Tender', id: 0 },
    { nameAr: 'شراء مباشر', nameEm: 'Direct Purchase', id: 1 },
  ];
  //todo create an array named contractMethod of object each object contains :nameAr,nameEN,id
  /* قائمة منسدلة تحتوي على الخيارات التالية:
  - منافسة عامة                                    (Public tender)
  - منافسة محدودة                               (Limited tender)
  - منافسة علي مرحلتين            (Tender for two offers)
  - شراء مباشر                                   (Direct purchase)
  - اتفاقية اطارية                     (Framework agreements)
  - مزايدة عكسية الكترونية                               (Auction)
  - توطين الصناعة ونقص المعرفة (Localization of industry)
  - المسابقة                                           (Competition)
  - اخرى (القيمة الافتراضية)                                (Other)*/
  contractMethod: any[] =
    [
      { nameAr: 'منافسة عامة', nameEm: 'Public tender', id: 'CCM01' },
      { nameAr: 'منافسة محدودة', nameEm: 'Limited tender', id: 'CCM02' },
      { nameAr: 'منافسة علي مرحلتين', nameEm: 'Tender for two offers', id: 'CCM03' },
      { nameAr: 'شراء مباشر', nameEm: 'Direct purchase', id: 'CCM04' },
      { nameAr: 'اتفاقية اطارية', nameEm: 'Framework agreements', id: 'CCM05' },
      { nameAr: 'مزايدة عكسية الكترونية', nameEm: 'Auction', id: 'CCM06' },
      { nameAr: 'توطين الصناعة ونقص المعرفة', nameEm: 'Localization of industry', id: 'CCM07' },
      { nameAr: 'المسابقة', nameEm: 'Competition', id: 'CCM08' },
      { nameAr: 'اخرى', nameEm: 'Other', id: 'CCM09' },
    ];


  columns: DataTableColumn[] = [
    { field: 'code', header: 'PTM_PURCHASE_CYCLE_DESC_AR', controlType: 'textBox', required: true },
    { field: 'descriptionEN', fieldAr: 'descriptionAR', header: 'PTM_PURCHASE_CYCLE_DESC_EN', controlType: 'textBox', required: true },
    {
      field: 'contractMethod', header: 'PTM_CONTRACT_STYLE', controlType: 'dropDownList', defaultValue: 'CCM09',
      //todo set control data source to contractMethod
      controlDataSource: this.contractMethod, dataTextFieldAr: 'nameAr', dataTextFieldEn: 'nameEm', dataValueField: 'id'
      , renderText: (event) => {
        if (event.data === 'CCM01')
          return this.t.isAr ? 'منافسة عامة' : 'Public tender';
        else if (event.data === 'CCM02')
          return this.t.isAr ? 'منافسة محدودة' : 'Limited tender';
        else if (event.data === 'CCM03')
          return this.t.isAr ? 'منافسة علي مرحلتين' : 'Tender for two offers';
        else if (event.data === 'CCM04')
          return this.t.isAr ? 'شراء مباشر' : 'Direct purchase';
        else if (event.data === 'CCM05')
          return this.t.isAr ? 'اتفاقية اطارية' : 'Framework agreements';
        else if (event.data === 'CCM06')
          return this.t.isAr ? 'مزايدة عكسية الكترونية' : 'Auction';
        else if (event.data === 'CCM07')
          return this.t.isAr ? 'توطين الصناعة ونقص المعرفة' : 'Localization of industry';
        else if (event.data === 'CCM08')
          return this.t.isAr ? 'المسابقة' : 'Competition';
        else if (event.data === 'CCM09')
          return this.t.isAr ? 'اخرى' : 'Other';
        else
          return '';

      }, required: true
    },
    {
      field: 'purchaseOrTender', header: 'PTM_PURCHASE_TYPE', controlType: 'radioButtonList', defaultValue: 1,
      //todo set control data source to purchaseType
      controlDataSource: this.purchaseType, dataTextFieldAr: 'nameAr', dataTextFieldEn: 'nameEm', dataValueField: 'id'
      , renderText: (event) => {
        if (event.data === 0)
          return this.t.isAr ? 'منافسة' : 'Tender';
        else if (event.data === 1)
          return this.t.isAr ? 'شراء مباشر' : 'Direct Purchase';
        else
          return '';
      }, required: true

    },
    {
      field: 'minAmount', header: 'PTM_FROM', controlType: 'textBox', colSpan: 2,
      isColSpan: true, isColSpanStart: true, compositeHeader: 'PTM_PURCHASE_AMOUNT', required: true
    },
    { field: 'maxAmount', header: 'SHD_TO', controlType: 'textBox', isColSpan: true, required: true },
    {
      field: 'nameEn', header: 'PTM_TYPES_ITEMS_AVAILABLE_PURCHASE', controlType: 'multiSelect'
      , fieldAr: 'nameAr',
      //todo set control data source to itemTypes
      controlDataSource: this.itemTypes, dataTextFieldAr: 'nameAr', dataTextFieldEn: 'nameEn', dataValueField: 'id'
      , renderText: (event) => {
        event.data = !event.data ? [] : event.data
        return this.returnSelectedItemsType(event.data);
      }, required: true
    },
    {
      field: 'enableWorkflow', header: 'PTM_ACTIVATE_WORKFLOW', controlType: 'switch', defaultValue: 1,
      offText: 'SHD_NO', onText: 'SHD_YES',
      renderText: (event) => {
        if (event.data === 0)
          return this.t.instant('SHD_NO');
        else if (event.data === 1)
          return this.t.instant('SHD_YES');
        else
          return '';
      }
    },
    {
      field: '', header: 'PTM_PURCHASING_CYCLES',
      viewAs: 'command',
      commandText: '[...]',
      onClick: (event) => {
        event;
        this.purchaseCycle = false
      }
    },

    {
      defaultValue: 1,
      controlType: 'checkBox', colSpan: 2,
      isColSpan: true, isColSpanStart: true, compositeHeader: 'PTM_ALLOWED_USERS_HANDLE_PURCHASE_CYCLE',
      field: 'allowAllUsers', header: 'SHD_ALL', required: true,
      renderText: (event) => {
        if (event.data === 0)
          return this.t.instant('SHD_NO');
        else if (event.data === 1)
          return this.t.instant('SHD_YES');
        else
          return '';
      }
    },
    {
      isColSpan: true,
      commandText: '[...]', header: 'PTM_SELECT_USERS',
      viewAs: 'command',
      onClick: (event) => {
        event;
        this.allowedUserDlg = false

      },
    },
    {
      defaultValue: 1,
      controlType: 'checkBox', colSpan: 2,
      isColSpan: true, isColSpanStart: true, compositeHeader: 'PTM_PURCHASING_REPRESENTATAIVE_ALLOWED_HANDLE_PURCHASING_CYCLE',
      field: 'allowAllPurchasers', header: 'SHD_ALL', required: true,
      renderText: (event) => {
        if (event.data === 0)
          return this.t.instant('SHD_NO');
        else if (event.data === 1)
          return this.t.instant('SHD_YES');
        else
          return '';
      },

    },
    {
      header: 'PTM_SELECT_REPRESENTATIVES',
      viewAs: 'command',
      commandText: '[...]',
      onClick: (event) => {
        event;
        this.purchaseRepresentativeDlg = false
      }
    },
    {
      field: 'doCostEstimate', header: 'PTM_DETERMINE_ESTIMATED_COST', controlType: 'switch', defaultValue: 1,

      offText: 'SHD_NO', onText: 'SHD_YES',
      renderText: (event) => {
        if (event.data === 0)
          return this.t.instant('SHD_NO');
        else if (event.data === 1)
          return this.t.instant('SHD_YES');
        else
          return '';
      }
    },
    {
      field: 'isDefault', header: 'SHD_DEFAULT', controlType: 'switch', defaultValue: 0,
      offText: 'SHD_NO', onText: 'SHD_YES',
      renderText: (event) => {
        if (event.data === 0)
          return this.t.instant('SHD_NO');
        else if (event.data === 1)
          return this.t.instant('SHD_YES');
        else
          return '';
      }
    },
    {
      field: 'isActive', header: 'SHD_IS_ACTIVE', controlType: 'switch', defaultValue: 1,
      renderText: (event) => {
        if (event.data === 0)
          return this.t.instant('SHD_NO');
        else if (event.data === 1)
          return this.t.instant('SHD_YES');
        else
          return '';
      }
    }
  ];


  usersColumns: DataTableColumn[] = [
    { field: 'userID', header: 'SHD_USER', controlType: 'lookup', lookupType: 'User' },
    { field: 'code', header: 'PTM_USERNAME', controlType: 'textBox' },
    { field: 'code', header: 'SHD_M_UNIT', controlType: 'textBox' },
    {
      field: 'fromAmount', header: 'PTM_FROM', controlType: 'textBox', colSpan: 2,
      isColSpan: true, isColSpanStart: true, compositeHeader: 'SHD_AMOUNT'
    },
    {
      field: 'toAmount', header: 'SHD_TO', controlType: 'textBox', isColSpan: true
    },

    {
      field: 'fromDate', header: 'PTM_FROM', controlType: 'calendar', colSpan: 2,
      isColSpan: true, isColSpanStart: true, compositeHeader: 'PTM_VALIDITY_PERIOD'
    },
    {
      field: 'toDate', header: 'SHD_TO', controlType: 'calendar', isColSpan: true
    },


  ]

  purchaseColumns: DataTableColumn[] = [
    { field: 'purchaserID', header: 'SHD_EMPLOYEE_NUMBER', controlType: 'lookup', lookupType: 'Employee' },
    { field: 'code', header: 'PTM_EMPLOYEE_NAME', controlType: 'textBox' },
    {
      field: 'fromAmount', header: 'PTM_FROM', controlType: 'textBox', colSpan: 2,
      isColSpan: true, isColSpanStart: true, compositeHeader: 'SHD_AMOUNT'
    },
    {
      field: 'toAmount', header: 'SHD_TO', controlType: 'textBox', isColSpan: true
    },

    {
      field: 'fromDate', header: 'PTM_FROM', controlType: 'calendar', colSpan: 2,
      isColSpan: true, isColSpanStart: true, compositeHeader: 'PTM_VALIDITY_PERIOD'
    },
    {
      field: 'toDate', header: 'SHD_TO', controlType: 'calendar', isColSpan: true
    },


  ]

  //#region constructor
  constructor(private ptmService: PtmService, public global: Global) {
    super();
    this.ptmService;
  }
  //#endregion
  ngOnInit() {
    this.setPageType(PageType.dataTablePage);
    this.appToolBar.show();
    this.purchasingCyclesData = []
    if (this.isGovernment) {
      this.columns[2].visible = true
    }
    else {
      this.columns[2].visible = false
    }

  }
  //todo create function calles returnSelectedItemsType that takes parameter flags array and returns nameAr or NameEn
  returnSelectedItemsType(flags: any[]) {
    let result: string = '';
    if (flags && flags.length > 0) {
      for (var i = 0; i < flags.length; i++) {
        if (this.itemTypes && this.itemTypes.length > 0) {
          let flagObj: any = this.itemTypes.filter(x => { return x.id == flags[i] })[0];
          if (flagObj) {
            if (this.t.isAr)
              result += flagObj.nameAr + ' '
            else
              result += flagObj.nameEn + ' '
          }
        }
      }
    }
    return result;
  }
  //todo creat function onsaveaddrow that takes parameter event and commit the row
  onSaveAddRow(event) {
    event;
    this.purchasingCyclesDT.commitRow(true);
  }
  //todo creat function onSaveEditRow that takes parameter event and commit the row
  onSaveEditRow(event) {
    event;
    this.purchasingCyclesDT.commitRow(true);
  }
  //todo creat function onSelectLookup that takes parameter event and set the selected item
  onSelectLookup(event) {
    event;
  }
  //todo creat function onClearLookup that takes parameter event and set the selected item
  onClearLookup() {

  }
}
