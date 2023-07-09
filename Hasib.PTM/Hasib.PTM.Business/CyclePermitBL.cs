using Hasib.Core;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hasib.PTM.Model;

namespace Hasib.PTM.Business
{
    public class CyclePermitBL : BaseBL
    {
        CyclePermitModel CyclePermitModel;
        public CyclePermitBL(int sessionId, int actionType) : base(sessionId, actionType)
        {
            CyclePermitModel = new CyclePermitModel(db);
        }
        public async Task<List<CyclePermit>> LoadCyclePermit(int? cycleID)
        {
            try
            {
                return await CyclePermitModel.LoadCyclePermit(cycleID);
            }
            finally
            {
                db.Close();
            }
        }
    }
}
