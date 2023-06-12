import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent as Base } from "@hasib/core/base";
import { HasibDate, PageMode, PageType } from '@hasib/core/utils';
import { PtmService } from '../ptm.service';
import { FormUI } from '@hasib/ui';
import { DataTableColumn, DataTableUI } from '@hasib/ui';
import { EventEmitterService, Global } from '@hasib/core/services';
import { takeUntil } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { SharedService } from '../../../shared';
//import { forkJoin } from 'rxjs';

@Component({
  selector: 'generalSettings',
  templateUrl: './generalSettings.component.html',
  styleUrls: ['./generalSettings.component.scss']
})
export class GeneralSettingsComponent extends Base implements OnInit {

  @ViewChild('formEl', { static: true }) formEl: FormUI;
  @ViewChild('numberOfLineDT', { static: false }) numberOfLineDT: DataTableUI;

  // #region Init Var. 
  t = Base.t;
  pageMode = PageMode.inquiryMode;
  organizationID = this.globalService.getCurrentLegalEntityInfo().orgUnitID;
  branchID = this.globalService.getCurrentBranchInfo().branchID;
  //  fiscalYearID = this.globalService.getSelectedFiscalYearInfo().fiscalYearID;
  isGovernment: any = [];
  updatedSettings: any[] = []; // array for settings bulk
  jasonData: any; //obj to send to DB (settingCode, fieldValue, rowStamp)

  //todo:create object named linkObj
  //إعدادات الربط مع الأنظمة
  linkObj = this.getEmptylinkObj();
  //todod create object named autoNumbering and has the following properties (autoPurchaseReqNo,lastPurchaseRequNo)
  //إعدادات الترقيم التلقائي
  autoNumbering = this.getEmptyAutoNumberingObj();
  //todo create object named transNumberingObj and has the following properties(seperator,fixedPart,transNumberingData)
  //إعدادات رقم معاملة الشراء
  numberingObj = this.getEmptyNumberingObj();
  //todod create object named changeReqSets and has the following properties (hIncreaseRate,hDiscountRate)
  //إعدادات طلبات التغيير
  changeReqSetsObj = this.getemptychangeReqSetsObj();
  //todo create object named purchaseReqSetsObj and has the following properties (specifyPurchaseCycle,periodToAlert,addDateFromExternal,specifyPurchaseResponsiblePerson)
  //إعدادات طلبات الشراء
  purchaseReqSetsObj = this.getEmptyPurchaseReqSetsObj();
  //todo create object named purchaseOrderSetsObj and has the following properties (purchaseRecDescSameToSubject,purchaseRecNoSameToPurchaseReq,purchaseRecCancellationMethod,DeterminePurchaseRecordNoInEtimad)
  //todo create object named financialSets and has the following properties (useProjectReservations,allowDealWithForeignCurrencies)
  //إعدادات مالية
  financialSetsObj = this.getEmptyFinancialSetsObj();
  //todo create object named serviceCodesSetsObj and has the following properties (countServiceLevels,autoServiceNo,serviceNoSeperato)
  //إعدادات رموز الخدمات
  serviceCodesSetsObj = this.getEmptyServiceCodesSets();
  //todo create object named otherSetsObj and has the following properties (dealingVendorsBlackList,noticeExpirationPeriod,vendorID,vendorIDs,stoppingPeriod)
  //إعدادات أخرى
  otherSetsObj = this.getEmptyOtherSetsObj();
  otherSetsDepartmentIDs: any = [];
  otherSetsVendorIDs: any = [];
  //todo create object named directPurchaseObj and has the following properties (autoWarning,allowedLateDuration,purchaseDestination,allowedtoMakePO,allowofIncrease,autoPONo,lastPONo,auotDPRecord,lastDPRecord,useStoreNo)
  //إعدادات الشراء المباشر
  directPurchaseObj = this.getEmptyDirectPurchaseObj();
  directPurchaseObjDepartmentIDs: any = [];
  directPurchaseObjUserIDs: any = [];
  directPurchaseObjGroupIDs: any = [];

  //todo create object named tendersObj and has the following properties (departmentIDs,primaryGarenteeRate,dealingMethodWithInitialGarentee,finalGaranteeRate,dealingMethodWithFinalGarentee,autoTenderNo,lastTenderNo,autoStopReceiveOfferNo,lastStopReceiveOfferNo,autoDecideCommitteeDocNo,lastDecideCommitteeDocNo)
  //إعدادات المناقصات
  tendersObj = this.getEmptyTendersObj();
  tendersObjDepartmentIDs: any = [];
  transSerial: any = [
    { id: 'O', nameEn: 'Organization', nameAr: 'المنشأة' },
    { id: 'B', nameEn: 'Branch', nameAr: 'الفرع' },
    { id: 'L', nameEn: 'Location', nameAr: 'الموقع' },
    { id: 'F', nameEn: 'Fiscal Year', nameAr: 'السنة المالية' }
  ];

  isFGLActive: boolean = false;
  isWIMActive: boolean = false;
  isHRMActive: boolean = false;
  isFPCActive: boolean = false;
  date: string = HasibDate.getTodayGregorian();

  numberingColums: DataTableColumn[] = [
    { field: 'number', header: '00000000', controlType: 'textBox', required: true },
    { field: 'seperator', header: 'PTM_SEPARATOR', controlType: 'textBox', required: true },
    { field: 'fixedPart', header: 'PTM_FIXED_PART', controlType: 'textBox', required: true },
  ];
  fiscalYearID: number | null;
  fiscalYearName: string | null;
  fiscalYearStatus: string | null;
  fiscalYearStatusData: any = [];
  changedData: any = [];
  settingsData: any = [];
  emptyYearFlag: boolean = true;
  constructor(public ptmService: PtmService, private globalService: Global, private _es: EventEmitterService, private sharedService: SharedService) {
    super();
    this.ptmService;
    this.isGovernment = this.globalService.getIsGovernmentPackageType();
  }

