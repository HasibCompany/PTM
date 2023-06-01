import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, UserService } from "@hasib/core/auth/services";
import { forkJoin } from 'rxjs';
import { TranslateModule, TranslateService } from '@hasib/core/translate';
import { GeneralCodesComponent } from './generalCodes/generalCodes.component';
import { CanDeactivateGuard } from "@hasib/core/services";

//screens

import { ThemeModule } from '@hasib/theme';
import { HasibUIModule } from "@hasib/ui";
import { HasibCustomUIModule } from "@hasib/ui-custom";
import { PtmComponent } from './ptm.component';
import { PtmService } from './ptm.service';
import { LANG_AR_NAME, LANG_AR_TRANS } from "./_translation/lang-ar";
import { LANG_EN_NAME, LANG_EN_TRANS } from "./_translation/lang-en";
import { SharedService } from '@hasib/shared';
import { CommonBusinessModule } from '@hasib/commonBusiness/commonBusiness.module';
import { PurchasingRepresentativesDefinitionComponent } from "@hasib/features/ptm/purchasingRepresentativesDefinition/purchasingRepresentativesDefinition.component";
import { ServicesDefinitionComponent } from "@hasib/features/ptm/servicesDefinition/servicesDefinition.component";
import { GeneralSystemCodesComponent } from './generalSystemCodes/generalSystemCodes.component';
import { GeneralSettingsComponent } from './generalSettings/generalSettings.component';
import { PurchaseOrderPermitComponent } from './purchaseOrderPermit/purchaseOrderPermit.component';


//#region PTM Version
//###################################################### Critical Part of Code ##############################################################################################
//Do not touch this part of code while developing or designing!
//**************************************************************** Version of PTM Module *************************************************************

//You must change the value of PTM_version in case of produce new release (setup for iis)
//let PTM_version: number = New version number of PTM module;
let ptm_version: number = 7;


//Do not modify the below line !!!
let PTM_version_item: string = "PTM_version={" + ptm_version + "}"; if (PTM_version_item.length) console.log(); //Do not touch this line of code !!!

//****************************************************************************************************************************************************
//###########################################################################################################################################################################
//#endregion



const routes: Routes = [
  {
    path: "",
    component: PtmComponent,
    canActivateChild: [AuthGuard],
    data: { parent: null },
    children: [
      {
        path: 'generalCodes',
        component: GeneralCodesComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'purchasingRepresentativesDefinition',
        component: PurchasingRepresentativesDefinitionComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'servicesDefinition',
        component: ServicesDefinitionComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'generalSystemCodes',
        component: GeneralSystemCodesComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'generalSettings',
        component: GeneralSettingsComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'purchaseOrderPermit',
        component: PurchaseOrderPermitComponent,
        canDeactivate: [CanDeactivateGuard]
      },
    ]
    
  }
];

const componentsArray = [
  //base

  PtmComponent,
  GeneralCodesComponent,
  PurchasingRepresentativesDefinitionComponent,
  ServicesDefinitionComponent,
  GeneralSystemCodesComponent,
  GeneralSettingsComponent,
  PurchaseOrderPermitComponent
];
@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes),
    ThemeModule,
    FormsModule,
    ReactiveFormsModule,
    HasibUIModule,
    HasibCustomUIModule,
    CommonBusinessModule,
    TranslateModule,
  ],
  declarations: componentsArray,
  exports: [
  ],
  providers: [UserService, PtmService],
  
})
export class PtmModule {
  constructor(private sharedService: SharedService) {
    var trans = {
      [LANG_AR_NAME]: LANG_AR_TRANS,
      [LANG_EN_NAME]: LANG_EN_TRANS
    }
    TranslateService.loadTranslations(trans);
    forkJoin([this.sharedService.getClientTranslations("lang-ar.json"), this.sharedService.getClientTranslations("lang-en.json")
    ]).subscribe(value => {
      var trans = {
        [LANG_AR_NAME]: LANG_AR_TRANS,
        [LANG_EN_NAME]: LANG_EN_TRANS,
        client_ar: value[0],
        client_en: value[1]
      }
      TranslateService.loadTranslations(trans);
    });
  }
}
