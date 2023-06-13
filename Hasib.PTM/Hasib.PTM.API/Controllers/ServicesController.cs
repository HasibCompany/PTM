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
    [Route("api/PTM/Services")]
    [ApiController]
    public class ServicesController : BaseController
    {
        ServicesBL Services { get { return new ServicesBL(SessionId, ActionType); } }
        [HttpGet("LoadServices/{organizationID?}/{serviceID?}")]
        public async Task<ActionResult<List<Services>>> LoadServices([FromQuery] int? organizationID, [FromQuery] int? serviceID)
        {
            var result = await Services.LoadServices(organizationID, serviceID);
            if (result == null)
            {
                return NotFound();
            }
            return result;
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanAdd })]
        [HttpPost("InsertServices")]
        public async Task<ActionResult<Output>> InsertServices([FromBody] Services obj)
        {
            obj.CreatedSID = SessionId;
            return await Services.InsertServices(obj);
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanUpdate })]
        [HttpPut("UpdateServices")]
        public async Task<ActionResult<Output>> UpdateServices([FromBody] Services obj)
        {
            obj.ModifiedSID = SessionId;
            return await Services.UpdateServices(obj);
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanDelete })]
        [HttpPost("DeleteServices")]
        public async Task<ActionResult<Output>> DeleteServices([FromBody] Services obj)
        {
            return await Services.DeleteServices(obj.ServiceID, obj.RowStamp);
        }

        [HttpGet("LoadDataReferenceFound")]
        public ActionResult<bool> LoadDataReferenceFound(string checkValue, string sourceTable, string checkTable, string omitTable)
        {
            return Services.LoadDataReferenceFound(SessionId, checkValue, sourceTable, checkTable, omitTable);
        }
    }
}
