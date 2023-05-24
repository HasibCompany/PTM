using DevExpress.Compatibility.System.Web;
using DevExpress.DataAccess.ConnectionParameters;
using DevExpress.XtraPrinting;
using DevExpress.XtraReports.UI;
using DevExpress.XtraReports.Web.Extensions;
using Hasib.Common.Business.ReportConfig;
using Hasib.Core;
using Hasib.DBHelpers;
using Hasib.PTM.Business.ReportConfig.Reources;
using Hasib.Library.DBHelpers.Models;
using Hasib.Library.Utilities;
using Hasib.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Drawing.Imaging;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Text;

namespace Hasib.PTM.Business.ReportConfig
{
    [Authorize(Roles = "User")]
    public class HasibReportStorage : ReportStorageWebExtension
    {
        private readonly AppSettingsData.KeyValue[] _connectionStrings;
        private readonly IHttpContextAccessor _iContextAccessor;
        private readonly IWebHostEnvironment _iHostingEnvironment;
        private ReportStorage _reportStorage;
        public Dictionary<string, XtraReport> Reports = new Dictionary<string, XtraReport>();

        public HasibReportStorage(AppSettingsData.KeyValue[] connectionStrings, IHttpContextAccessor iContextAccessor, IWebHostEnvironment iHostingEnvironment)
        {
            _connectionStrings = connectionStrings;
            _iContextAccessor = iContextAccessor;
            _iHostingEnvironment = iHostingEnvironment;
            _reportStorage = new ReportStorage(common_ar.ResourceManager, common_en.ResourceManager);
        }
        public XtraReport GetReportData(string reportName, string language, string template, string Orientation, string fontName, string color, string moduleName, string reportTile, string userName, string connection, int sessionId, int userId, int orgUnitId, Dictionary<string, string> parameters)
        {
            var headerReportName = "HasibHeader.repx";
            var footerReportName = "HasibFooter.repx";

            var header = System.IO.Path.Combine(_iHostingEnvironment.ContentRootPath, "ReportTemplate", headerReportName);
            var footer = System.IO.Path.Combine(_iHostingEnvironment.ContentRootPath, "ReportTemplate", footerReportName);

            Type objType = Type.GetType(string.Format("Hasib.PTM.Business.Reports.{0}", reportName));
            object obj = Activator.CreateInstance(objType);
            var reportInst = (XtraReport)obj;

            ////////////export options///////////

            //reportInst.ExportOptions.SetOptionVisibility(DevExpress.XtraPrinting.ExportOptionKind.TextExportMode,false);
            //reportInst.ExportOptions.Csv.ExportMode = DocxExportMode.;
            reportInst.ExportOptions.Docx.ExportPageBreaks = true;
            reportInst.ExportOptions.Image.ExportMode = ImageExportMode.DifferentFiles;
            reportInst.ExportOptions.Image.Format = ImageFormat.Tiff;
            reportInst.ExportOptions.Xlsx.TextExportMode = TextExportMode.Text;
            reportInst.ExportOptions.Csv.Encoding = Encoding.UTF8;
            reportInst.ExportOptions.Xls.RightToLeftDocument = language == "ar" ? DevExpress.Utils.DefaultBoolean.True : DevExpress.Utils.DefaultBoolean.False;
            reportInst.ExportOptions.Xlsx.RightToLeftDocument = language == "ar" ? DevExpress.Utils.DefaultBoolean.True : DevExpress.Utils.DefaultBoolean.False;
            reportInst.ReportPrintOptions.PrintOnEmptyDataSource = false;

            ///////////sql data source//////////// 

            //List<IConfigurationSection> connectionStrings = _configuration.GetSection("ConnectionStrings").GetChildren().ToList();
            var encryptedConnection = _connectionStrings.Where(o => o.key == connection).First();

            byte[] cipher = Convert.FromBase64String(encryptedConnection.value);
            string connectionString = Security.Decrypt(cipher, Security.GetSecurityKey());

            switch (DB.DatabaseProvider)
            {
                case "SQL":
                    var builder = new SqlConnectionStringBuilder(connectionString);
                    var sqlConnection = new SqlConnection(builder.ToString().Replace(@"\\", @"\"));
                    var sqlConnectionStringBuilder = new SqlConnectionStringBuilder(sqlConnection.ConnectionString);
                    var dataConnectionParametersBase = new MsSqlConnectionParameters
                    {
                        ServerName = sqlConnectionStringBuilder.DataSource,
                        DatabaseName = sqlConnectionStringBuilder.InitialCatalog,
                        UserName = sqlConnectionStringBuilder.UserID,
                        Password = sqlConnectionStringBuilder.Password,
                        AuthorizationType = sqlConnectionStringBuilder.IntegratedSecurity ? MsSqlAuthorizationType.Windows : MsSqlAuthorizationType.SqlServer
                    };

                    if (reportInst.DataSource != null)
                    {
                        _reportStorage.SetReportDataSource(reportInst, dataConnectionParametersBase);
                    }

                    _reportStorage.SetReportDataSourceDetails(reportInst, dataConnectionParametersBase);
                    break;
                case "Oracle":
                    break;
            }

            ///////////////////////

            foreach (var param in reportInst.Parameters)
            {
                if (param.Name == "userId")
                    param.Value = userId;

                if (param.Name == "language")
                    param.Value = language;

                if (param.Name == "color")
                    param.Value = color;

                if (parameters.ContainsKey(param.Name))
                {
                    if (parameters[param.Name] == null)
                    {
                        param.Type = typeof(object);
                        param.Value = DBNull.Value;
                    }
                    else
                    {
                        param.Value = parameters[param.Name];
                    }
                }
            }
            _reportStorage.InitializeReport(header, footer, Orientation, fontName, color, moduleName, reportTile, userName, language, sessionId, orgUnitId, reportInst);

            return reportInst;
        }
        public override byte[] GetData(string url)
        {
            if (!string.IsNullOrWhiteSpace(url) && url != "undefined")
            {
                //var handler = new JwtSecurityTokenHandler();
                //var authorization = _iContextAccessor.HttpContext.Request.Headers["Authorization"].FirstOrDefault();
                var token = TokenSecuirty.GetToken(_iContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization].ToString());//handler.ReadToken(authorization.Substring("Bearer ".Length)) as JwtSecurityToken;
                int sessionId = int.Parse(token.Claims.First(claim => claim.Type == JwtRegisteredClaimNames.Sid).Value);
                int userId = int.Parse(token.Claims.First(claim => claim.Type == "UserID").Value);

                ReportParams _url = new JavaScriptSerializer().Deserialize<ReportParams>(url);
                //_url.Token = "Bearer " + _url.Token;
                XtraReport _report;

                if (_url.StorageType == StorageType.DB)
                {
                    if (_url.IsDesigner)
                    {
                        _report = _reportStorage.GetDataBaseReportDesigner(sessionId, _url.ReportID, _url.Connection, _url.Language == "ar" ? false : true, _url.BusinessID);
                    }
                    else
                    {
                        var parameters = new JavaScriptSerializer().Deserialize<Dictionary<string, string>>(_url.Parameter);
                        _report = _reportStorage.GetDataBaseReport(sessionId, _url.ReportID, _url.Connection, _url.Language == "ar" ? true : false, _url.BusinessID, _url.BusinessType, parameters);
                    }
                }
                else
                {
                    var parameters = new JavaScriptSerializer().Deserialize<Dictionary<string, string>>(_url.Parameter);
                    _report = GetReportData(_url.ReportName, _url.Language, _url.Template, _url.Orientation, _url.FontType, _url.Color, _url.ModuleName, _url.ReportTileTxt, _url.UserName, _url.Connection, sessionId, userId, _url.OrganizaionUnitId.Value, parameters);
                }

                using (MemoryStream stream = new MemoryStream())
                {
                    _report.SaveLayoutToXml(stream);
                    return stream.ToArray();
                }
            }
            else
            {
                XtraReport empty = new XtraReport();
                using (MemoryStream stream = new MemoryStream())
                {
                    empty.SaveLayoutToXml(stream);
                    return stream.ToArray();
                }
            }
        }

        #region Insert & Update.

        ReportHandlerBL reportHandlerBL;
        int GetSessionID()
        {
            int sessionId = 0;
            #region Get SessionID.
            //var handler = new JwtSecurityTokenHandler();
            //var authorization = _iContextAccessor.HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            var token = TokenSecuirty.GetToken(_iContextAccessor.HttpContext.Request.Headers[HeaderNames.Authorization].ToString());//handler.ReadToken(authorization.Substring("Bearer ".Length)) as JwtSecurityToken;
            sessionId = int.Parse(token.Claims.First(claim => claim.Type == JwtRegisteredClaimNames.Sid).Value);
            #endregion
            return sessionId;
        }

        public override Dictionary<string, string> GetUrls()
        {
            Dictionary<string, string> reportDic = new Dictionary<string, string>();

            reportHandlerBL = new ReportHandlerBL(GetSessionID());
            reportDic = (reportHandlerBL.GetUrls().Result);
            //Task<List<REBXReport>> rBXReports = reportHandlerBL.LoadREBXReport(null, null, null);
            //if (rBXReports.Result != null && rBXReports.Result.Count > 0)
            //{
            //  foreach (var item in rBXReports.Result)
            //  {
            //    reportDic.Add(item.ReportName, item.ReportName);
            //  }
            //}
            return reportDic;
        }
        public override void SetData(XtraReport report, string url)
        {
            //try
            //{
            int sessionId = GetSessionID();
            reportHandlerBL = new ReportHandlerBL(sessionId);
            Output output = new Output();
            if (url.Contains("ReportID"))
            {
                ReportParams reportParams = new JavaScriptSerializer().Deserialize<ReportParams>(url);
                output = reportHandlerBL.HandleREBXReportDB(report, url, null, reportParams.ReportID, sessionId, ActionType.Edit).Result;
            }
            else
                output = reportHandlerBL.HandleREBXReportDB(report, url, null, null, sessionId, ActionType.Edit).Result;

            //}
            //catch (Exception)
            //{
            //  // will be handle after isa.
            //}

        }



        public override string SetNewData(XtraReport report, string defaultUrl)
        {
            //try
            //{
            #region sessionId & Report Designer Selection Type.
            //var handler = new JwtSecurityTokenHandler();
            //var authorization = _iContextAccessor.HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            //var token = handler.ReadToken(authorization.Substring("Bearer ".Length)) as JwtSecurityToken;
            //int sessionId = int.Parse(token.Claims.First(claim => claim.Type == JwtRegisteredClaimNames.Sid).Value);
            int sessionId = GetSessionID();
            int reportCatalogID;
            int.TryParse(_iContextAccessor.HttpContext.Request.Headers["reportCatalogID"].FirstOrDefault(), out reportCatalogID);
            #endregion

            reportHandlerBL = new ReportHandlerBL(sessionId);
            Output output = reportHandlerBL.HandleREBXReportDB(report, defaultUrl, reportCatalogID, null, sessionId, ActionType.Add).Result;
            //}
            //catch (Exception)
            //{
            //  // will be handle after isa.
            //}
            return defaultUrl;
        }


        public override bool CanSetData(string url)
        {
            // Determines whether or not it is possible to store a report by a given URL. 
            // For instance, make the CanSetData method return false for reports that should be read-only in your storage. 
            // This method is called only for valid URLs (i.e., if the IsValidUrl method returned true) before the SetData method is called.

            return true;
        }

        public override bool IsValidUrl(string url)
        {
            // Determines whether or not the URL passed to the current Report Storage is valid. 
            // For instance, implement your own logic to prohibit URLs that contain white spaces or some other special characters. 
            // This method is called before the CanSetData and GetData methods.

            return true;
        }


        #endregion
    }
}
