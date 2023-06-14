using Hasib.Core;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hasib.PTM.Model;
using Hasib.DBHelpers;
using System;
using System.Linq;

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
            Output output = new Output();
            try
            {
                db.BeginTransaction();
                db.SetIsUsed(true);

                if (obj.IsDefault == true)
                {
                    List<Services> ServicesList = await LoadServices(obj.OrganizationID, null);
                    bool foundDefaultService = ServicesList.Where(S => S.IsDefault == true).ToList().Count > 0 ? true : false;

                    if (foundDefaultService)
                    {
                        output.Message = "PTM_ONLY_ONE_SERVICE_IS_ALLOWED";
                        output.Valid = false;
                        return output;
                    }
                }

                output = await ServicesModel.InsertServices(obj.OrganizationID,obj.ServiceNumber, obj.ParentID, obj.DescriptionAR, obj.DescriptionEN,
                    obj.HasChild, obj.IsDefault, obj.AccountID, obj.Price, obj.MinPrice, obj.IsSuspended, obj.CreatedSID);
                if (output.InsertedID <= 0)
                {
                    output.Valid = false;
                    db.RollbackTransaction();
                    return output;
                }
                db.CommitTransaction();
            }
            catch (Exception e)
            {
                throw e;
            }
            finally
            {
                db.SetIsUsed(false);
                db.Close();
            }
            return output;
        }
        public async Task<Output> UpdateServices(Services obj)
        {
            Output output = new Output();
            try
            {
                db.BeginTransaction();
                db.SetIsUsed(true);

                if (obj.IsDefault == true)
                {
                    List<Services> ServicesList = await LoadServices(obj.OrganizationID, null);
                    bool foundDefaultService = ServicesList.Where(S => S.IsDefault == true && S.ServiceID != obj.ServiceID).ToList().Count > 0 ? true : false;

                    if (foundDefaultService)
                    {
                        output.Message = "PTM_ONLY_ONE_SERVICE_IS_ALLOWED";
                        output.Valid = false;
                        return output;
                    }
                }

                output = await ServicesModel.UpdateServices(obj.ServiceID, obj.OrganizationID, obj.LevelSerial, obj.DescriptionAR,
                    obj.DescriptionEN, obj.ParentID, obj.HasChild, obj.LevelOrder, obj.IsDefault, obj.AccountID, obj.Price,
                    obj.MinPrice, obj.IsSuspended, obj.ModifiedSID, obj.RowStamp);
                if (output.AffectedRows <= 0)
                {
                    output.Valid = false;
                    db.RollbackTransaction();
                    return output;
                }
                db.CommitTransaction();
            }
            catch (Exception e)
            {
                throw e;
            }
            finally
            {
                db.SetIsUsed(false);
                db.Close();
            }
            return output;
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
