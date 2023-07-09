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
    [Route("api/PTM/CyclePermit")]
    [ApiController]
    public class CyclePermitController : BaseController
    {
        CyclePermitBL CyclePermit { get { return new CyclePermitBL(SessionId, ActionType); } }
        [HttpGet("LoadCyclePermit/{cycleID?}")]
        public async Task<ActionResult<List<CyclePermit>>> LoadCyclePermit([FromQuery] int? cycleID)
        {
            var result = await CyclePermit.LoadCyclePermit(cycleID);
            if (result == null)
            {
                return NotFound();
            }
            return result;
        }
    }
}
