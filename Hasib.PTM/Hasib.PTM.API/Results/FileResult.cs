using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace Hasib.Apps.API.Results
{
    public class FileResult : ActionResult
    {
        public string ContentType { get; private set; }
        public string FileDownloadName { get; private set; }
        public string FilePath { get; private set; }

        public FileResult(string fileDownloadName, string filePath, string contentType)
        {
            FileDownloadName = fileDownloadName;
            FilePath = filePath;
            ContentType = contentType;
        }

        public async override Task ExecuteResultAsync(ActionContext context)
        {
            var response = context.HttpContext.Response;

            response.ContentType = ContentType;

            context.HttpContext.Response.Headers.Add("Content-Disposition", new[] { "inline; filename=" + FileDownloadName});

            using (var fileStream = new FileStream(FilePath, FileMode.Open))
            {
                await fileStream.CopyToAsync(context.HttpContext.Response.Body);

            }
        }
    }
}
