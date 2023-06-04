using Hasib.Core;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hasib.PTM.Model;
namespace Hasib.PTM.Business
{
    public class SettingsBL : BaseBL
    {
        SettingsModel SettingsModel;
        public SettingsBL(int sessionId, int actionType) : base(sessionId, actionType)
        {
            SettingsModel = new SettingsModel(db);
        }
        //todo: create a method called LoadSettings that calls load settings from the model and return list of settings
        public async Task<List<Settings>> LoadSettings(int? organizationID, string settingCode, int? createdSID)
        {
            try
            {
                return await SettingsModel.LoadSettings(organizationID, settingCode, createdSID);
            }
            finally
            {
                db.Close();
            }
        }
        //todo: create a method called UpdateSettingsBulk that takes 1 parametes : settings object and calls UpdateSettingsBulk from the model and return output
        public async Task<Output> UpdateSettingsBulk(Settings settings)
        {
            try
            {
                return await SettingsModel.UpdateSettingsBulk(settings);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> UpdateSettings(int? organizationID, string settingCode, string fieldValue, int? modifiedSID, byte[] rowStamp)
        {
            try
            {
                return await SettingsModel.UpdateSettings(organizationID, settingCode, fieldValue, modifiedSID, rowStamp);
            }
            finally
            {
                db.Close();
            }
        }
    }
}
