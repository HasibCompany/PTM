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
        public async Task<Output> InsertServices(int? organizationID, int? parentID, string descriptionAR, string descriptionEN, bool? hasChild, int? createdSID)
        {
            try
            {
                return await ServicesModel.InsertServices(organizationID, parentID, descriptionAR, descriptionEN, hasChild, createdSID);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> UpdateServices(int? serviceID, short? levelSerial, string descriptionAR, string descriptionEN, int? parentID, bool? hasChild, short? levelOrder, int? modifiedSID, byte[] rowStamp)
        {
            try
            {
                return await ServicesModel.UpdateServices(serviceID, levelSerial, descriptionAR, descriptionEN, parentID, hasChild, levelOrder, modifiedSID, rowStamp);
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
