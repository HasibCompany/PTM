using Hasib.Common.Business.ExceptionHandling;
using Hasib.DBHelpers.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;

namespace Hasib.WIM.API.Controllers.Shared
{
    [Produces("application/json")]
    [Route("Error")]
    public class ErrorController : Controller
    {
        /// <summary>
        /// Catches server side exceptions and logs the to database or log file
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public IActionResult Get()
        {
         Exception exception = new ExceptionHandler().LogServerSideException(HttpContext);

            return StatusCode(StatusCodes.Status500InternalServerError, exception);
        }

        /// <summary>
        ///  Logs client side exceptions to database or log file 
        /// </summary>
        /// <param name="exception">Used to indicate status.</param>
        [HttpPost("LogException")]
        public IActionResult LogException([FromBody] ExceptionDetail exception)
        {
            try
            {
                return Ok(new ExceptionHandler().LogClientSideException(HttpContext, exception));
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e);
            }
        }
    }   

}