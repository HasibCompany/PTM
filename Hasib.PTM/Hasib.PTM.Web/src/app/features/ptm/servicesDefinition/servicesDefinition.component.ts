import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent as Base } from "@hasib/core/base";
import { PageType, PageMode, Helpers } from '@hasib/core/utils';
import { PtmService } from '../ptm.service';
import { Global, EventEmitterService } from "../../../core/services";
import { takeUntil } from 'rxjs/operators';
import { FormUI, ConfirmButtonType, TreeUI } from '@hasib/ui';
@Component({
  selector: 'servicesDefinition',
  templateUrl: './servicesDefinition.component.html',
  styleUrls: ['./servicesDefinition.component.scss']
})
export class ServicesDefinitionComponent extends Base implements OnInit {

  @ViewChild('formEl', { static: true }) formEl: FormUI;
  @ViewChild('treeRef', { static: true }) treeRef: TreeUI;

  t = Base.t;
  pageMode = PageMode.inquiryMode;

  serviceData: any[] = [];
  selectedNode: any = {}
  selectedNodeID: number = 0;
  serviceNode: any = {};
  childrenNode: any = {};
  parentServiceNode: any = {};
  newServiceObj: any = {};
  oldServiceObj: any = {};

  accountIDs: any = [];
  isLinkedFGL: boolean = false;
  maxServiceLevels: any;
  autoServiceNo: boolean = true;
  serviceNoSeperator: any;
  currentServiceLevel: any = 0;

  constructor(public ptmService: PtmService, public global: Global, private _es: EventEmitterService) {
    super();
  }

