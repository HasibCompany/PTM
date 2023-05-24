using Hasib.Core;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hasib.PTM.Model;
using System;

namespace Hasib.PTM.Business
{
    public class PurchaserBL : BaseBL
    {
        PurchaserModel PurchaserModel;
        public PurchaserBL(int sessionId, int actionType) : base(sessionId, actionType)
        {
            PurchaserModel = new PurchaserModel(db);
        }
        public async Task<List<Purchaser>> LoadPurchaser(int? purchaserID)
        {
            try
            {
                return await PurchaserModel.LoadPurchaser(purchaserID);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> InsertPurchaser(int? purchaserID, bool? isActive, bool? isDefault, DateTime? fromDate, DateTime? toDate, int? createdSID)
        {
            try
            {
                return await PurchaserModel.InsertPurchaser(purchaserID, isActive, isDefault, fromDate, toDate, createdSID);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> UpdatePurchaser(int? purchaserID, bool? isActive, bool? isDefault, DateTime? fromDate, DateTime? toDate, int? modifiedSID, byte[] rowStamp)
        {
            try
            {
                return await PurchaserModel.UpdatePurchaser(purchaserID, isActive, isDefault, fromDate, toDate, modifiedSID, rowStamp);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> DeletePurchaser(int? purchaserID, byte[] rowStamp)
        {
            try
            {
                return await PurchaserModel.DeletePurchaser(purchaserID, rowStamp);
            }
            finally
            {
                db.Close();
            }
        }
    }
}