  ngOnInit(): void {
    this.setPageType(PageType.multipleRecordsPage);
    this.appToolBar.show();
    this.appToolBar.disableEdit = false;
    if (this.isGovernment) {
    }
    this._es.onLegalEntityChanged.pipe(takeUntil(this.componentDestroyed)).subscribe(() => {
      this.appAlert.hide();
      this.clear();
      if (this.globalService.getCurrentLegalEntityInfo() && this.globalService.getCurrentLegalEntityInfo().orgUnitID) {
        this.organizationID = this.globalService.getCurrentLegalEntityInfo().orgUnitID;
        this.loadSettings();
        this.loadLinkedSystems();
        this.pageMode = PageMode.inquiryMode;

      }
      else {
        this.appAlert.showError('SHD_JOURNAL_DEFAULT_ORG_VALIDATION');
      }
    }, error => { this.appAlert.showError(error) });

    this._es.onBranchChanged.pipe(takeUntil(this.componentDestroyed)).subscribe(() => {
      this.appAlert.hide();
      this.clear();
      if (this.globalService.getCurrentBranchInfo() && this.globalService.getCurrentBranchInfo().branchID) {
        this.branchID = this.globalService.getCurrentBranchInfo().branchID;
        this.loadSettings();
        this.loadLinkedSystems();
        this.pageMode = PageMode.inquiryMode;

      }
      else {
        this.appAlert.showError('SHD_JOURNAL_BRANCH_ORG_VALIDATION');
      }
    }, error => { this.appAlert.showError(error) });

    this._es.onFiscalYearChanged.pipe(takeUntil(this.componentDestroyed)).subscribe(() => {
      this.appAlert.hide();
      this.clear();
      if (this.globalService.getSelectedFiscalYearInfo() && this.globalService.getSelectedFiscalYearInfo().fiscalYearID) {
        this.fiscalYearID = this.globalService.getSelectedFiscalYearInfo()?.fiscalYearID ? this.globalService.getSelectedFiscalYearInfo()?.fiscalYearID : null;
        this.fiscalYearName = this.globalService.getSelectedFiscalYearInfo().yearName;
        this.loadSettings();
        this.getProductConstant();

      }

    }, error => { this.appAlert.showError(error) });




    this.appToolBar.onEdit = () => {
      this.changedData = [];
      this.pageMode = PageMode.editMode;
      this.appToolBar.disableSaveAndCancel = false;
      if (this.directPurchaseObj.numberingObj.fixedPart != null && this.directPurchaseObj.numberingObj.fixedPart[0] == '1')

        this.directPurchaseObj.numberingObj.disableText = false;
      else
        this.directPurchaseObj.numberingObj.disableText = true;
      if (this.tendersObj.numberingObj.fixedPart != null && this.tendersObj.numberingObj.fixedPart[0] == '1')

        this.tendersObj.numberingObj.disableText = false;
      else
        this.tendersObj.numberingObj.disableText = true;
    }

    this.appToolBar.onSave = () => {
      if (this.linkObj.linkedToFGL && (!this.fiscalYearID || this.fiscalYearID == null)) {
        this.appAlert.showError('PTM_FISCAL_YEAR_REQUIRED');
        return;
      }
      else
        if (this.validateLastNumberToBeGreater()) {
          if (this.formEl.validate())
            this.saveSettings();
        }
    }

    this.appToolBar.onCancel = () => {
      if (this.pageMode == PageMode.editMode) {
        this.pageMode = PageMode.inquiryMode;
        this.appToolBar.disableEdit = false;
        this.clear();
        this.loadSettings();
      }
    }

  }
  //todo create function named loadSettings that calls the following functions from service (LoadSettings)
  loadSettings() {
    let paramObj = {
      organizationID: this.organizationID,
      settingCode: '',
    };

    this.ptmService.LoadSettings(paramObj).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.settingsData = res;
        if (this.settingsData.filter(item => item.settingCode == "PT001")[0].fieldValue == null) {
          this.emptyYearFlag = true;

          this.linkObj.purchaseYearName = HasibDate.getTodayGregorian().substring(0, 4);
          this.linkObj.purchaseYearStartDate = HasibDate.getTodayGregorian().substring(0, 4) + '/' + '01' + '/' + '01'

          this.linkObj.purchaseYearEndDate = HasibDate.getTodayGregorian().substring(0, 4) + '/' + '12' + '/' + '31'
        }
        else {
          this.emptyYearFlag = false;
          this.linkObj.purchaseYearName = res.filter(item => item.settingCode == "PT001")[0].fieldValue;
          this.linkObj.purchaseYearStartDate = res.filter(item => item.settingCode == "PT002")[0].fieldValue;
          this.linkObj.purchaseYearEndDate = res.filter(item => item.settingCode == "PT003")[0].fieldValue;
        }
        //إعدادات الربط مع الأنظمة
        this.linkObj.linkedToFGL = res.filter(item => item.settingCode == "PT004")[0].fieldValue == "1" ? true : false;
        this.fiscalYearID = res.filter(item => item.settingCode == "PT005")[0].fieldValue;
        // this.fiscalYearName = res.filter(item => item.settingCode == "PT005")[0].fieldValue;temp
        this.linkObj.linkedToWIM = res.filter(item => item.settingCode == "PT006")[0].fieldValue == "1" ? true : false;
        this.linkObj.pecifyStoreInPurchasing = res.filter(item => item.settingCode == "PT007")[0].fieldValue == "1" ? true : false;
        this.linkObj.linkedToHRM = res.filter(item => item.settingCode == "PT008")[0].fieldValue == "1" ? true : false;
        this.linkObj.linkedToFPC = res.filter(item => item.settingCode == "PT009")[0].fieldValue == "1" ? true : false;

        //إعدادات الترقيم التلقائي
        this.autoNumbering.autoPurchaseReqNo = res.filter(item => item.settingCode == "PT010")[0].fieldValue == "1" ? true : false;//ترقيم تلقائى لطلب الشراء
        this.autoNumbering.lastPurchaseReqNo = res.filter(item => item.settingCode == "PT011")[0].fieldValue;//آخر رقم طلب شراء
        this.autoNumbering.tempLastPurchaseReqNo = res.filter(item => item.settingCode == "PT011")[0].fieldValue;//آخر رقم طلب شراء


        this.autoNumbering.autoChangeReqNo = res.filter(item => item.settingCode == "PT012")[0].fieldValue == "1" ? true : false;//ترقيم تلقائى لطلب التغيير
        this.autoNumbering.lastChangeReqNo = res.filter(item => item.settingCode == "PT013")[0].fieldValue;//آخر رقم طلب تغيير
        this.autoNumbering.tempLastChangeReqNo = res.filter(item => item.settingCode == "PT013")[0].fieldValue;//آخر رقم طلب تغيير

        this.autoNumbering.autoChangeOrderNo = res.filter(item => item.settingCode == "PT014")[0].fieldValue == "1" ? true : false;//ترقيم تلقائى لأمر التغيير
        this.autoNumbering.lastChangeOrderNo = res.filter(item => item.settingCode == "PT015")[0].fieldValue;//آخر رقم أمر تغيير
        this.autoNumbering.tempLastChangeOrderNo = res.filter(item => item.settingCode == "PT015")[0].fieldValue;//آخر رقم أمر تغيير

        this.autoNumbering.autoOfferRecordsOpeningNo = res.filter(item => item.settingCode == "PT016")[0].fieldValue == "1" ? true : false;//ترقيم تلقائى لفتح سجل العروض
        this.autoNumbering.lastOfferRecordsOpeningNo = res.filter(item => item.settingCode == "PT017")[0].fieldValue;//آخر رقم فتح سجل العروض
        this.autoNumbering.tempLastOfferRecordsOpeningNo = res.filter(item => item.settingCode == "PT017")[0].fieldValue;//آخر رقم فتح سجل العروض

        this.autoNumbering.autoOffersIncpectinsNo = res.filter(item => item.settingCode == "PT018")[0].fieldValue == "1" ? true : false;//ترقيم تلقائى لمحضر فحص العروض
        this.autoNumbering.lastOffersIncpectinsNo = res.filter(item => item.settingCode == "PT019")[0].fieldValue;//آخر رقم محضر فحص العروض
        this.autoNumbering.tempLastOffersIncpectinsNo = res.filter(item => item.settingCode == "PT019")[0].fieldValue;//آخر رقم محضر فحص العروض

        this.autoNumbering.autoTechnicalRecordsNo = res.filter(item => item.settingCode == "PT020")[0].fieldValue == "1" ? true : false;//ترقيم تلقائى للمحضر الفني
        this.autoNumbering.lastTechnicalRecordsNo = res.filter(item => item.settingCode == "PT021")[0].fieldValue;//آخر رقم المحضر الفني
        this.autoNumbering.tempLastTechnicalRecordsNo = res.filter(item => item.settingCode == "PT021")[0].fieldValue;//آخر رقم المحضر الفني
        this.autoNumbering.serialBy = res.filter(item => item.settingCode == "PT022")[0].fieldValue;//تسلسل تلقائي حسب
        //إعدادات ضوابط طلبات التغيير
        this.changeReqSetsObj.hIncreaseRate = res.filter(item => item.settingCode == "PT023")[0].fieldValue;//أعلى نسبة زيادة على قيمة التعميد/ الترسية
        this.changeReqSetsObj.hDiscountRate = res.filter(item => item.settingCode == "PT024")[0].fieldValue;//أعلى نسبة تخفيض على قيمة التعميد/ الترسية
        //أعدادت طلبات الشراء
        // this.purchaseReqSetsObj.specifyPurchaseCycle = res.filter(item => item.settingCode == "PT035")[0].fieldValue == "1"  ? true : false;
        this.purchaseReqSetsObj.periodToAlert = res.filter(item => item.settingCode == "PT025")[0].fieldValue;//المدة التي يلزم بعدها التنبيه عند التأخر في تنفيذ المرحلة الحالية للطلب
        this.purchaseReqSetsObj.addDateFromExternal = res.filter(item => item.settingCode == "PT026")[0].fieldValue == "1" ? true : false;//إضافة البيانات من ملف خارجي لطلب الشراء
        this.purchaseReqSetsObj.specifyPurchaseResponsiblePerson = res.filter(item => item.settingCode == "PT027")[0].fieldValue;//إضافة البيانات من ملف خارجي لطلب الشراء


        if (this.isGovernment) {
          //إعدادات مالية
          this.financialSetsObj.useProjectReservations = res.filter(item => item.settingCode == "PT028")[0].fieldValue == "1" ? true : false;//إستخدام إرتباط المشاريع
          this.financialSetsObj.allowDealWithForeignCurrencies = res.filter(item => item.settingCode == "PT029")[0].fieldValue == "1" ? true : false;//السماح بالتعامل مع العملات الأجنبية
          //todoDB
          //إعدادات أخرى
          this.otherSetsObj.supplier = res.filter(item => item.settingCode == "PT032")[0].fieldValue;//(المورد / الجهة الافتراضية) لطلبات الحجز ( قائمة )
          this.otherSetsObj.vendorID = this.otherSetsObj.supplier == 'V' ? res.filter(item => item.settingCode == "PT033")[0].fieldValue : null;//(المورد / الجهة الافتراضية) لطلبات الحجز
          this.otherSetsVendorIDs = this.otherSetsObj.supplier == 'V' ? [+(res.filter(item => item.settingCode == "PT033")[0].fieldValue)] : [];//(المورد / الجهة الافتراضية) لطلبات الحجز
          this.otherSetsDepartmentIDs = this.otherSetsObj.supplier == 'D' ? [+(res.filter(item => item.settingCode == "PT033")[0].fieldValue)] : [];//(المورد / الجهة الافتراضية) لطلبات الحجز
          this.otherSetsObj.departmentID = this.otherSetsObj.supplier == 'D' ? res.filter(item => item.settingCode == "PT033")[0].fieldValue : null;//(المورد / الجهة الافتراضية) لطلبات الحجز

          //أعدادت طلبات الشراء
          this.directPurchaseObj.determinePurchaseRecordNoInEtimad = res.filter(item => item.settingCode == "PT056")[0].fieldValue;//تحديد رقم معاملة الشراء في منصة اعتماد


          //إعدادات المنافسات
          this.tendersObj.autoDecideCommitteeDocNo = res.filter(item => item.settingCode == "PT072")[0].fieldValue == "1" ? true : false;//ترقيم تلقائي لمحضر اللجنة
          this.tendersObj.lastDecideCommitteeDocNo = res.filter(item => item.settingCode == "PT073")[0].fieldValue;//آخر رقم محضر اللجنة
          this.tendersObj.tempLastDecideCommitteeDocNo = res.filter(item => item.settingCode == "PT073")[0].fieldValue;//آخر رقم محضر اللجنة
        }
        //أعدادت أخرى
        this.otherSetsObj.dealingVendorsBlackList = res.filter(item => item.settingCode == "PT030")[0].fieldValue;
        this.otherSetsObj.noticeExpirationPeriod = res.filter(item => item.settingCode == "PT031")[0].fieldValue;

        this.otherSetsObj.stoppingPeriod = res.filter(item => item.settingCode == "PT034")[0].fieldValue;

        //إعدادات رموز الخدمات
        this.serviceCodesSetsObj.countServiceLevels = res.filter(item => item.settingCode == "PT035")[0].fieldValue;//عدد مستويات الخدمة
        this.serviceCodesSetsObj.autoServiceNo = res.filter(item => item.settingCode == "PT036")[0].fieldValue;//ترقيم الخدمات تلقائي
        this.serviceCodesSetsObj.serviceNoSeperator = res.filter(item => item.settingCode == "PT037")[0].fieldValue;//شكل الفاصل في رقم الخدمة

        //إعدادات الشراء المباشر
        this.directPurchaseObj.autoWarning = res.filter(item => item.settingCode == "PT038")[0].fieldValue;//تحذير تلقائي على التعاميد التي تأخر تسليمها من المستودعات
        this.directPurchaseObj.allowedLateDuration = res.filter(item => item.settingCode == "PT039")[0].fieldValue;//مدة التأخر المسموحة بالأيام
        this.directPurchaseObjDepartmentIDs = [+(res.filter(item => item.settingCode == "PT040")[0].fieldValue)];//الجهة الإدارية للمشتريات
        this.directPurchaseObj.departmentID = res.filter(item => item.settingCode == "PT040")[0].fieldValue;//الجهة الإدارية للمشتريات
        this.directPurchaseObj.allowedtoMakePO = res.filter(item => item.settingCode == "PT041")[0].fieldValue;//المسموح لهم عمل تعميد بدون حجز مبلغ
        this.directPurchaseObj.userID = this.directPurchaseObj.allowedtoMakePO == 'U' ? res.filter(item => item.settingCode == "PT042")[0].fieldValue : null;//المسموح لهم عمل تعميد بدون حجز مبلغ
        this.directPurchaseObjUserIDs = [+(res.filter(item => item.settingCode == "PT042")[0].fieldValue)];//المسموح لهم عمل تعميد بدون حجز مبلغ
        this.directPurchaseObj.groupID = res.filter(item => item.settingCode == "PT042")[0].fieldValue;//المسموح لهم عمل تعميد بدون حجز مبلغ
        this.directPurchaseObjGroupIDs = [+(res.filter(item => item.settingCode == "PT042")[0].fieldValue)];//المسموح لهم عمل تعميد بدون حجز مبلغ
        this.directPurchaseObj.allowofIncrease = res.filter(item => item.settingCode == "PT043")[0].fieldValue == '0' ? false : true;//السماح بزيادة الكمية المعتمدة في أمر الشرا

        this.directPurchaseObj.autoPurchaseTransNo = res.filter(item => item.settingCode == "PT044")[0].fieldValue == "1" ? true : false;//ترقيم تلقائى لمعاملة الشراء
        this.directPurchaseObj.lastPurchaseTransNo = res.filter(item => item.settingCode == "PT045")[0].fieldValue;//آخر رقم معاملة شراء
        this.directPurchaseObj.tempLastPurchaseTransNo = res.filter(item => item.settingCode == "PT045")[0].fieldValue;//

        this.directPurchaseObj.autoQuotationsReqNo = res.filter(item => item.settingCode == "PT046")[0].fieldValue == "1" ? true : false;//ترقيم تلقائى لطلبات عروض الاسعار
        this.directPurchaseObj.lastQuotationsReqNo = res.filter(item => item.settingCode == "PT047")[0].fieldValue;//آخر رقم طلب عرض اسعار
        this.directPurchaseObj.tempLastQuotationsReqNo = res.filter(item => item.settingCode == "PT047")[0].fieldValue;//آخر رقم طلب عرض اسعار

        this.directPurchaseObj.autoPONo = res.filter(item => item.settingCode == "PT048")[0].fieldValue == "1" ? true : false;//ترقيم تلقائى لأمر الشراء
        this.directPurchaseObj.lastPONo = res.filter(item => item.settingCode == "PT049")[0].fieldValue;//آخر رقم أمر شراء
        this.directPurchaseObj.tempLastPONo = res.filter(item => item.settingCode == "PT049")[0].fieldValue;//آخر رقم أمر شراء

        this.directPurchaseObj.auotDPRecordNO = res.filter(item => item.settingCode == "PT050")[0].fieldValue == "1" ? true : false;//تسلسل تلقائي لمحضر الشراء المباشر
        this.directPurchaseObj.lastDPRecordNo = res.filter(item => item.settingCode == "PT051")[0].fieldValue;//آخر رقم محضر شراء مباشر
        this.directPurchaseObj.tempLastDPRecordNo = res.filter(item => item.settingCode == "PT051")[0].fieldValue;//آخر رقم محضر شراء مباشر
        this.directPurchaseObj.purchaseRecDescSameToSubject = res.filter(item => item.settingCode == "PT053")[0].fieldValue == "1" ? true : false;//جعل وصف معاملة الشراء نفس موضوع طلب الشراء
        this.directPurchaseObj.purchaseRecNoSameToPurchaseReq = res.filter(item => item.settingCode == "PT054")[0].fieldValue == "1" ? true : false;//جعل رقم معاملة الشراء نفس رقم طلب الشراء
        this.directPurchaseObj.purchaseRecCancellationMethod = res.filter(item => item.settingCode == "PT055")[0].fieldValue;//طريقة التعامل مع إلغاء معاملة الشراء
        //إعدادات رقم معاملة الشراء
        this.directPurchaseObj.numberingObj.seperator = res.filter(item => item.settingCode == "PT058")[0].fieldValue;//الفاصل
        //
        let r = res.filter(item => item.settingCode == "PT059")[0].fieldValue == '1' ? '1' : '0';;//الجزء الثابت النص

        this.directPurchaseObj.numberingObj.text = res.filter(item => item.settingCode == "PT060")[0].fieldValue == null ? '' : res.filter(item => item.settingCode == "PT060")[0].fieldValue;//الجزء الثابت النص

        let r2 = res.filter(item => item.settingCode == "PT061")[0].fieldValue == '1' ? '1' : '0';;//الجزء الثابت السنة المالية

        let r1 = res.filter(item => item.settingCode == "PT062")[0].fieldValue == '1' ? '1' : '0';;//الجزء الثابت الموقع 

        this.directPurchaseObj.numberingObj.fixedPart = r + r1 + r2;
        this.directPurchaseObj.numberingObj.numberingData = [];
        if (this.t.isAr) {
          this.directPurchaseObj.numberingObj.fixedPartText = (r == '1' ? this.directPurchaseObj.numberingObj.text : '') + ' ' + (r1 == '1' ? 'الموقع' : '') + ' ' + (r2 == '1' ? 'السنة المالية' : '')

          this.directPurchaseObj.numberingObj.numberingData.push({
            number: '0000000',
            seperator: this.directPurchaseObj.numberingObj.seperator,
            fixedPart: this.directPurchaseObj.numberingObj.fixedPartText
          });
        }
        else {
          this.directPurchaseObj.numberingObj.fixedPartText = (r == '1' ? this.directPurchaseObj.numberingObj.text : '') + ' ' + (r1 == '1' ? 'Location' : '') + ' ' + (r2 == '1' ? 'Fiscal Year' : '')
          this.directPurchaseObj.numberingObj.numberingData.push({
            number: '0000000',
            seperator: this.directPurchaseObj.numberingObj.seperator,
            fixedPart: this.directPurchaseObj.numberingObj.fixedPartText
          });
        }
        //إعدادات المنافسات
        this.tendersObj.departmentID = res.filter(item => item.settingCode == "PT063")[0].fieldValue;//الجهة الإدارية للمنافسات
        this.tendersObjDepartmentIDs = [+(res.filter(item => item.settingCode == "PT063")[0].fieldValue)];
        this.tendersObj.primaryGuarenteeRate = res.filter(item => item.settingCode == "PT064")[0].fieldValue;//نسبة الضمان الابتدائي
        this.tendersObj.dealingMethodWithPrimaryGuarentee = res.filter(item => item.settingCode == "PT065")[0].fieldValue;//طريقة التعامل مع الضمان الابتدائي
        this.tendersObj.finalGuaranteeRate = res.filter(item => item.settingCode == "PT066")[0].fieldValue;//نسبة الضمان النهائي
        this.tendersObj.dealingMethodWithFinalGuarentee = res.filter(item => item.settingCode == "PT067")[0].fieldValue;//طريقة التعامل مع الضمان النهائي

        this.tendersObj.autoTenderLetterNo = res.filter(item => item.settingCode == "PT068")[0].fieldValue == "1" ? true : false;//ترقيم تلقائى لخطاب الترسية
        this.tendersObj.lastTenderLetterNo = res.filter(item => item.settingCode == "PT069")[0].fieldValue;//آخر رقم خطاب ترسية
        this.tendersObj.tempLastTenderLetterNo = res.filter(item => item.settingCode == "PT069")[0].fieldValue;//آخر رقم خطاب ترسية

        this.tendersObj.autoStopReceiveOfferNo = res.filter(item => item.settingCode == "PT070")[0].fieldValue == "1" ? true : false;//ترقيم تلقائى لمحضر إيقاف استقبال العروض
        this.tendersObj.lastStopReceiveOfferNo = res.filter(item => item.settingCode == "PT071")[0].fieldValue;//آخر رقم محضر إيقاف استقبال العروض
        this.tendersObj.tempLastStopReceiveOfferNo = res.filter(item => item.settingCode == "PT071")[0].fieldValue;//آخر رقم محضر إيقاف استقبال العروض

        this.tendersObj.determineTenderNoInEtimad = res.filter(item => item.settingCode == "PT076")[0].fieldValue;//تحديد رقم المنافسة في منصة اعتماد
        this.tendersObj.autoTenderNo = res.filter(item => item.settingCode == "PT077")[0].fieldValue == "1" ? true : false;//ترقيم تلقائي لأرقام المنافسات
        this.tendersObj.lastTenderNo = res.filter(item => item.settingCode == "PT078")[0].fieldValue;//آخر رقم منافسة
        this.tendersObj.tempLastTenderNo = res.filter(item => item.settingCode == "PT078")[0].fieldValue;//آخر رقم منافسة
        //إعدادات رقم المنافسة
        this.tendersObj.numberingObj.seperator = res.filter(item => item.settingCode == "PT080")[0].fieldValue;//الفاصل

        let t = res.filter(item => item.settingCode == "PT081")[0].fieldValue == '1' ? '1' : '0';;//الجزء الثابت النص
        this.tendersObj.numberingObj.text = res.filter(item => item.settingCode == "PT082")[0].fieldValue == null ? '' : res.filter(item => item.settingCode == "PT082")[0].fieldValue;

        let t2 = res.filter(item => item.settingCode == "PT083")[0].fieldValue == '1' ? '1' : '0';//الجزء الثابت السنة المالية
        let t1 = res.filter(item => item.settingCode == "PT084")[0].fieldValue == '1' ? '1' : '0';;//الجزء الثابت الموقع

        this.tendersObj.numberingObj.fixedPart = t + t1 + t2;
        this.tendersObj.numberingObj.numberingData = [];
        if (this.t.isAr) {
          this.tendersObj.numberingObj.fixedPartText = (t == '1' ? this.tendersObj.numberingObj.text : '') + ' ' + (t1 == '1' ? 'الموقع' : '') + ' ' + (t2 == '1' ? 'السنة المالية' : '');
          this.tendersObj.numberingObj.numberingData.push({
            number: '0000000',
            seperator: this.tendersObj.numberingObj.seperator,
            fixedPart: this.tendersObj.numberingObj.fixedPartText
          });
        }
        else {
          this.tendersObj.numberingObj.fixedPartText = (t == '1' ? this.tendersObj.numberingObj.text : '') + ' ' + (t1 == '1' ? 'Location' : '') + ' ' + (t2 == '1' ? 'Fiscal Year' : '');

          this.tendersObj.numberingObj.numberingData.push({
            number: '0000000',
            seperator: this.tendersObj.numberingObj.seperator,
            fixedPart: this.tendersObj.numberingObj.fixedPartText 
          });
        }
      }
    }, error => {
      this.appAlert.showError(error);
    });
  }
  loadLinkedSystems() {
    forkJoin([this.checkAppActivate('FGL'), this.checkAppActivate('WIM'), this.checkAppActivate('HRM'), this.checkAppActivate('FPC')]).subscribe(results => {
      if (results) {


        this.isFGLActive = results[0];
        this.isWIMActive = results[1];
        this.isHRMActive = results[2];
        this.isFPCActive = results[3];


      }
    },
      error => { this.appAlert.showError(error) });
  }
  checkAppActivate(appCode) {
    return this.ptmService.checkAppActivate(appCode);
  };
  getProductConstant() {
    // To Get list taken from "constantTypeID = 203"
    this.sharedService.getProductConstantInfo(this.globalService.getConnectionID(), 27).subscribe((data: any) => {
      this.fiscalYearStatusData = data;
      let status = this.fiscalYearStatusData.filter(x => x.constantCode == this.globalService.getSelectedFiscalYearInfo().statusFlag)[0]
      this.fiscalYearStatus = this.t.isAr ? status.nameAR : status.nameEN;
    }, (error: any) => {
      this.appAlert.showApiError(error);
    });
  }
  onLinkedChange(event, type) {
    this.appAlert.hide();

    switch (type) {
      case 'FGL':
        this.controllerChanged(event, 'PT004', 'swt');
        if (event.checked)
          if (!this.fiscalYearID || this.fiscalYearID == null)
            this.appAlert.showError('SHD_SELECTED_FISCAL_YEAR_VALIDATION');

        break;
      case 'WIM':
        this.controllerChanged(event, 'PT006', 'swt');

        this.linkObj.pecifyStoreInPurchasing = false;
        break;
    }
  };
  fixedPartChanged(event, type) {
    this.setTransNumberData('', 'chkBox', event.checked, event.item.id, type);
    let code = '';
    switch (type) {
      case 'purchaseTrans':
        code = event.item.id == 'T' ? 'PT059' : event.item.id == 'F' ? 'PT061' : 'PT062';
        break;
      case 'tenders':
        code = event.item.id == 'T' ? 'PT081' : event.item.id == 'F' ? 'PT083' : 'PT084';

        break;
    }
    this.controllerChanged(event, code, 'chkBox');

  }
  seperatorChanged(event, type, code) {
    this.setTransNumberData('', 'rdBtn', '', event.item.id, type);
    this.controllerChanged(event, code, 'rdl');
  }

  onBlur(event, type, code) {
    if (event)
      this.setTransNumberData(event.value, 'txtBox', '', '', type);
    this.controllerChanged(event, code, 'txtBox');


  };
  controllerChanged(event, code, controllerType) {
    this.emptyYearFlag = controllerType == 'cln' ? false : true;
    let val = controllerType == 'swt' || controllerType == 'chkBox' ? event.checked == true ? '1' : '0' : event.value;
    if (this.changedData.length > 0) {
      let foundObj = this.changedData.filter(x => x.settingCode == code)[0];
      if (foundObj)
        this.changedData = this.changedData.filter(function (obj) {
          return obj.settingCode !== foundObj.settingCode;
        });
    }
    let rowStamp = this.settingsData?.filter(x => x.settingCode == code)[0]?.rowStamp;
    this.changedData.push({ settingCode: code, fieldValue: val, rowStamp: rowStamp });


  };
  onSelectLookup(event, type) {
    if (event) {
      let event1 = { value: event.selectedIDs[0] };
      switch (type) {
        case 'otherSetsDept':
          this.otherSetsObj.departmentID = event.selectedIDs[0];
          this.otherSetsDepartmentIDs = event.selectedIDs;
          this.controllerChanged(event1, 'PT033', 'lookup');
          break;
        case 'otherSetsVendor':
          this.otherSetsObj.vendorID = event.selectedIDs[0];
          this.otherSetsVendorIDs = event.selectedIDs;
          this.controllerChanged(event1, 'PT033', 'lookup');
          break;
        case 'DPODept':
          this.directPurchaseObjDepartmentIDs = event.selectedIDs;
          this.directPurchaseObj.departmentID = event.selectedIDs[0];
          this.controllerChanged(event1, 'PT040', 'lookup');
          break;
        case 'DPOUser':
          this.directPurchaseObj.userID = event.selectedIDs[0];
          this.directPurchaseObj.userIDs = event.selectedIDs;
          this.controllerChanged(event1, 'PT042', 'lookup');
          break;
        case 'DPOGroup':
          this.directPurchaseObj.groupID = event.selectedIDs[0];
          this.directPurchaseObj.groupIDs = event.selectedIDs;
          this.controllerChanged(event1, 'PT042', 'lookup');
          break;
        case 'tenderDept':
          this.tendersObj.departmentID = event.selectedIDs[0];
          this.tendersObj.departmentIDs = event.selectedIDs;
          this.controllerChanged(event1, 'PT063', 'lookup');
          break;
      }


    }
    else
      this.onClearLookup(type);
  }
  onClearLookup(type) {
    switch (type) {
      case 'otherSetsDept':
        this.otherSetsObj.departmentID = '';
        this.otherSetsDepartmentIDs = [];
        this.controllerChanged({ value: '' }, 'PT051', 'lookup');//DB
        break;
      case 'otherSetsVendor':
        this.otherSetsObj.vendorID = '';
        this.otherSetsVendorIDs = [];
        this.controllerChanged({ value: '' }, 'PT051', 'lookup');//DB
        break;
      case 'DPODept':
        this.directPurchaseObjDepartmentIDs = [];
        this.directPurchaseObj.departmentID = '';
        this.controllerChanged({ value: '' }, 'PT058', 'lookup');
        break;
      case 'DPOUser':
        this.directPurchaseObj.userID = '';
        this.directPurchaseObj.userIDs = [];
        this.controllerChanged({ value: '' }, 'PT060', 'lookup');
        break;
      case 'DPOGroup':
        this.directPurchaseObj.groupID = '';
        this.directPurchaseObj.groupIDs = [];
        this.controllerChanged({ value: '' }, 'PT060', 'lookup');
        break;
      case 'tenderDept':
        this.tendersObj.departmentID = null;
        this.tendersObj.departmentIDs = [];
        this.controllerChanged({ value: '' }, 'PT066', 'lookup');
        break;
    }
  }

  //todo create function named getEMptylinkObj the returns linkObj with all values reset it to false
  getEmptylinkObj() {
    return {
      linkedToFGL: false,
      linkedToFPC: false,
      linkedToHRM: false,
      linkedToWIM: false,
      pecifyStoreInPurchasing: false,

      purchaseYearID: '',
      purchaseYearName: HasibDate.getTodayGregorian().substring(0, 4),
      purchaseYearStartDate: HasibDate.getTodayGregorian().substring(0, 4) + '/' + '01' + '/' + '01',
      purchaseYearEndDate: HasibDate.getTodayGregorian().substring(0, 4) + '/' + '12' + '/' + '31',
      tabNumber: 1,
    };
  }
  getEmptyAutoNumberingObj() {
    return {
      autoPurchaseReqNo: false,
      lastPurchaseReqNo: '',
      tempLastPurchaseReqNo: '',



      autoChangeReqNo: false,
      lastChangeReqNo: '',
      tempLastChangeReqNo: '',

      autoChangeOrderNo: false,
      lastChangeOrderNo: '',
      tempLastChangeOrderNo: '',

      autoOfferRecordsOpeningNo: false,
      lastOfferRecordsOpeningNo: '',
      tempLastOfferRecordsOpeningNo: '',

      autoOffersIncpectinsNo: false,
      lastOffersIncpectinsNo: '',
      tempLastOffersIncpectinsNo: '',

      autoTechnicalRecordsNo: false,
      lastTechnicalRecordsNo: '',
      tempLastTechnicalRecordsNo: '',
      serialBy: '',
      tabNumber: 1,
    };
  };
  //todo create function named getEMptytransNumberingObj the returns transNumberingObj with all values reset it
  getEmptyNumberingObj() {
    return {
      seperator: '*',
      fixedPart: '',
      numberingData: [{ number: '0000000', fixedPart: '', seperator: '' }],
      tabNumber: 1,
      fixedPartText: '',
      disableText: true,
      text: ''
    };
  }
  //todo create function named getemptychangeReqSetsObj the returns changeReqSetsObj with all values reset it
  getemptychangeReqSetsObj() {
    return {
      hIncreaseRate: '',
      hDiscountRate: '',
      tabNumber: 1,
    };
  }
  //todo create function named getEmptyPurchaseReqSetsObj that returns PurchaseReqSetsObj with all values reset it

  getEmptyPurchaseReqSetsObj() {
    return {
      specifyPurchaseResponsiblePerson: false,
      addDateFromExternal: false,
      specifyPurchaseCycle: false,
      autoWarning: false,
      periodToAlert: '',
      allowedLateDuration: '',
      departmentIDs: [],
      departmentID: '',
      allowedtoMakePO: false,
      userIDs: [],
      userID: '',
      groupIDs: [],
      groupID: '',
      allowofIncrease: false,
      autoPONo: false,
      lastPONo: '',
      auotDPRecordNO: false,
      lastDPRecordNo: '',
      useStoreNo: false,
      tabNumber: 2,
    };
  }

  getEmptyFinancialSetsObj() {
    return {

      useProjectReservations: false,
      allowDealWithForeignCurrencies: false,
      tabNumber: 1,
    };

  }
  getEmptyServiceCodesSets() {
    return {
      countServiceLevels: '',
      autoServiceNo: false,
      serviceNoSeperator: '',
      tabNumber: 1,
    };
  }
  getEmptyOtherSetsObj() {
    return {
      supplier: 'V',
      dealingVendorsBlackList: 'S',
      noticeExpirationPeriod: '',
      vendorID: '',


      departmentID: '',
      stoppingPeriod: 5,
      tabNumber: 1,
    };
  }
  getEmptyDirectPurchaseObj() {
    return {
      autoWarning: false,
      allowedLateDuration: '',
      departmentIDs: [],
      departmentID: '',
      allowedtoMakePO: 'U',
      userIDs: [],
      userID: '',
      groupIDs: [],
      groupID: '',
      allowofIncrease: false,
      autoPONo: false,
      lastPONo: '',
      tempLastPONo: '',
      auotDPRecordNO: false,
      lastDPRecordNo: '',
      tempLastDPRecordNo: '',
      useStoreNo: false,
      tabNumber: 2,
      autoPurchaseTransNo: false,
      lastPurchaseTransNo: '',
      tempLastPurchaseTransNo: '',

      autoQuotationsReqNo: false,
      lastQuotationsReqNo: '',
      tempLastQuotationsReqNo: '',
      numberingObj: this.getEmptyNumberingObj(),
      purchaseRecDescSameToSubject: false,
      purchaseRecNoSameToPurchaseReq: false,
      purchaseRecCancellationMethod: '',
      determinePurchaseRecordNoInEtimad: '',
    };
  }
  getEmptyTendersObj() {
    return {
      departmentIDs: [],
      departmentID: null,
      primaryGuarenteeRate: '',
      dealingMethodWithPrimaryGuarentee: '',
      finalGuaranteeRate: '',
      dealingMethodWithFinalGuarentee: '',
      autoTenderLetterNo: false,
      lastTenderLetterNo: '',
      tempLastTenderLetterNo: '',

      autoTenderNo: false,
      lastTenderNo: '',
      tempLastTenderNo: '',
      autoStopReceiveOfferNo: false,
      lastStopReceiveOfferNo: '',
      tempLastStopReceiveOfferNo: '',
      autoDecideCommitteeDocNo: false,
      lastDecideCommitteeDocNo: '',
      tempLastDecideCommitteeDocNo: '',
      canCancelTender: false,
      dealingWithCancel: '0',
      determineTenderNoInEtimad: '',
      determineTenderRecordNoInEtimad: '',
      numberingObj: this.getEmptyNumberingObj(),

      tabNumber: 3,
    };
  }
  setTransNumberData(textValue, changeType, isChecked, valueChanged, numberingType) {
    this.numberingObj = numberingType == 'purchaseTrans' ? this.directPurchaseObj.numberingObj : this.tendersObj.numberingObj;
    switch (changeType) {
      case 'chkBox':
        if (isChecked) {
          let s = '';
          switch (valueChanged) {
            case 'T':
              if (numberingType == 'purchaseTrans')
                this.directPurchaseObj.numberingObj.disableText = false;
              else if (numberingType == 'tenders')
                this.tendersObj.numberingObj.disableText = false;
              s += ' ' + this.numberingObj.text;

              break;
            case 'L':

              s += ' ' + this.t.isAr ? 'الموقع' : 'Location';

              break;
            case 'F':

              s += ' ' + this.t.isAr ? 'السنة المالية' : 'Fiscal Year';

              break;

          }
          this.numberingObj.fixedPartText += this.numberingObj.fixedPartText == null ? '' + ' ' + s : ' ' + s;

        }
        else if (!isChecked) {
          let f = '';
          switch (valueChanged) {

            case 'T':
              if (numberingType == 'purchaseTrans')
                this.directPurchaseObj.numberingObj.disableText = true;
              else if (numberingType == 'tenders')
                this.tendersObj.numberingObj.disableText = true;
              f = this.numberingObj.text;
              this.numberingObj.text = '';
              this.numberingObj.fixedPartText = this.numberingObj.fixedPartText.replace(f, '');

              break;
            case 'L':
              f = this.t.isAr ? 'الموقع' : 'Location';
              this.numberingObj.fixedPartText = this.numberingObj.fixedPartText.replace(f, '');

              break;
            case 'F':
              f = this.t.isAr ? 'السنة المالية' : 'Fiscal Year';
              this.numberingObj.fixedPartText = this.numberingObj.fixedPartText.replace(f, '');

              break;

          }
        }
        break;
      case 'txtBox':
        this.numberingObj.fixedPartText += ' ' + textValue;
        break;
      case 'rdBtn':
        this.numberingObj.seperator = valueChanged == '*' ? '' : valueChanged;
        break;
    }
    let obj =
    {
      number: '0000000',
      seperator: this.numberingObj.seperator,
      fixedPart: this.numberingObj.fixedPartText,
    }

    this.numberingObj.numberingData = [];
    this.numberingObj.numberingData.push(obj);
    let event = { value: '' }
    if (numberingType == 'purchaseTrans') {
      this.directPurchaseObj.numberingObj.numberingData = [];
      this.directPurchaseObj.numberingObj.numberingData.push(obj);
      event.value = this.directPurchaseObj.numberingObj.fixedPart;
    }
    else {
      this.tendersObj.numberingObj.numberingData = [];

      this.tendersObj.numberingObj.numberingData.push(obj);
      event.value = this.tendersObj.numberingObj.fixedPart;
    }


  };
  saveSettings() {
    if (this.emptyYearFlag && !this.linkObj.linkedToFGL) {
      this.changedData = this.changedData.filter(x => x.settingCode !== 'PT001' && x.settingCode !== 'PT002' && x.settingCode !== 'PT003');

      let rowStamp = this.settingsData?.filter(x => x.settingCode == 'PT001')[0]?.rowStamp;
      this.changedData.push({ settingCode: 'PT001', fieldValue: this.linkObj.purchaseYearName, rowStamp: rowStamp });
      let rowStamp1 = this.settingsData?.filter(x => x.settingCode == 'PT002')[0]?.rowStamp;
      this.changedData.push({ settingCode: 'PT002', fieldValue: this.linkObj.purchaseYearStartDate, rowStamp: rowStamp1 });
      let rowStamp2 = this.settingsData?.filter(x => x.settingCode == 'PT003')[0]?.rowStamp;
      this.changedData.push({ settingCode: 'PT003', fieldValue: this.linkObj.purchaseYearEndDate, rowStamp: rowStamp2 });

    }
    if (this.changedData.length > 0) {
      if (this.changedData.length > 1) {
        let paramObj =
        {
          jsonData: JSON.stringify(this.changedData),
          organizationID: this.organizationID,

        }
        this.ptmService.UpdateSettingsBulk(paramObj).subscribe(output => {
          if (output.affectedRows > 0) {
            this.appAlert.showSuccess();
            this.clear();

            this.loadSettings();
          }
          else {
            this.appAlert.showError(output.message);
          }
        });
      }
      else {
        let paramObj =
        {
          organizationID: this.organizationID,
          settingCode: this.changedData[0].settingCode,
          fieldValue: this.changedData[0].fieldValue,
          rowStamp: this.changedData[0].rowStamp,

        }
        this.ptmService.UpdateSettings(paramObj).subscribe(output => {
          if (output.affectedRows > 0) {
            this.appAlert.showSuccess();
            this.clear();
            this.loadSettings();
          }
          else {
            this.appAlert.showError(output.message);
          }
        });
      }
    }
  }
  validateLastNumberToBeGreater() {
    if (this.autoNumbering.lastChangeOrderNo < this.autoNumbering.tempLastChangeOrderNo)
      return false;
    else if (this.autoNumbering.lastChangeReqNo < this.autoNumbering.tempLastChangeReqNo)
      return false;
    else if (this.autoNumbering.lastOfferRecordsOpeningNo < this.autoNumbering.tempLastOfferRecordsOpeningNo)
      return false;
    else if (this.autoNumbering.lastOffersIncpectinsNo < this.autoNumbering.tempLastOffersIncpectinsNo)
      return false;
    else if (this.autoNumbering.lastPurchaseReqNo < this.autoNumbering.tempLastPurchaseReqNo)
      return false;
    else if (this.directPurchaseObj.lastPurchaseTransNo < this.directPurchaseObj.tempLastPurchaseTransNo)
      return false;
    else if (this.directPurchaseObj.lastQuotationsReqNo < this.directPurchaseObj.tempLastQuotationsReqNo)
      return false;
    else if (this.autoNumbering.lastTechnicalRecordsNo < this.autoNumbering.tempLastTechnicalRecordsNo)
      return false;
    else return true;

  }

  //to do create function
  clear() {
    this.pageMode = PageMode.inquiryMode
    this.appToolBar.loaded(true);
    this.linkObj = this.getEmptylinkObj();
    this.numberingObj = this.getEmptyNumberingObj();
    this.autoNumbering = this.getEmptyAutoNumberingObj();
    this.changeReqSetsObj = this.getemptychangeReqSetsObj();
    this.purchaseReqSetsObj = this.getEmptyPurchaseReqSetsObj();
    this.financialSetsObj = this.getEmptyFinancialSetsObj();
    this.serviceCodesSetsObj = this.getEmptyServiceCodesSets();
    this.otherSetsObj = this.getEmptyOtherSetsObj();
    this.directPurchaseObj = this.getEmptyDirectPurchaseObj();
    this.tendersObj = this.getEmptyTendersObj();
    this.fiscalYearID = null;
    this.fiscalYearName = null;
    this.fiscalYearStatus = null;
    this.fiscalYearStatusData = [];
    this.changedData = [];
    this.settingsData = [];

  }







}
