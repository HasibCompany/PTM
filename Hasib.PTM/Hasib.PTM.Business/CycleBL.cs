using Hasib.Core;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hasib.PTM.Model;

namespace Hasib.PTM.Business
{
    public class CycleBL : BaseBL
    {
        CycleModel CycleModel;
        public CycleBL(int sessionId, int actionType) : base(sessionId, actionType)
        {
            CycleModel = new CycleModel(db);
        }
        public async Task<List<Cycle>> LoadCycle(int? organizationID, int? cycleID)
        {
            try
            {
                return await CycleModel.LoadCycle(organizationID, cycleID);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> InsertCycle(int? organizationID, string descriptionAR, string descriptionEN, string contractMethod, bool? purchaseOrTender, decimal minAmount, decimal maxAmount, bool? buyKnownItem, bool? buyUnkownItem, bool? buyService, bool? enableWorkflow, bool? allowAllUsers, bool? allowAllPurchasers, bool? doCostEstimate, bool? isDefault, bool? isActive, int? createdSID)
        {
            try
            {
                return await CycleModel.InsertCycle(organizationID, descriptionAR, descriptionEN, contractMethod, purchaseOrTender, minAmount, maxAmount, buyKnownItem, buyUnkownItem, buyService, enableWorkflow, allowAllUsers, allowAllPurchasers, doCostEstimate, isDefault, isActive, createdSID);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> UpdateCycle(int? cycleID, int? organizationID, string descriptionAR, string descriptionEN, string contractMethod, bool? purchaseOrTender, decimal minAmount, decimal maxAmount, bool? buyKnownItem, bool? buyUnkownItem, bool? buyService, bool? enableWorkflow, bool? allowAllUsers, bool? allowAllPurchasers, bool? doCostEstimate, bool? isDefault, bool? isActive, int? modifiedSID, byte[] rowStamp)
        {
            try
            {
                return await CycleModel.UpdateCycle(cycleID, organizationID, descriptionAR, descriptionEN, contractMethod, purchaseOrTender, minAmount, maxAmount, buyKnownItem, buyUnkownItem, buyService, enableWorkflow, allowAllUsers, allowAllPurchasers, doCostEstimate, isDefault, isActive, modifiedSID, rowStamp);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> DeleteCycle(int? cycleID, byte[] rowStamp)
        {
            try
            {
                return await CycleModel.DeleteCycle(cycleID, rowStamp);
            }
            finally
            {
                db.Close();
            }
        }

    }
}
