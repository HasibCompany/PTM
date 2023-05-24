using Hasib.Core;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hasib.Common.Business.Shared;
using Hasib.Common.Model.Shared;

namespace Hasib.PTM.Business.Shared
{
    public class LookupBL : BaseBL
    {
        Hasib.Common.Business.Shared.LookupBL CommonLookupBL;
        public LookupBL(int sessionId) : base(sessionId)
        {
            CommonLookupBL = new Hasib.Common.Business.Shared.LookupBL(sessionId);

        }
        public async Task<List<object>> LoadLookup(string type, string delimiter, string paramsNames, string paramsValues)
        {
            try
            {

                LookupInfo lookupInfo = LookupHelpers.convertToLookupInfo(type, delimiter, paramsNames, paramsValues);
                switch (type)
                {
                    //------------

                    default:
                        {
                            return await CommonLookupBL.LoadLookup(lookupInfo);
                        }
                }
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> InsertUserFavoriteObj(int? userID, UserFavoriteObj obj)
        {
            try
            {
                switch (obj.type)
                {

                    default:
                        {
                            obj.UserID = userID;
                            return await CommonLookupBL.InsertUserFavoriteObj(obj);
                        }
                }
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> DeleteUserFavoriteObj(UserFavoriteObj obj)
        {
            try
            {
                switch (obj.type)
                {
                    default:
                        {
                            return await CommonLookupBL.DeleteUserFavoriteObj(obj);
                        }
                }
            }
            finally
            {
                db.Close();
            }
        }
    }
}