  ngOnInit(): void {
    this.setPageType(PageType.singleRecordPage);
    this.appToolBar.show();
    this.appAlert.hide();

    this.loadData();
    this.loadSettings();

    this.appToolBar.onInsert = () => {
      this.appAlert.hide();
      if (this.selectedNode && this.selectedNodeID && this.currentServiceLevel == this.maxServiceLevels) {
        this.pageMode = PageMode.inquiryMode;
        this.appToolBar.loaded(true);
        this.appToolBar.disableNew = false;
        this.appToolBar.disableDelete = false;
        this.appAlert.showError('PTM_IS_NOT_ALLOWED_EXCEED_NUMBER_OF_SERVICE_LEVELS_IN_SETTINGS');
        return;
      }
      if (this.selectedNode && this.selectedNodeID && this.serviceNode.hasChild == false) {
        this.appAlert.showError('PTM_SUBCATEGORIES_CANNOT_ADDED_SERVICE');
        this.appToolBar.loaded(true);
        this.appToolBar.disableNew = false;
        this.appToolBar.disableDelete = false;
        return;
      }
      this.pageMode = PageMode.insertMode;
      if (this.selectedNode && this.selectedNodeID > 0) {
        this.parentServiceNode = JSON.parse(JSON.stringify(this.serviceNode));
        this.serviceNode = {};

        this.serviceNode = JSON.parse(JSON.stringify(this.parentServiceNode));
        this.serviceNode.parentID = this.parentServiceNode.serviceID;
        this.serviceNode.descriptionAR = "";
        this.serviceNode.descriptionEN = "";
        this.serviceNode.serviceNumber = "";
        this.serviceNode.parentDescriptionAR = this.parentServiceNode.descriptionAR;
        this.serviceNode.parentDescriptionEN = this.parentServiceNode.descriptionEN;
        this.serviceNode.treeLevel = this.parentServiceNode.treeLevel + 1;
        this.serviceNode.hasChild = this.maxServiceLevels == this.serviceNode.treeLevel ? false : true;
        this.serviceNode.accountID = null;
        this.serviceNode.accountName = "";
        this.accountIDs = [];
        this.serviceNode.price = null;
        this.serviceNode.minPrice = null;
        this.serviceNode.isDefault = false;
        this.serviceNode.isSuspended = false;
      }
      else {
        this.serviceNode = {};
        this.serviceNode.parentID = null;
        this.serviceNode.descriptionAR = "";
        this.serviceNode.descriptionEN = "";
        this.serviceNode.serviceNumber = "";
        this.serviceNode.parentDescriptionAR = "";
        this.serviceNode.parentDescriptionEN = "";
        this.serviceNode.treeLevel = 1;
        this.serviceNode.hasChild = this.maxServiceLevels == this.serviceNode.treeLevel ? false : true;
        this.serviceNode.accountID = null;
        this.serviceNode.accountName = "";
        this.accountIDs = [];
        this.serviceNode.price = null;
        this.serviceNode.minPrice = null;
        this.serviceNode.isDefault = false;
        this.serviceNode.isSuspended = false;
      }
    }

    this.appToolBar.onEdit = () => {
      if (this.selectedNode && this.selectedNodeID) {
        if (this.serviceNode.hasChild == true && this.serviceData.filter(s => s.parentID == this.serviceNode.serviceID).length > 0) {
          this.appAlert.showError('PTM_SERVICE_HAS_SUBCATEGORIES_NOT_ALLOWED_MODIFY_DELETE');
          this.appToolBar.loaded(true);
          return;
        }
        this.checkIsUsed({ checkValue: this.selectedNodeID, sourceTable: 'PTM_Services', checkTable: '', omitTable: '' }).subscribe((isUsed) => {
          if (isUsed)
            this.appAlert.showError('PTM_SERVICE_HAS_SUBCATEGORIES_NOT_ALLOWED_MODIFY_DELETE');
          else
            this.pageMode = PageMode.editMode;
        });
      }
    }

    this.appToolBar.onDelete = () => {
      if (this.selectedNode && this.selectedNodeID) {
        if (this.serviceNode.hasChild == true && this.serviceData.filter(s => s.parentID == this.serviceNode.serviceID).length > 0) {
          this.appAlert.showError('PTM_SERVICE_HAS_SUBCATEGORIES_NOT_ALLOWED_MODIFY_DELETE');
          this.appToolBar.loaded(true);
          return;
        }
        this.checkIsUsed({ checkValue: this.selectedNodeID, sourceTable: 'PTM_Services', checkTable: '', omitTable: '' }).subscribe((isUsed) => {
          if (isUsed)
            this.appAlert.showError('PTM_SERVICE_HAS_SUBCATEGORIES_NOT_ALLOWED_MODIFY_DELETE');
          else
            this.deleteServices();
        });
      }
    }

    this.appToolBar.onSave = () => {
      if (this.formEl.validate()) {
        this.serviceNode.organizationID = this.global.getCurrentLegalEntityInfo().orgUnitID;
        if (this.pageMode == PageMode.insertMode) {
          this.insertServices();
        }
        else if (this.pageMode == PageMode.editMode) {
          this.newServiceObj = JSON.parse(JSON.stringify(this.serviceNode));
          if (this.trackDataChanged(this.oldServiceObj, this.newServiceObj)) {
            this.updateServices();
          }
          else
            this.appAlert.showError('SHD_NO_DATA_CHANGED', true);
        }
      }
    }

    this.appToolBar.onCancel = () => {
      if (this.pageMode == PageMode.insertMode) {
        this.serviceNode = Object.assign({}, {});
        this.serviceNode = this.parentServiceNode;
        this.parentServiceNode = {};
      }
      this.pageMode = PageMode.inquiryMode;
      this.appToolBar.loaded(true);
      this.appToolBar.disableNew = false;
      this.appToolBar.disableDelete = false;
      this.appToolBar.disableEdit = false;
    }

    this._es.onLegalEntityChanged.pipe(takeUntil(this.componentDestroyed)).subscribe(() => {
      this.appAlert.hide();
      this.loadData();
      this.loadSettings();
      this.refreshTree();
    }, error => { this.appAlert.showError(error) });

    this._es.onBranchChanged.pipe(takeUntil(this.componentDestroyed)).subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    this.loadServices({ organizationID: this.global.getCurrentLegalEntityInfo().orgUnitID, serviceID: "" });
  }

  loadServices(data) {
    this.ptmService.LoadServices({ organizationID: this.global.getCurrentLegalEntityInfo().orgUnitID, serviceID: data.serviceID }).subscribe(
      (result: any) => {
        if (data.serviceID == "") {
          this.serviceData = result;
        }
        else {
          this.serviceNode = result[0];
          this.accountIDs = this.serviceNode.accountID != null ? [this.serviceNode.accountID] : [];
        }
      });
  }

  loadSettings() {
    let paramObj = {
      organizationID: this.global.getCurrentLegalEntityInfo().orgUnitID,
      settingCode: '',
    };

    this.ptmService.LoadSettings(paramObj).subscribe((res: any) => {
      if (res && res.length > 0) {
        //إعدادات الربط مع الأنظمة
        this.isLinkedFGL = res.filter(item => item.settingCode == "PT004")[0].fieldValue == "1" ? true : false;

        //إعدادات رموز الخدمات
        this.maxServiceLevels = Number(res.filter(item => item.settingCode == "PT035")[0].fieldValue);//عدد مستويات الخدمة
        this.autoServiceNo = res.filter(item => item.settingCode == "PT036")[0].fieldValue == "1" ? true : false;//ترقيم الخدمات تلقائي
        this.serviceNoSeperator = res.filter(item => item.settingCode == "PT037")[0].fieldValue;//شكل الفاصل في رقم الخدمة
      }
    }, error => {
      this.appAlert.showError(error);
    });
  }

