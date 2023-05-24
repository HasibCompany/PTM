using Hasib.Core;
using Hasib.PTM.Business.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hasib.Common.Model.Shared;
using Hasib.Common.Business;

namespace Hasib.PTM.API.Controllers.Shared
{
#if !TEST_BY_CLIENT
    [Authorize(Roles = "User")]
#endif
    [Produces("application/json")]
    public class LookupController : BaseController
    {
        LookupBL LookupBL { get { return new LookupBL(SessionId); } }
        [HttpGet]
        [Route("api/PTM/Shared/Lookup/LoadLookup")]
        public async Task<ActionResult<List<object>>> LoadLookup(string type, string delimiter, string paramsNames, string values)
        {
            try
            {
                var result = await LookupBL.LoadLookup(type, delimiter, paramsNames, values);

                return Ok(result);
            }
            catch (Exception ex)
            {
                //If you get an exception, make sure you're passing searchParams with the expected type in lookupBL.cs
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanAdd })]
        [HttpPost("api/PTM/Shared/Lookup/InsertUserFavoriteObj")]
        public async Task<ActionResult<Output>> InsertUserFavoriteObj([FromBody] UserFavoriteObj obj)
        {
            return await LookupBL.InsertUserFavoriteObj( CurrentUserID, obj);
        }

        [TypeFilter(typeof(AuthourizationActionFilter), Arguments = new object[] { ActionFlagEnum.CanDelete })]
        [HttpPost("api/PTM/Shared/Lookup/DeleteUserFavoriteObj")]
        public async Task<ActionResult<Output>> DeleteUserFavoriteObj([FromBody] UserFavoriteObj obj)
        {
            return await LookupBL.DeleteUserFavoriteObj(obj);
        }

    }
}
