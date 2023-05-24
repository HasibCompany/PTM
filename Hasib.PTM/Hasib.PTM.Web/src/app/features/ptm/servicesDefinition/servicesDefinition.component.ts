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
  treeLevelId: any = 0;

  constructor(public ptmService: PtmService, public global: Global, private _es: EventEmitterService) {
    super();
  }

  ngOnInit(): void {
    this.setPageType(PageType.singleRecordPage);
    this.appToolBar.show();
    this.appAlert.hide();

    this.loadData();

    this.appToolBar.onInsert = () => {
      if (this.selectedNode && this.selectedNodeID && this.serviceNode.hasChild == false) {
        this.appAlert.showError('PTM_SUBCATEGORIES_CANNOT_ADDED_SERVICE');
        this.appToolBar.loaded(true);
        this.appToolBar.disableNew = false;
        this.appToolBar.disableDelete = false;
        return;
      }
      this.pageMode = PageMode.insertMode;
      if (this.selectedNode && this.selectedNodeID != -1) {
        this.parentServiceNode = JSON.parse(JSON.stringify(this.serviceNode));
        this.serviceNode = {};

        this.serviceNode = JSON.parse(JSON.stringify(this.parentServiceNode));

        this.serviceNode.treeLevel = this.parentServiceNode.treeLevel + 1;
        this.serviceNode.parentID = this.parentServiceNode.serviceID;
        let lastLevel = this.childrenNode.length > 0 ? this.childrenNode[this.childrenNode.length - 1].data.levelOrder : 0;
        this.serviceNode.levelOrder = lastLevel + 1;
        this.serviceNode.descriptionAR = "";
        this.serviceNode.descriptionEN = "";
        this.serviceNode.parentDescriptionAR = this.parentServiceNode.descriptionAR;
        this.serviceNode.parentDescriptionEN = this.parentServiceNode.descriptionEN;

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
      if (this.pageMode == PageMode.editMode) {
        this.pageMode = PageMode.inquiryMode;
        this.appToolBar.loaded(true);
      }
      else {
        this.pageMode = PageMode.inquiryMode;
        this.appToolBar.loaded(true);
        this.serviceNode = Object.assign({}, {});
        this.serviceNode = this.parentServiceNode;
        this.parentServiceNode = {};
      }
    }

    this._es.onLegalEntityChanged.pipe(takeUntil(this.componentDestroyed)).subscribe(() => {
      this.appAlert.hide();
      this.loadData();
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
        }
      });
  }

  insertServices() {
    this.ptmService.insertServices(this.serviceNode).subscribe((output: any) => {
      if (output.valid) {
        this.appAlert.showSuccess();
        this.pageMode = PageMode.inquiryMode;
        this.appToolBar.loaded(true);
        this.serviceNode.serviceID = output.insertedID;
        this.serviceNode.rowStamp = output.rowStamp;
        this.treeRef.addNode(this.serviceNode);
        this.selectedNode = { id: this.serviceNode.serviceID };
        this.selectedNodeID = this.serviceNode.serviceID;
        //this.appToolBar.disableNew = this.serviceNode.hasChild == true ? false : true;
      }
      else {
        this.appAlert.showError(output.message);
      }
    }, error => {
      this.appAlert.showApiError(error);
    });
  }

  updateServices() {
    this.ptmService.updateServices(this.serviceNode).subscribe((output: any) => {
      if (output.valid && output.affectedRows) {
        this.appAlert.showSuccess();
        this.pageMode = PageMode.inquiryMode;
        this.appToolBar.loaded(true);
        this.serviceNode.rowStamp = output.rowStamp;
        this.treeRef.updateNode(this.serviceNode);
        this.selectedNode = { id: this.serviceNode.serviceID };
        this.selectedNodeID = this.serviceNode.serviceID;
        //this.appToolBar.disableNew = this.serviceNode.hasChild == true ? false : true;
      }
      else {
        this.appAlert.showError(output.message);
      }
    }, error => {
      this.appAlert.showApiError(error);
    })
  }

  deleteServices() {
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
      //this.appToolBar.disableNew = event.node.data.hasChild == true ? false : true;
      this.treeLevelId = event.node.data.treeLevel;
    }
  }

  refreshTree() {
    this.loadServices({ serviceID: "", parentID: "" });
    this.appToolBar.loaded(false);
    this.pageMode = PageMode.inquiryMode;
    //this.appToolBar.disableNew = true;
    this.selectedNode = {};
    this.selectedNodeID = -1;
    this.serviceNode = Object.assign({}, {});
  }

  checkIsUsed(obj) {
    return this.ptmService.LoadDataReferenceFound(obj);
  }
}
