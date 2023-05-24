using Hasib.Core;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hasib.PTM.Model;

namespace Hasib.PTM.Business
{
    public class CodesBL : BaseBL
    {
        CodesModel CodesModel;
        public CodesBL(int sessionId, int actionType) : base(sessionId, actionType)
        {
            CodesModel = new CodesModel(db);
        }
        public async Task<List<Codes>> LoadCodes(string codeType)
        {
            try
            {
                return await CodesModel.LoadCodes(codeType);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> DeleteCodes(int? codeID, byte[] rowStamp)
        {
            try
            {
                return await CodesModel.DeleteCodes(codeID, rowStamp);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> UpdateCodes(string codeType, int? codeID, string descriptionAR, string descriptionEN, bool? isActive, bool? isDefault, bool? typeFlag, int? sortOrder, int? modifiedSID, byte[] rowStamp)
        {
            try
            {
                return await CodesModel.UpdateCodes(codeType, codeID, descriptionAR, descriptionEN, isActive, isDefault, typeFlag, sortOrder, modifiedSID, rowStamp);
            }
            finally
            {
                db.Close();
            }
        }

        public async Task<Output> InsertCodes(string codeType, int? code, string descriptionAR, string descriptionEN, bool? isActive, bool? isDefault, bool? typeFlag, int? sortOrder, int? createdSID)
        {
            try
            {
                return await CodesModel.InsertCodes(codeType, code, descriptionAR, descriptionEN, isActive, isDefault, typeFlag, sortOrder, createdSID);
            }
            finally
            {
                db.Close();
            }
        }



    }
}
