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
    [Route("api/PTM/Purchaser")]
    [ApiController]
    public class PurchaserController : BaseController
    {
        PurchaserBL Purchaser { get { return new PurchaserBL(SessionId, ActionType); } }
        [HttpGet("LoadPurchaser/{purchaserID?}")]
        public async Task<ActionResult<List<Purchaser>>> LoadPurchaser([FromQuery] int? purchaserID)
        {
            var result = await Purchaser.LoadPurchaser(purchaserID);
            if (result == null)
            {
                return NotFound();
            }
            return result;
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanAdd })]
        [HttpPost("InsertPurchaser")]
        public async Task<ActionResult<Output>> InsertPurchaser([FromBody] Purchaser obj)
        {
            return await Purchaser.InsertPurchaser(obj.PurchaserID, obj.IsActive, obj.IsDefault, obj.FromDate, obj.ToDate, SessionId);
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanUpdate })]
        [HttpPut("UpdatePurchaser")]
        public async Task<ActionResult<Output>> UpdatePurchaser([FromBody] Purchaser obj)
        {
            return await Purchaser.UpdatePurchaser(obj.PurchaserID, obj.IsActive, obj.IsDefault, obj.FromDate, obj.ToDate, SessionId, obj.RowStamp);
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanDelete })]
        [HttpPost("DeletePurchaser")]
        public async Task<ActionResult<Output>> DeletePurchaser([FromBody] Purchaser obj)
        {
            return await Purchaser.DeletePurchaser(obj.PurchaserID, obj.RowStamp);
        }
    }
}
