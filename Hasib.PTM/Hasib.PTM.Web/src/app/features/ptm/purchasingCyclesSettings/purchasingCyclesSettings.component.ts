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
  purchaseCycle: boolean = true;
  tenderCycle: boolean = true;
  purchasingCyclesData: any;
  columns: DataTableColumn[] = [
    { field: 'code', header: 'PTM_PURCHASE_CYCLE_DESC_AR', controlType: 'textBox' },
    { field: 'descriptionAR', header: 'PTM_PURCHASE_CYCLE_DESC_EN', controlType: 'textBox' },
    { field: 'typeFlag', header: 'PTM_CONTRACT_STYLE', controlType: 'dropDownList' },
    { field: 'typeFlag', header: 'PTM_PURCHASE_TYPE', controlType: 'radioButtonList' },
    {
      field: 'descriptionAR', header: 'PTM_FROM', controlType: 'textBox', colSpan: 2,
      isColSpan: true, isColSpanStart: true, compositeHeader: 'PTM_PURCHASE_AMOUNT'
    },
    { field: 'descriptionAR', header: 'SHD_TO', controlType: 'textBox', isColSpan: true },
    { field: 'descriptionAR', header: 'PTM_TYPES_ITEMS_AVAILABLE_PURCHASE', controlType: 'checkBoxList' },
    {
      field: 'isActive', header: 'PTM_ACTIVATE_WORKFLOW', controlType: 'switch',
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
      field: 'isDefault', header: 'PTM_PURCHASING_CYCLES',
      viewAs: 'command',
      commandText: '[...]',
      onClick: (event) => {
        event;
        this.purchaseCycle = false
      }
    },

    {
      field: '', header: 'PTM_ALLOWED_USERS_HANDLE_PURCHASE_CYCLE', commandText: '[...]',
      viewAs: 'command',
      onClick: (event) => {
        event;
        this.allowedUserDlg = false
      }
    },

    {
      field: 'isDefault', header: 'PTM_PURCHASING_REPRESENTATAIVE_ALLOWED_HANDLE_PURCHASING_CYCLE',
      viewAs: 'command',
      commandText: '[...]',
      onClick: (event) => {
        event;
        this.purchaseRepresentativeDlg = false
      }
    },

    {
      field: 'isActive', header: 'PTM_DETERMINE_ESTIMATED_COST', controlType: 'switch',
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
      field: 'isActive', header: 'SHD_DEFAULT', controlType: 'switch',
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
      field: 'isActive', header: 'SHD_IS_ACTIVE', controlType: 'switch',
      renderText: (event) => {
        if (event.data === false)
          return this.t.instant('SHD_NO');
        else if (event.data === true)
          return this.t.instant('SHD_YES');
        else
          return '';
      }
    }
  ];


  usersColumns: DataTableColumn[] = [
    { field: 'code', header: 'SHD_USER', controlType: 'lookup' },
    { field: 'code', header: 'PTM_USERNAME', controlType: 'textBox' },
    { field: 'code', header: 'SHD_M_UNIT', controlType: 'textBox' },
    {
      field: 'code', header: 'PTM_FROM', controlType: 'textBox', colSpan: 2,
      isColSpan: true, isColSpanStart: true, compositeHeader: 'SHD_AMOUNT'
    },
    {
      field: 'code', header: 'SHD_TO', controlType: 'textBox', isColSpan: true
    },

    {
      field: 'code', header: 'PTM_FROM', controlType: 'textBox', colSpan: 2,
      isColSpan: true, isColSpanStart: true, compositeHeader: 'PTM_VALIDITY_PERIOD'
    },
    {
      field: 'code', header: 'SHD_TO', controlType: 'textBox', isColSpan: true
    },


  ]

  purchaseColumns: DataTableColumn[] = [
    { field: 'code', header: 'SHD_EMPLOYEE_NUMBER', controlType: 'lookup' },
    { field: 'code', header: 'PTM_EMPLOYEE_NAME', controlType: 'textBox' },
    {
      field: 'code', header: 'PTM_FROM', controlType: 'textBox', colSpan: 2,
      isColSpan: true, isColSpanStart: true, compositeHeader: 'SHD_AMOUNT'
    },
    {
      field: 'code', header: 'SHD_TO', controlType: 'textBox', isColSpan: true
    },

    {
      field: 'code', header: 'PTM_FROM', controlType: 'textBox', colSpan: 2,
      isColSpan: true, isColSpanStart: true, compositeHeader: 'PTM_VALIDITY_PERIOD'
    },
    {
      field: 'code', header: 'SHD_TO', controlType: 'textBox', isColSpan: true
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
    this.purchasingCyclesData = [{ code: 1 }]
  }

}
