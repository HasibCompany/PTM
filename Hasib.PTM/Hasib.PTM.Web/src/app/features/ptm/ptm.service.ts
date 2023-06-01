//try councurrent checkouts

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Settings } from '@hasib/settings';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
@Injectable()
export class PtmService {
  //private apiUrl = Settings.wimUrl;
  //, public global: Global
  constructor(private http: HttpClient) { }

  //General Codes Screen
  //Main Item Unit
  LoadItemUnit(itemUnitID: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/ItemUnit/LoadItemUnit`;
    return this.http.get(url, { params: { itemUnitID: itemUnitID } });
  }
  InsertItemUnit(obj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/ItemUnit/InsertItemUnit`;
    return this.http.post(url, obj, httpOptions);
  }
  UpdateItemUnit(obj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/ItemUnit/UpdateItemUnit`;
    return this.http.put(url, obj, httpOptions);
  }
  DeleteItemUnit(obj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/ItemUnit/DeleteItemUnit`;
    return this.http.post(url, obj, httpOptions);
  }
  //Packing Unit 
  LoadPackingUnit(packingUnitID: any): Observable<any> {
    let url: string = `${Settings.wimUrl}api/PTM/PackingUnit/LoadPackingUnit`;
    return this.http.get(url, { params: { packingUnitID: packingUnitID } });
  }
  InsertPackingUnit(paramObj: any): Observable<Object> {
    var url = `${Settings.wimUrl}api/WIM/PackingUnit/InsertPackingUnit`;
    return this.http.post(url, paramObj, httpOptions);
  }
  UpdatePackingUnit(paramObj: any): Observable<Object> {
    var url = `${Settings.wimUrl}api/WIM/PackingUnit/UpdatePackingUnit`;
    return this.http.put(url, paramObj, httpOptions);
  }
  DeletePackingUnit(paramObj: any): Observable<Object> {
    var url = `${Settings.wimUrl}api/WIM/PackingUnit/DeletePackingUnit`;
    return this.http.post(url, paramObj, httpOptions);
  }
  //Item Condition
  LoadItemCondition(itemConditionID: any): Observable<any> {
    let url: string = `${Settings.wimUrl}api/WIM/ItemCondition/LoadItemCondition`;
    return this.http.get(url, { params: { itemConditionID: itemConditionID } });
  }
  InsertItemCondition(paramObj: any): Observable<Object> {
    var url = `${Settings.wimUrl}api/WIM/ItemCondition/InsertItemCondition`;
    return this.http.post(url, paramObj, httpOptions);
  }
  UpdateItemCondition(paramObj: any): Observable<Object> {
    var url = `${Settings.wimUrl}api/WIM/ItemCondition/UpdateItemCondition`;
    return this.http.put(url, paramObj, httpOptions);
  }
  DeleteItemCondition(paramObj: any): Observable<Object> {
    var url = `${Settings.wimUrl}api/WIM/ItemCondition/DeleteItemCondition`;
    return this.http.post(url, paramObj, httpOptions);
  }
  //Reasoning
  LoadReasoning(reasonID: any, reasonType: any): Observable<any> {
    let url: string = `${Settings.wimUrl}api/WIM/Reasoning/LoadReasoning`;
    return this.http.get(url, { params: { reasonID: reasonID, reasonType: reasonType } });
  }
  InsertReasoning(paramObj: any): Observable<Object> {
    var url = `${Settings.wimUrl}api/WIM/Reasoning/InsertReasoning`;
    return this.http.post(url, paramObj, httpOptions);
  }
  UpdateReasoning(paramObj: any): Observable<Object> {
    var url = `${Settings.wimUrl}api/WIM/Reasoning/UpdateReasoning`;
    return this.http.put(url, paramObj, httpOptions);
  }
  DeleteReasoning(paramObj: any): Observable<Object> {
    var url = `${Settings.wimUrl}api/WIM/Reasoning/DeleteReasoning`;
    return this.http.post(url, paramObj, httpOptions);
  }
  //Store Type
  LoadStoreType(storeTypeID: any, packageType: any): Observable<any> {
    let url: string = `${Settings.wimUrl}api/WIM/StoreType/LoadStoreType`;
    return this.http.get(url, { params: { storeTypeID: storeTypeID, packageType: packageType } });
  }
  InsertStoreType(paramObj: any): Observable<Object> {
    var url = `${Settings.wimUrl}api/WIM/StoreType/InsertStoreType`;
    return this.http.post(url, paramObj, httpOptions);
  }
  UpdateStoreType(paramObj: any): Observable<Object> {
    var url = `${Settings.wimUrl}api/WIM/StoreType/UpdateStoreType`;
    return this.http.put(url, paramObj, httpOptions);
  }
  DeleteStoreType(paramObj: any): Observable<Object> {
    var url = `${Settings.wimUrl}api/WIM/StoreType/DeleteStoreType`;
    return this.http.post(url, paramObj, httpOptions);
  }

  // Purchaser

  LoadPurchaser(paramsObj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/Purchaser/LoadPurchaser`;
    return this.http.get(url, { params: paramsObj });
  }

  insertPurchaser(paramsObj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/Purchaser/InsertPurchaser`;
    return this.http.post(url, paramsObj, httpOptions);
  }

  updatePurchaser(paramsObj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/Purchaser/UpdatePurchaser`;
    return this.http.put(url, paramsObj, httpOptions);
  }

  deletePurchaser(paramsObj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/Purchaser/DeletePurchaser`;
    return this.http.post(url, paramsObj, httpOptions);
  }

  // Services

  LoadServices(paramsObj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/Services/LoadServices`;
    return this.http.get(url, { params: paramsObj });
  }

  insertServices(paramsObj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/Services/InsertServices`;
    return this.http.post(url, paramsObj, httpOptions);
  }

  updateServices(paramsObj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/Services/UpdateServices`;
    return this.http.put(url, paramsObj, httpOptions);
  }

  deleteServices(paramsObj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/Services/DeleteServices`;
    return this.http.post(url, paramsObj, httpOptions);
  }

  LoadDataReferenceFound(paramsObj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/Services/LoadDataReferenceFound`;
    return this.http.get(url, { params: paramsObj });
  }
  //General Codes
  LoadCodes(codeType: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/Codes/LoadCodes`;
    return this.http.get(url, { params: codeType });
  }
  insertCodes(paramsObj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/Codes/InsertCodes`;
    return this.http.post(url, paramsObj, httpOptions);
  }
  updateCodes(paramsObj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/Codes/UpdateCodes`;
    return this.http.put(url, paramsObj, httpOptions);
  }
  deleteCodes(paramsObj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/Codes/DeleteCodes`;
    return this.http.post(url, paramsObj, httpOptions);
  }
 //settings
 //todo : create a new service for settings
  LoadSettings(paramsObj: any): Observable<any> {
    let url: string = `${Settings.ptmUrl}api/PTM/Settings/LoadSettings`;
    return this.http.get(url, { params: paramsObj });
  }
  UpdateSettings(paramsObj: any): Observable<any> {
let url: string = `${Settings.ptmUrl}api/PTM/Settings/UpdateSettings`;
    return this.http.put(url, paramsObj, httpOptions);
  }
//todo : create updatesettingsbulk service
  UpdateSettingsBulk(paramsObj: any): Observable<any> {
let url: string = `${Settings.ptmUrl}api/PTM/Settings/UpdateSettingsBulk`;
    return this.http.put(url, paramsObj, httpOptions);
  }

}
