import { NgModule } from '@angular/core';
import { FeaturesComponent } from './features.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "@hasib/core/auth/services";
import { CanDeactivateGuard } from "@hasib/core/services";
import { IndexComponent, ErrorComponent, NotFoundComponent, UnAuthorizedComponent, NotActiveComponent, NotInstalledComponent, ProfileComponent } from '@hasib/theme';



const routes: Routes = [
  {
    "path": "",
    "component": FeaturesComponent,
    "canActivate": [AuthGuard],
    "canDeactivate": [CanDeactivateGuard],
    "children": [
      /*non-fullscreen screens*/
      { path: 'ptm', canActivateChild: [AuthGuard], 'loadChildren': () => import('./ptm/ptm.module').then(m => m.PtmModule) },
      //{ path: 'ssm', canActivateChild: [AuthGuard], 'loadChildren': () => import('./ssm/ssm.module').then(m => m.SsmModule) },
      //{ path: 'PTM', canActivateChild: [AuthGuard], 'loadChildren': () => import('./PTM/PTM.module').then(m => m.PTMModule) },
      //{ path: 'fam', canActivateChild: [AuthGuard], 'loadChildren': () => import('./fam/fam.module').then(m => m.FamModule) },
      //{ path: 'cms', canActivateChild: [AuthGuard], 'loadChildren': () => import('./cms/cms.module').then(m => m.CmsModule) },
      //{ path: 'far', canActivateChild: [AuthGuard], 'loadChildren': () => import('./far/far.module').then(m => m.FarModule) },
      //{ path: 'fap', canActivateChild: [AuthGuard], 'loadChildren': () => import('./fap/fap.module').then(m => m.FapModule) },
      //{ path: 'fpc', canActivateChild: [AuthGuard], 'loadChildren': () => import('./fpc/fpc.module').then(m => m.FpcModule) },
      //{ path: 'vms', canActivateChild: [AuthGuard], 'loadChildren': () => import('./vms/vms.module').then(m => m.VmsModule) },
      //{ path: 'wim', canActivateChild: [AuthGuard], 'loadChildren': () => import('./wim/wim.module').then(m => m.WimModule) },
      //{ path: 'hfb', canActivateChild: [AuthGuard], 'loadChildren': () => import('./hfb/hfb.module').then(m => m.HfbModule) },
      //{ path: 'hrm', canActivateChild: [AuthGuard], 'loadChildren': () => import('./hrm/hrm.module').then(m => m.HrmModule) },
      //{ path: 'atd', canActivateChild: [AuthGuard], 'loadChildren': () => import('./atd/atd.module').then(m => m.AtdModule) },
      //{ path: 'ctm', canActivateChild: [AuthGuard], 'loadChildren': () => import('./ctm/ctm.module').then(m => m.CtmModule) },
      //{ path: 'evl', canActivateChild: [AuthGuard], 'loadChildren': () => import('./evl/evl.module').then(m => m.EvlModule) },
      //{ path: 'fbd', canActivateChild: [AuthGuard], 'loadChildren': () => import('./fbd/fbd.module').then(m => m.FbdModule) },
      //{ path: 'fbr', canActivateChild: [AuthGuard], 'loadChildren': () => import('./fbr/fbr.module').then(m => m.FbrModule) },
      //{ path: 'prl', canActivateChild: [AuthGuard], 'loadChildren': () => import('./prl/prl.module').then(m => m.PrlModule) },
      //{ path: 'ptm', canActivateChild: [AuthGuard], 'loadChildren': () => import('./ptm/ptm.module').then(m => m.PtmModule) },
      //{ path: 'rms', canActivateChild: [AuthGuard], 'loadChildren': () => import('./rms/rms.module').then(m => m.RmsModule) },
      //{ path: 'sal', canActivateChild: [AuthGuard], 'loadChildren': () => import('./sal/sal.module').then(m => m.SalModule) },
      //{ path: 'stm', canActivateChild: [AuthGuard], 'loadChildren': () => import('./stm/stm.module').then(m => m.StmModule) },
      //{ path: 'tms', canActivateChild: [AuthGuard], 'loadChildren': () => import('./tms/tms.module').then(m => m.TmsModule) },
      { path: 'index', component: IndexComponent, data: { isDefault: true } },
      { path: 'error', component: ErrorComponent, data: { isDefault: true } },
      { path: 'profile', component: ProfileComponent, data: { isDefault: true } },
      { path: 'notActive', component: NotActiveComponent, data: { isDefault: true } },
      { path: 'notInstalled', component: NotInstalledComponent, data: { isDefault: true } },
      { path: '401', redirectTo: '/401' },
      { path: '**', redirectTo: '/404', pathMatch: 'full' },

    ]
  },
  /*fullscreen screens*/
  { path: '401', component: UnAuthorizedComponent },
  { path: '404', component: NotFoundComponent },
  { path: 'notActive', component: NotActiveComponent },
  { path: 'notInstalled', component: NotInstalledComponent },


];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class FeaturesRoutingModule {

}
