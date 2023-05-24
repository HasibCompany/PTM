using DevExpress.Compatibility.System.Web;
using DevExpress.DataAccess.ConnectionParameters;
using DevExpress.DataAccess.Sql;
using DevExpress.XtraReports.Web.ReportDesigner;
using Hasib.Common.Business.ReportConfig;
using Hasib.Common.Model.Shared;
using Hasib.Core;
using Hasib.Library.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace Hasib.WIM.API.Controllers.Shared
{
  [Route("api/ReportDesigner")]
  public class ReportDesignerController : BaseController
  {
    [HttpPost("GetReportDesignerModel")]
    public async Task<object> GetReportDesignerModel(string reportUrl)
    {
      object reportDesignerObj = new object();
      ReportParams reportParm = new ReportParams();
      if (!string.IsNullOrWhiteSpace(reportUrl))
      {
        #region Get SessionID.
        //var handler = new JwtSecurityTokenHandler();
        //var authorization = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
        var token = TokenSecuirty.GetToken(HttpContext.Request.Headers[HeaderNames.Authorization].ToString());//handler.ReadToken(authorization.Substring("Bearer ".Length)) as JwtSecurityToken;
        int sessionId = int.Parse(token.Claims.First(claim => claim.Type == JwtRegisteredClaimNames.Sid).Value);
        #endregion
        ReportHandlerBL reportHandlerBL = new ReportHandlerBL(sessionId);
        reportParm = JsonConvert.DeserializeObject<ReportParams>(reportUrl);
        if (!reportParm.ReportCatalogID.HasValue)
          return reportDesignerObj;
        Dictionary<string, object> dataSources = new Dictionary<string, object>();
        #region Handle Dynamic DataBase.
        MsSqlConnectionParameters dataConnectionParametersBase = reportHandlerBL.GetSqlConnectionParameters(reportParm.Connection);
        #endregion

        #region Handle Report Designer Stored.
        try
        {
          ReportCatalog reportCatalog = (await reportHandlerBL.LoadReportCatalog(reportParm.ReportCatalogID, "WIM", true)).FirstOrDefault();
          if (reportCatalog != null)
          {
            string reportDisplayName = reportParm.Language == "ar" ? reportCatalog.ReportNameAR : reportCatalog.ReportNameEN;
            #region Stored Proc Handling.
            SqlDataSource dataSource = new SqlDataSource(dataConnectionParametersBase);
            StoredProcQuery storedProcQuery = new StoredProcQuery();
            storedProcQuery.Name = reportDisplayName;
            storedProcQuery.StoredProcName = reportCatalog.SpName;

            #region Dynamic params.
            foreach (var param in reportCatalog.ReportCatalogParams)
            {
              QueryParameter queryParameter = new QueryParameter("@" + param.ParamName, (Type)Type.GetType(param.ParamType), null);
              storedProcQuery.Parameters.Add(queryParameter);
            } 
            #endregion

            #region Static params.
            QueryParameter arabicParameter = new QueryParameter("@isArabic", typeof(bool), (reportParm.Language == "ar" ? true : false));
            storedProcQuery.Parameters.Add(arabicParameter);
            storedProcQuery.Parameters.Add(new QueryParameter("@getData", typeof(bool), false)); 
            #endregion

            dataSource.Queries.Add(storedProcQuery);
            dataSource.RebuildResultSchema();
            dataSource.Fill();
            #endregion
            dataSources.Add(reportDisplayName, dataSource);

            string reportParams = string.Empty;
            if (reportParm.ReportID.HasValue)
              reportParams = JsonConvert.SerializeObject(new ReportParams() { ReportID = reportParm.ReportID, StorageType = StorageType.DB, IsDesigner = true, Connection = reportParm.Connection, Language = reportParm.Language });
            string modelJsonScript = new ReportDesignerClientSideModelGenerator(HttpContext.RequestServices).GetJsonModelScript(reportParams, dataSources, "/DXXRD", "/DXXRDV", "/DXXQB");
            reportDesignerObj = new JavaScriptSerializer().Deserialize<object>(modelJsonScript);
          }
        }
        catch (Exception ex)
        {
          throw ex;
        }
        #endregion
      }
      return reportDesignerObj;
    }

  }
}
