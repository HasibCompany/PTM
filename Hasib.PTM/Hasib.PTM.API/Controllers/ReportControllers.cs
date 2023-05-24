using DevExpress.AspNetCore.Reporting.QueryBuilder;
using DevExpress.AspNetCore.Reporting.QueryBuilder.Native.Services;
using DevExpress.AspNetCore.Reporting.ReportDesigner;
using DevExpress.AspNetCore.Reporting.ReportDesigner.Native.Services;
using DevExpress.AspNetCore.Reporting.WebDocumentViewer;
using DevExpress.AspNetCore.Reporting.WebDocumentViewer.Native.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hasib.FGL.API.Controllers
{
    //[Authorize]
    public class HasibWebDocumentViewerController : WebDocumentViewerController
    {
        public HasibWebDocumentViewerController(IWebDocumentViewerMvcControllerService controllerService) : base(controllerService)
        {
        }
    }
    //[Authorize]
    public class HasibReportDesignerController : ReportDesignerController
    {
        public HasibReportDesignerController(IReportDesignerMvcControllerService controllerService) : base(controllerService)
        {
        }
    }
    //[Authorize]
    public class HasibQueryBuilderController : QueryBuilderController
    {
        public HasibQueryBuilderController(IQueryBuilderMvcControllerService controllerService) : base(controllerService)
        {
        }
    }
}