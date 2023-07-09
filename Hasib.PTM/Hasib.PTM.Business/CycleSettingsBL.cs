using Hasib.Core;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hasib.PTM.Model;

namespace Hasib.PTM.Business
{
    public class CycleSettingsBL : BaseBL
    {
        CycleSettingsModel CycleSettingsModel;
        public CycleSettingsBL(int sessionId, int actionType) : base(sessionId, actionType)
        {
            CycleSettingsModel = new CycleSettingsModel(db);
        }
        public async Task<List<CycleSettings>> LoadCycleSettings(int? cycleID, string settingCode, int? createdSID)
        {
            try
            {
                return await CycleSettingsModel.LoadCycleSettings(cycleID, settingCode, createdSID);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> UpdateCycleSettings(int? cycleID, string settingCode, string fieldValue, int? modifiedSID, byte[] rowStamp)
        {
            try
            {
                return await CycleSettingsModel.UpdateCycleSettings(cycleID, settingCode, fieldValue, modifiedSID, rowStamp);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> DeleteCycleSettings(int? cycleID, byte[] rowStamp)
        {
            try
            {
                return await CycleSettingsModel.DeleteCycleSettings(cycleID, rowStamp);
            }
            finally
            {
                db.Close();
            }
        }

    }
}
