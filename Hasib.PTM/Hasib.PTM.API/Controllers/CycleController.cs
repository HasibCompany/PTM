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
    [Route("api/PTM/Cycle")]
    [ApiController]
    public class CycleController : BaseController
    {
        CycleBL Cycle { get { return new CycleBL(SessionId, ActionType); } }
        [HttpGet("LoadCycle/{organizationID?}/{cycleID?}")]
        public async Task<ActionResult<List<Cycle>>> LoadCycle([FromQuery] int? organizationID, [FromQuery] int? cycleID)
        {
            var result = await Cycle.LoadCycle(organizationID, cycleID);
            if (result == null)
            {
                return NotFound();
            }
            return result;
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanAdd })]
        [HttpPost("InsertCycle")]
        public async Task<ActionResult<Output>> InsertCycle([FromBody] Cycle obj)
        {
            return await Cycle.InsertCycle(obj.OrganizationID, obj.DescriptionAR, obj.DescriptionEN, obj.ContractMethod, obj.PurchaseOrTender, obj.MinAmount, obj.MaxAmount, obj.BuyKnownItem, obj.BuyUnkownItem, obj.BuyService, obj.EnableWorkflow, obj.AllowAllUsers, obj.AllowAllPurchasers, obj.DoCostEstimate, obj.IsDefault, obj.IsActive, obj.CreatedSID);
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanUpdate })]
        [HttpPut("UpdateCycle")]
        public async Task<ActionResult<Output>> UpdateCycle([FromBody] Cycle obj)
        {
            return await Cycle.UpdateCycle(obj.CycleID, obj.OrganizationID, obj.DescriptionAR, obj.DescriptionEN, obj.ContractMethod, obj.PurchaseOrTender, obj.MinAmount, obj.MaxAmount, obj.BuyKnownItem, obj.BuyUnkownItem, obj.BuyService, obj.EnableWorkflow, obj.AllowAllUsers, obj.AllowAllPurchasers, obj.DoCostEstimate, obj.IsDefault, obj.IsActive, obj.ModifiedSID, obj.RowStamp);
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanDelete })]
        [HttpPost("DeleteCycle")]
        public async Task<ActionResult<Output>> DeleteCycle([FromBody] Cycle obj)
        {
            return await Cycle.DeleteCycle(obj.CycleID, obj.RowStamp);
        }

    }
}
