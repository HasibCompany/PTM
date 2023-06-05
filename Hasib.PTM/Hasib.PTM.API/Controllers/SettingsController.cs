using Hasib.Core;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Hasib.PTM.Model;
using Hasib.PTM.Business;

namespace Hasib.PTM.API.Controllers
{
    [Authorize(Roles = "User")]
    [Produces("application/json")]
    [Route("api/PTM/Settings")]
    [ApiController] 
    public class SettingsController : BaseController
    {
        SettingsBL Settings { get { return new SettingsBL(SessionId, ActionType); } }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanUpdate })]
        [HttpPut("UpdateSettings")]
        public async Task<ActionResult<Output>> UpdateSettings([FromBody] Settings obj)
        {
            obj.ModifiedSID = SessionId;
            return await Settings.UpdateSettings(obj.OrganizationID, obj.SettingCode, obj.FieldValue, obj.ModifiedSID, obj.RowStamp);
        }
        //todo: create a method called LoadSettings that calls LoadSettings from the business layer and return list of settings
        [HttpGet("LoadSettings")]
        public async Task<ActionResult<List<Settings>>> LoadSettings(int? organizationID, string settingCode, int? createdSID)
        {
            createdSID= SessionId;
            return await Settings.LoadSettings(organizationID, settingCode, createdSID);
        }
        //todo: create a method called UpdateSettingsBulk that takes 1 parametes : settings object and calls UpdateSettingsBulk from the business layer and return output
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanUpdate })]
        [HttpPut("UpdateSettingsBulk")]
        public async Task<ActionResult<Output>> UpdateSettingsBulk([FromBody] Settings obj)
        {
            obj.ModifiedSID= SessionId;
            return await Settings.UpdateSettingsBulk(obj);
        }
        [HttpGet("CheckAppActivate")]
        public async Task<ActionResult<bool>> CheckAppActivate(string appCode)
        {
            return await Settings.CheckAppActivate(appCode);
        }
    }

}
