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
    [Route("api/PTM/CycleSettings")]
    [ApiController]
    public class CycleSettingsController : BaseController
    {
        CycleSettingsBL CycleSettings { get { return new CycleSettingsBL(SessionId, ActionType); } }
        [HttpGet("LoadCycleSettings/{cycleID?}/{settingCode?}/{createdSID?}")]
        public async Task<ActionResult<List<CycleSettings>>> LoadCycleSettings([FromQuery] int? cycleID, [FromQuery] string settingCode, [FromQuery] int? createdSID)
        {
            var result = await CycleSettings.LoadCycleSettings(cycleID, settingCode, createdSID);
            if (result == null)
            {
                return NotFound();
            }
            return result;
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanUpdate })]
        [HttpPut("UpdateCycleSettings")]
        public async Task<ActionResult<Output>> UpdateCycleSettings([FromBody] CycleSettings obj)
        {
            return await CycleSettings.UpdateCycleSettings(obj.CycleID, obj.SettingCode, obj.FieldValue, obj.ModifiedSID, obj.RowStamp);
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanDelete })]
        [HttpPost("DeleteCycleSettings")]
        public async Task<ActionResult<Output>> DeleteCycleSettings([FromBody] CycleSettings obj)
        {
            return await CycleSettings.DeleteCycleSettings(obj.CycleID, obj.RowStamp);
        }

    }
}
