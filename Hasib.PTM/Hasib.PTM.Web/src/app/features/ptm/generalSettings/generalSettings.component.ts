import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent as Base } from "@hasib/core/base";
import { HasibDate, PageMode, PageType } from '@hasib/core/utils';
import { PtmService } from '../ptm.service';
import { FormUI } from '@hasib/ui';
import { DataTableColumn, DataTableUI } from '@hasib/ui';
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
  @ViewChild('transactionNumberingDT', { static: true }) transactionNumberingDT: DataTableUI;
  @ViewChild('numberOfLineDT', { static: false }) numberOfLineDT: DataTableUI;

  // #region Init Var. 
  t = Base.t;
  pageMode = PageMode.inquiryMode;
  orgUnitID = this.globalService.getCurrentLegalEntityInfo().orgUnitID;

  isGovernment: any = [];

  docSerial: any = [
    { id: 'O', nameEn: 'Organization', nameAr: 'المنشأة' },
    { id: 'B', nameEn: 'Branch', nameAr: 'الفرع' },
    { id: 'L', nameEn: 'Location', nameAr: 'الموقع' }
  ];

  isFGLActive: boolean = false;
  isFAMActive: boolean = false;
  isHRMActive: boolean = false;
  isPTMActive: boolean = false;
  date: string = HasibDate.getTodayGregorian();

  transactionsNumberingColums: DataTableColumn[] = [
    { field: '', header: '00000000', controlType: 'textBox', required: true },
    { field: '', header: 'PTM_SEPARATOR', controlType: 'dropDownList', required: true },
    { field: '', header: 'PTM_FIXED_PART', controlType: 'dropDownList', required: true },
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


    }

    this.appToolBar.onCancel = () => {
      if (this.pageMode == PageMode.editMode) {
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
      }
      else {
        this.appAlert.showError('SHD_JOURNAL_DEFAULT_ORG_VALIDATION');
      }
    }, error => { this.appAlert.showApiError(error) });

  }









}
