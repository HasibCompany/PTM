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
    [Route("api/PTM/POPermit")]
    [ApiController]
    public class POPermitController : BaseController
    {
        POPermitBL POPermit { get { return new POPermitBL(SessionId, ActionType); } }
        [HttpGet("LoadPOPermit/{screenCode?}")]
        public async Task<ActionResult<List<POPermit>>> LoadPOPermit([FromQuery] string screenCode)
        {
            var result = await POPermit.LoadPOPermit(screenCode);
            if (result == null)
            {
                return NotFound();
            }
            return result;
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanAdd })]
        [HttpPost("InsertPOPermit")]
        public async Task<ActionResult<Output>> InsertPOPermit([FromBody] POPermit obj)
        {
            return await POPermit.InsertPOPermit(obj.ScreenCode, obj.PermitFor, obj.UserGroupID, obj.AdministrativePostID, obj.ProfessionID, obj.UserID, obj.FromAmount, obj.ToAmount, obj.FromDate, obj.ToDate, obj.IsActive, SessionId);
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanUpdate })]
        [HttpPut("UpdatePOPermit")]
        public async Task<ActionResult<Output>> UpdatePOPermit([FromBody] POPermit obj)
        {
            return await POPermit.UpdatePOPermit(obj.POpermitID, obj.ScreenCode, obj.PermitFor, obj.UserGroupID, obj.AdministrativePostID, obj.ProfessionID, obj.UserID, obj.FromAmount, obj.ToAmount, obj.FromDate, obj.ToDate, obj.IsActive, SessionId, obj.RowStamp);
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanDelete })]
        [HttpPost("DeletePOPermit")]
        public async Task<ActionResult<Output>> DeletePOPermit([FromBody] POPermit obj)
        {
            return await POPermit.DeletePOPermit(obj.POpermitID, obj.RowStamp);
        }
    }
}
