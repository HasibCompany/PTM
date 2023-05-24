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
    [Route("api/PTM/Codes")]
    [ApiController]
    public class CodesController : BaseController
    {
        CodesBL Codes { get { return new CodesBL(SessionId, ActionType); } }
        [HttpGet("LoadCodes/{codeType?}")]
        public async Task<ActionResult<List<Codes>>> LoadCodes([FromQuery] string codeType)
        {
            var result = await Codes.LoadCodes(codeType);
            if (result == null)
            {
                return NotFound();
            }
            return result;
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanDelete })]
        [HttpPost("DeleteCodes")]
        public async Task<ActionResult<Output>> DeleteCodes([FromBody] Codes obj)
        {
            return await Codes.DeleteCodes(obj.CodeID, obj.RowStamp);
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanUpdate })]
        [HttpPut("UpdateCodes")]
        public async Task<ActionResult<Output>> UpdateCodes([FromBody] Codes obj)
        {
            obj.ModifiedSID = SessionId;
            return await Codes.UpdateCodes(obj.CodeType, obj.CodeID, obj.DescriptionAR, obj.DescriptionEN, obj.IsActive, obj.IsDefault, obj.TypeFlag, obj.SortOrder, obj.ModifiedSID, obj.RowStamp);
        }

        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanAdd })]
        [HttpPost("InsertCodes")]
        public async Task<ActionResult<Output>> InsertCodes([FromBody] Codes obj)
        {
            obj.CreatedSID = SessionId;
            return await Codes.InsertCodes(obj.CodeType, obj.Code, obj.DescriptionAR, obj.DescriptionEN, obj.IsActive, obj.IsDefault, obj.TypeFlag, obj.SortOrder, obj.CreatedSID);
        }

    }
}