  insertServices() {
    this.appAlert.hide();
    this.ptmService.insertServices(this.serviceNode).subscribe((output: any) => {
      if (output.valid) {
        this.appAlert.showSuccess();
        this.pageMode = PageMode.inquiryMode;
        this.appToolBar.loaded(true);
        this.serviceNode.serviceID = output.insertedID;
        this.serviceNode.serviceNumber = output.extras.serviceNumber;
        this.serviceNode.rowStamp = output.rowStamp;
        this.treeRef.addNode(this.serviceNode);
        this.selectedNode = { id: this.serviceNode.serviceID };
        this.selectedNodeID = this.serviceNode.serviceID;
        this.currentServiceLevel = this.serviceNode.treeLevel;
        this.appToolBar.disableNew = false;
        this.appToolBar.disableDelete = false;
        this.appToolBar.disableEdit = false;
      }
      else {
        this.appAlert.showError(output.message);
      }
    }, error => {
      this.appAlert.showApiError(error);
    });
  }

  updateServices() {
    this.appAlert.hide();
    this.ptmService.updateServices(this.serviceNode).subscribe((output: any) => {
      if (output.valid && output.affectedRows) {
        this.appAlert.showSuccess();
        this.pageMode = PageMode.inquiryMode;
        this.appToolBar.loaded(true);
        this.serviceNode.rowStamp = output.rowStamp;
        this.treeRef.updateNode(this.serviceNode);
        this.selectedNode = { id: this.serviceNode.serviceID };
        this.selectedNodeID = this.serviceNode.serviceID;
        this.appToolBar.disableNew = false;
        this.appToolBar.disableDelete = false;
        this.appToolBar.disableEdit = false;
      }
      else {
        this.appAlert.showError(output.message);
      }
    }, error => {
      this.appAlert.showApiError(error);
    })
  }

  deleteServices() {
    this.appAlert.hide();
    this.appConfirm.show({
      buttons: [
        {
          type: ConfirmButtonType.Yes,
          action: () => {
            this.ptmService.deleteServices(this.serviceNode).subscribe((output: any) => {
              if (output.valid && output.affectedRows) {
                this.appAlert.showDeleteSuccess();
                this.refreshTree();
                this.serviceNode = Object.assign({}, {});
                this.pageMode = PageMode.inquiryMode;
              }
              else {
                this.appAlert.showError(output.message);
              }
            },
              error => {
                this.appAlert.showApiError(error);
              });
          }
        },
        {
          type: ConfirmButtonType.No
        }
      ],
      content: this.t.instant('SHD_CONFIRM_CONTENT'),
      title: this.t.instant('SHD_CONFIRM_HEADER')
    });
  }

  trackDataChanged(oldObj, newObj) {
    let isChanged: boolean = !Helpers.isEqual(oldObj, newObj);
    return isChanged;
  }

  onSelectNode(event) {
    this.appAlert.hide();
    this.pageMode = PageMode.inquiryMode;
    if (event.node && event.node.id > 0) {
      this.selectedNode = event.node;
      this.childrenNode = event.node.children;
      this.selectedNodeID = event.node.data.serviceID;
      this.serviceNode = event.node.data;
      this.loadServices({ serviceID: this.serviceNode.serviceID, parentID: this.serviceNode.parentID })
      this.oldServiceObj = Object.assign({}, this.serviceNode);
      this.appToolBar.loaded(true);
      this.appToolBar.disableNew = false;
      this.appToolBar.disableDelete = false;
      this.appToolBar.disableEdit = false;
      this.currentServiceLevel = event.node.data.treeLevel;
    }
  }

  refreshTree() {
    this.appAlert.hide();
    this.loadServices({ serviceID: "", parentID: "" });
    this.appToolBar.loaded(false);
    this.pageMode = PageMode.inquiryMode;
    this.selectedNode = {};
    this.selectedNodeID = -1;
    this.currentServiceLevel = 0;
    this.serviceNode = Object.assign({}, {});
  }

  checkIsUsed(obj) {
    return this.ptmService.LoadDataReferenceFound(obj);
  }

  onSelectAccount(event) {
    this.appAlert.hide();
    if (event.selectedIDs && event.selectedIDs.length > 0 && event.selectedItems && event.selectedItems.length > 0) {
      this.accountIDs = event.selectedIDs;
      this.serviceNode.accountID = event.selectedIDs[0];
    }
    else
      this.onClearAccount();
  }

  onClearAccount() {
    this.accountIDs = [];
    this.serviceNode.accountID = null;
  }
}
