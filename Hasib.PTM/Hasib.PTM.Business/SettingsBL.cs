using Hasib.Core;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hasib.PTM.Model;
using Hasib.Common.Business.Shared;
using Hasib.Common.Business;

namespace Hasib.PTM.Business
{
    public class SettingsBL : BaseBL
    {
        SettingsModel SettingsModel;
        ApplicationBL ApplicationBL;
        OrganizationBL OrganizationBL;
        public SettingsBL(int sessionId, int actionType) : base(sessionId, actionType)
        {
            SettingsModel = new SettingsModel(db);
            ApplicationBL = new ApplicationBL(db);
            OrganizationBL = new OrganizationBL(db);
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
        public async Task<bool> CheckAppActivate(string appCode)
        {
            string organization = null;
            bool IsInstalled = false, IsActive = false;

            var orgData = await OrganizationBL.LoadOrganization(null);
            if (orgData.Count > 0)
            {
                organization = orgData[0].OrganizationCode;
            }
            var appData = await ApplicationBL.LoadApplication(null, appCode, organization);

            if (appData != null && appData.Count > 0)
            {
                IsInstalled = appData[0].IsInstalled;
                IsActive = appData[0].IsActive;
            }
            return (IsInstalled && IsActive);
        }

    }
}
