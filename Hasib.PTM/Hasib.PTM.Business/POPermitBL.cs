using Hasib.Core;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hasib.PTM.Model;
using System;

namespace Hasib.PTM.Business
{
    public class POPermitBL : BaseBL
    {
        POPermitModel POPermitModel;
        public POPermitBL(int sessionId, int actionType) : base(sessionId, actionType)
        {
            POPermitModel = new POPermitModel(db);
        }
        public async Task<List<POPermit>> LoadPOPermit(string screenCode)
        {
            try
            {
                return await POPermitModel.LoadPOPermit(screenCode);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> InsertPOPermit(string screenCode, string permitFor, int? userGroupID, int? administrativePostID, int? professionID, int? userID, decimal fromAmount, decimal toAmount, DateTime? fromDate, DateTime? toDate, bool? isActive, int? createdSID)
        {
            try
            {

                return await POPermitModel.InsertPOPermit(screenCode, permitFor, userGroupID, administrativePostID, professionID, userID, fromAmount, toAmount, fromDate, toDate, isActive, createdSID);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> UpdatePOPermit(int? pOpermitID, string screenCode, string permitFor, int? userGroupID, int? administrativePostID, int? professionID, int? userID, decimal fromAmount, decimal toAmount, DateTime? fromDate, DateTime? toDate, bool? isActive, int? modifiedSID, byte[] rowStamp)
        {
            try
            {
                return await POPermitModel.UpdatePOPermit(pOpermitID, screenCode, permitFor, userGroupID, administrativePostID, professionID, userID, fromAmount, toAmount, fromDate, toDate, isActive, modifiedSID, rowStamp);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> DeletePOPermit(int? pOpermitID, byte[] rowStamp)
        {
            try
            {
                return await POPermitModel.DeletePOPermit(pOpermitID, rowStamp);
            }
            finally
            {
                db.Close();
            }
        }
    }
}
