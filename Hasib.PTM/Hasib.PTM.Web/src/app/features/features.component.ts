import { ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AppAlertService, AppConfirmService, AppToolBarService, EventEmitterService, Global } from '@hasib/core/services';
import { ScriptLoaderService } from '@hasib/core/services/scriptLoader.service';
import { TranslateService } from '@hasib/core/translate';
import { Helpers, Keyboard } from '@hasib/core/utils';
import { PageType } from '@hasib/core/utils/pageType.enum';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


declare let mApp: any;
@Component({
  selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
  host: { '(window:keydown)': 'keyDownShortcut($event)' },
  templateUrl: "./features.component.html",
  styleUrls: ['./features.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FeaturesComponent implements OnInit {

  //-----------------------------PROPERTIES
  private _changeDetectionInterval: any;
  private _handler = this.onWindowResize.bind(this);
  private _waiting = false;
  private _resizeTimeout;
  private _mMenu: any;

  hideTitle: boolean = false;
  toolbarHeight: number;
  actionStatus: string;
  t = TranslateService;
  langSubscription: Subscription;
  hintInterval: any;
  showHint: boolean = false;
  hintMsgAR = '';
  hintMsgEN = '';
  hintList: any = [];
  isAdmin: boolean = false;
  employeeID = this.global.getCurrentUser().entityId;
  //-----------------------------EVENTS
  private componentDestroyed: Subject<boolean> = new Subject();

  onSearch() {
    this.appToolBar.onToolBarSearchChange.next(true);
  }

  onDelete() {
    this.appToolBar.actionStatusKey = this.actionStatus = 'SHD_DELETEMODE';

    this.appToolBar.hideSearchDiv = true;
    this.appToolBar.onDelete();
  }

  onInsert() {
    //let pageType = this.global.pageType;
    //this.appToolBar.actionStatusKey = this.actionStatus = 'SHD_INSERTMODE';
    //if (pageType == PageType.multipleRecordsPage) {
    //  this.appToolBar.disableNew = true;
    //  this.appToolBar.disableEdit = true;
    //  this.appToolBar.disableSearch = true;
    //  this.appToolBar.disablePrint = true;
    //  this.appToolBar.disableDelete = true;
    //  this.appToolBar.disableSaveAndCancel = false;
    //} else if (pageType == PageType.singleRecordPage) {
    //  this.appToolBar.disableNew = true;
    //  this.appToolBar.disableEdit = true;
    //  this.appToolBar.disableSearch = true;
    //  this.appToolBar.disablePrint = true;
    //  this.appToolBar.disableDelete = true;
    //  this.appToolBar.disableSaveAndCancel = false;
    //} else {
    //}


    //this.appToolBar.hideSearchDiv = true;
    this.appToolBar.inserted();
    this.appToolBar.onInsert();
  }

  onEdit() {
    //let pageType = this.global.pageType;
    //if (pageType == PageType.multipleRecordsPage) {
    //  this.appToolBar.disableNew = true;
    //  this.appToolBar.disableEdit = true;
    //  this.appToolBar.disableDelete = true;
    //  this.appToolBar.disableSearch = true;
    //  this.appToolBar.disablePrint = true;
    //  this.appToolBar.disableSaveAndCancel = false;
    //} else if (pageType == PageType.singleRecordPage) {
    //  this.appToolBar.disableNew = true;
    //  this.appToolBar.disableEdit = true;
    //  this.appToolBar.disableDelete = true;
    //  this.appToolBar.disableSearch = true;
    //  this.appToolBar.disablePrint = true;
    //  this.appToolBar.disableSaveAndCancel = false;
    //} else {
    //}

    //this.appToolBar.actionStatusKey = this.actionStatus = 'SHD_EDITMODE';

    //this.appToolBar.hideSearchDiv = true;
    this.appToolBar.edited();

    this.appToolBar.onEdit();
  }

  onCancel() {
    let pageType = this.global.pageType;
    this.appToolBar.disableSaveAndCancel = true;
    this.appToolBar.disablePrint = this.appToolBar.disablePrintPermission ? true : false;
    if (pageType == PageType.multipleRecordsPage) {
      if (this.actionStatus == 'SHD_EDITMODE') {
        this.appToolBar.disableEdit = this.appToolBar.disableUpdatePermission ? true : false;
        this.appToolBar.disableNew = this.appToolBar.disableAddPermission ? true : false;
        this.appToolBar.disableDelete = this.appToolBar.disableDeletePermission ? true : false;
        this.appToolBar.disableSearch = this.appToolBar.disableSearchPermission ? true : false;
      } else if (this.actionStatus == 'SHD_INSERTMODE') {
        this.appToolBar.disableNew = this.appToolBar.disableAddPermission ? true : false;
        this.appToolBar.disableSearch = this.appToolBar.disableSearchPermission ? true : false;
        //this.appToolBar.disablePrint = true;
        this.appToolBar.disableEdit = true;
        this.appToolBar.disableDelete = true;
      }
    } else if (pageType == PageType.singleRecordPage) {
      if (this.actionStatus == 'SHD_EDITMODE') {
        this.appToolBar.disableEdit = this.appToolBar.disableUpdatePermission ? true : false;
        this.appToolBar.disableNew = true;
      } else if (this.actionStatus == 'SHD_INSERTMODE') {
        this.appToolBar.disableNew = this.appToolBar.disableAddPermission ? true : false;
        this.appToolBar.disableEdit = true;
      }
    } else {
    }
    this.appToolBar.actionStatusKey = '';

    this.appToolBar.onCancel();
  }

  onChangePageNumber(searchPageNumber) {
    this.appToolBar.searchPageNumber = searchPageNumber;
    this.appToolBar.onChangePageNumber();
  }

  //-----------------------------FUNCTIONS

  showHideAppTitle(currentUrl) {
    /*hide app toolbar in these screens*/
    if ("/index" === currentUrl || "/error" === currentUrl || 0 === currentUrl.lastIndexOf('/') /*like: "/ssm" */) {
      this.hideTitle = true;
      this.appToolBar.hide();
    } else {
      this.hideTitle = false;
    }
  }

  //----------BODY SCROLL

  private onWindowResize() {
    if (this._waiting) {
      return;
    }
    this._waiting = true;

    clearTimeout(this._resizeTimeout);

    document.body.click();
    this.fixToolbarAlert();
    this._mMenu.onResize();

    setTimeout(() => {
      this._waiting = false;
    }, 500);

    // schedule an extra execution of resize() after 600ms
    // in case the resize stops in next 500ms
    this._resizeTimeout = setTimeout(() => {
      document.body.click();
      this.fixToolbarAlert();
      this._mMenu.onResize();
    }, 600);

  }


  private fixToolbarAlert() {
    var h = $('app-toolbar h-toolBar .actionToolbar').css('height');
    if (h) {
      this.toolbarHeight = +h.substr(0, h.length - 2);
      var y = this.toolbarHeight + 100;
      $('.ui-messages:first').css('top', y);
      var aa = y - 95;
      $('#appFeatures').css('margin-top', aa);
    }
  }

  //-----------------------------LIFECYCLE HOOKS

  constructor(private _script: ScriptLoaderService, private _router: Router, private _zone: NgZone, public appToolBar: AppToolBarService
    , public appAlert: AppAlertService, public appConfirm: AppConfirmService, private _cdr: ChangeDetectorRef, private global: Global
    , private _es: EventEmitterService) {
    this.showHideAppTitle(this._router.url);

    //detach change detector after 5 seconds from loading
    setTimeout(() => {
      this._cdr.detach();
    }, 5000);

    //detect changes every 100 milli seconds
    this._changeDetectionInterval = setInterval(() => {
      this._cdr.detectChanges();
    }, 100);

  }

  keyDownShortcut(event) {
    if (this.t.isAr) {
      if (event.altKey && event.which == Keyboard.openBracket && !this.appToolBar.disableNew && !this.appToolBar.hideNew) {
        event.preventDefault();
        this.onInsert();
      }
      else if (event.altKey && event.which == Keyboard.s && !this.appToolBar.disableSearch && !this.appToolBar.hideSearch) {
        event.preventDefault();
        this.onSearch();
      }
      else if (event.altKey && event.which == Keyboard.j && !this.appToolBar.disableEdit && !this.appToolBar.hideEdit) {
        event.preventDefault();
        this.onEdit();
      }
      else if (event.altKey && event.which == Keyboard.tilde && !this.appToolBar.disableDelete && !this.appToolBar.hideDelete) {
        event.preventDefault();
        this.onDelete();
      }
      else if (event.altKey && event.which == Keyboard.quote && !this.appToolBar.disablePrint && !this.appToolBar.hidePrint) {
        event.preventDefault();
        this.appToolBar.onPrint();
      }
      else if (event.altKey && event.which == Keyboard.p && !this.appToolBar.disableSave && !this.appToolBar.hideSave) {
        event.preventDefault();
        this.appToolBar.onSave();
      }
      else if (event.altKey && event.which == Keyboard.y && !this.appToolBar.disableSaveAndCancel && !this.appToolBar.hideCancel) {
        event.preventDefault();
        this.onCancel();
      }
      else if (event.which == Keyboard.f4 && !this.appToolBar.disableSearch && !this.appToolBar.hideSearch) {
        event.preventDefault();
        this.onSearch();
      }
      else if (event.which == Keyboard.f2) {
        console.log(this.global.currentApplication);

        //  let module = this.global.getApplicationModulesFromStorage().filter((item) => { return item.appCode.toLowerCase() == 'cms' })[0];
        if (this.global.currentApplication?.appCode == 'CMS') {
          console.log(this.global.currentApplication.appCode);

          event.preventDefault();
          let indqMenuItem;
          this.global.navMenuItems.every((item) => {
            indqMenuItem = item.children.find(childItem => childItem.pageURL.indexOf("cms/searchOnTransactions") !== -1);
            if (indqMenuItem)
              return false;
            else
              return true;
          });
          if (indqMenuItem) {
            let url2: any = this._router.createUrlTree([indqMenuItem.pageURL]);
            url2 = url2.toString() + "/";
            window.open("#" + url2.toString(), '_blank');
          }
        }
      }
    }
    else {
      if (event.altKey && event.which == Keyboard.n && !this.appToolBar.disableNew && !this.appToolBar.hideNew) {
        event.preventDefault();
        this.onInsert();
      }
      else if (event.altKey && event.which == Keyboard.i && !this.appToolBar.disableSearch && !this.appToolBar.hideSearch) {
        event.preventDefault();
        this.onSearch();
      }
      else if (event.altKey && event.which == Keyboard.e && !this.appToolBar.disableEdit && !this.appToolBar.hideEdit) {
        event.preventDefault();
        this.onEdit();
      }
      else if (event.altKey && event.which == Keyboard.d && !this.appToolBar.disableDelete && !this.appToolBar.hideDelete) {
        event.preventDefault();
        this.onDelete();
      }
      else if (event.altKey && event.which == Keyboard.p && !this.appToolBar.disablePrint && !this.appToolBar.hidePrint) {
        event.preventDefault();
        this.appToolBar.onPrint();
      }
      else if (event.altKey && event.which == Keyboard.s && !this.appToolBar.disableSave && !this.appToolBar.hideSave) {
        event.preventDefault();
        this.appToolBar.onSave();
      }
      else if (event.altKey && event.which == Keyboard.c && !this.appToolBar.disableSaveAndCancel && !this.appToolBar.hideCancel) {
        event.preventDefault();
        this.onCancel();
      }
      else if (event.which == Keyboard.f4 && !this.appToolBar.disableSearch && !this.appToolBar.hideSearch) {
        console.log(this.global.currentApplication);

        event.preventDefault();
        this.onSearch();
      }
      else if (event.which == Keyboard.f2) {
        console.log(this.global.currentApplication);

        //  let module = this.global.getApplicationModulesFromStorage().filter((item) => { return item.appCode.toLowerCase() == 'cms' })[0];
        if (this.global.currentApplication?.appCode == 'CMS') {
          console.log(this.global.currentApplication.appCode);

          event.preventDefault();
          let indqMenuItem;
          this.global.navMenuItems.every((item) => {
            indqMenuItem = item.children.find(childItem => childItem.pageURL.indexOf("cms/searchOnTransactions") !== -1);
            if (indqMenuItem)
              return false;
            else
              return true;
          });
          if (indqMenuItem) {
            let url2: any = this._router.createUrlTree([indqMenuItem.pageURL]);
            url2 = url2.toString() + "/";
            window.open("#" + url2.toString(), '_blank');
          }
        }
      }
    }
  }

  ngOnInit() {
    this._script.load('body', 'assets/vendors/base/vendors.bundle-min.js', 'assets/demo/default/base/scripts.bundle-min.js')
      .then(() => {
      });
    this._router.events.subscribe((route) => {
      if (route instanceof NavigationStart) {
        (<any>mApp).scrollTop();
        this.showHideAppTitle(route.url);
      }
      if (route instanceof NavigationEnd) {
        this.appToolBar.intialize(!this.global.allowCurrentPageInsert, !this.global.allowCurrentPageEdit, !this.global.allowCurrentPageDelete, !this.global.allowCurrentPageSave, !this.global.allowCurrentPagePrint, !this.global.allowCurrentPageSearch);
        Helpers.setLoading(false);

        this.appAlert.hide();
        // content m-wrapper animation
        let animation = 'm-animate-fade-in-up'; //'m-animate-fade-in-up';
        $('.m-wrapper').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
          $('.m-wrapper').removeClass(animation);
        }).removeClass(animation).addClass(animation);

      }
    });

    this.langSubscription = this.t.onLangChanged.subscribe(() => {
      this._cdr.markForCheck();
    });

    this._es.onApplicationChanged.pipe(takeUntil(this.componentDestroyed)).subscribe(currentApp =>
    {
        if (currentApp?.appCode == 'CMS') {
          // load Referrals Hints
          this.global.CheckIsAppAdmin(38000).subscribe((isAdmin: any) => {
            this.isAdmin = isAdmin;
            this.loadHints();
            this.hintInterval = setInterval(() => {
              this.loadHints();
            }, 300000); // every 5 mintues 300000
          });
        }
        else {
          if (this.hintInterval)
            clearInterval(this.hintInterval);
        }
      }, error => { this.appAlert.showApiError(error); }
    );
  }

  loadHints() {
    this.global.LoadHints(this.global.getCurrentLegalEntityInfo().orgUnitID, this.global.getCurrentBranchInfo().branchID, this.employeeID || '', this.isAdmin).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.showHint = true;
        this.hintList = data;
        setTimeout(() => {
          this.showHint = false; // hide the hint after half a min
        }, 30000);
      }

    });
  }

  ngAfterViewInit() {
    this._zone.runOutsideAngular(() => {
      mApp.init();
      this._mMenu = (<any>$('#m_aside_left')).mMenu();
      window.addEventListener('resize', this._handler);

    });

    setTimeout(() => {
      this.fixToolbarAlert();
    });
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    clearInterval(this._changeDetectionInterval);
    window.removeEventListener('resize', this._handler);

    if (this.hintInterval)
      clearInterval(this.hintInterval);

    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }

  menuItems(checkHasPermit, itemPath) {
    let indqMenuItem;
    const foundItem = this.global.navMenuItems.every((item) => {
      indqMenuItem = item.children.find(childItem => childItem.pageURL.indexOf(itemPath) !== -1);
      if (indqMenuItem)
        return false;
      else
        return true;
    });

    if (checkHasPermit)
      return foundItem;
    else if (indqMenuItem)
      return indqMenuItem.pageURL;
    else
      return false;
  }

  onclickHintButton(referralID) {
    if (this.global.currentApplication?.appCode == 'CMS') {
      let pageURL = this.menuItems(false, "cms/receiveAndTransferTransaction");
      if (pageURL) {
        let url: any = this._router.createUrlTree([pageURL, referralID]);
        url = url + '/0';
        window.open("#" + url.toString(), '_blank');
      }
      else
        window.open("#" + '/401', '_blank');
    }
  }

  close() {
    this.showHint = false;
  }
}
