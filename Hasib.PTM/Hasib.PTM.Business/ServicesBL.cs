using Hasib.Core;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hasib.PTM.Model;
using Hasib.DBHelpers;

namespace Hasib.PTM.Business
{
    public class ServicesBL : BaseBL
    {
        ServicesModel ServicesModel;
        public ServicesBL(int sessionId, int actionType) : base(sessionId, actionType)
        {
            ServicesModel = new ServicesModel(db);
        }
        public async Task<List<Services>> LoadServices(int? organizationID, int? serviceID)
        {
            try
            {
                return await ServicesModel.LoadServices(organizationID, serviceID);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> InsertServices(Services obj)
        {
            try
            {
                return await ServicesModel.InsertServices(obj.OrganizationID, obj.ParentID, obj.DescriptionAR, obj.DescriptionEN,
                    obj.HasChild, obj.IsDefault, obj.AccountID, (decimal)obj.Price, (decimal)obj.MinPrice, obj.IsSuspended, obj.CreatedSID);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> UpdateServices(Services obj)
        {
            try
            {
                return await ServicesModel.UpdateServices(obj.ServiceID, obj.OrganizationID, obj.LevelSerial, obj.DescriptionAR,
                    obj.DescriptionEN, obj.ParentID, obj.HasChild, obj.LevelOrder, obj.IsDefault, obj.AccountID, (decimal)obj.Price,
                    (decimal)obj.MinPrice, obj.IsSuspended, obj.ModifiedSID, obj.RowStamp);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> DeleteServices(int? serviceID, byte[] rowStamp)
        {
            try
            {
                return await ServicesModel.DeleteServices(serviceID, rowStamp);
            }
            finally
            {
                db.Close();
            }
        }

        public bool LoadDataReferenceFound(int? sessionID, string checkValue, string sourceTable, string checkTable, string omitTable)
        {
            bool isUsed = DB.IsDataReferenceFound(sessionID.GetValueOrDefault(), checkValue, sourceTable, checkTable, omitTable);
            return isUsed;
        }
    }
}
