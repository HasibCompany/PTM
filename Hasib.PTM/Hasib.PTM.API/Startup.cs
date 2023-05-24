using DevExpress.AspNetCore;
using DevExpress.AspNetCore.Reporting;
using Hasib.Apps.API.Services;
using Hasib.Common.Model.Shared;
using Hasib.DBHelpers;
using Hasib.PTM.Business.ReportConfig;
using Hasib.Library.DBHelpers.Models;
using Hasib.Library.Utilities;
using Hasib.Utilities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Text;

namespace Hasib.PTM.API
{
    public class Startup
    {
        private bool isProd = true;
        public AppSettingsData AppSettingsData { get; set; }
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                isProd = false;
            }
            this.AppSettingsData = AppSettingReader.Read();
        }
        void ProcessException(Exception ex, string message)
        {
            // Log exceptions here. For instance:
            System.Diagnostics.Debug.WriteLine("[{0}]: Exception occured. Message: '{1}'. Exception Details:\r\n{2}",
                DateTime.Now, message, ex);
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        { // Register reporting services in an application's dependency injection container.
            services.AddDevExpressControls();
            // remove the following code sigment after update to devexpress 21.2.4
            //services.AddControllersWithViews().AddDefaultReportingControllers();

            // Register reporting services in an application's dependency injection container.
            services.ConfigureReportingServices(configurator =>
            {
                configurator.ConfigureReportDesigner(designerConfigurator =>
                {
                    designerConfigurator.RegisterDataSourceWizardConfigFileConnectionStringsProvider();
                });
            });
            services.Configure<CookiePolicyOptions>(options =>
            {
          // This lambda determines whether user consent for non-essential cookies is needed for a given request.
          options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            //services.AddDbContext<ApplicationDbContext>(options =>
            //   options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            //services.AddIdentity<ApplicationUser, IdentityRole>()
            //          .AddEntityFrameworkStores<ApplicationDbContext>()
            //          .AddDefaultTokenProviders();
            services.AddTransient<IEmailSender, EmailSender>();
            //services.AddTransient<IDatabaseSubscription, DatabaseSubscription>();

            services.AddControllersWithViews().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.RoundtripKind;
                options.SerializerSettings.DateFormatString = "yyyy/MM/dd HH:mm:ss";
                options.SerializerSettings.DateParseHandling = DateParseHandling.DateTime;
            });

            services.AddCors();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(jwtBearerOptions =>
            {
                jwtBearerOptions.TokenValidationParameters = new TokenValidationParameters()
                {
                    RequireExpirationTime = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    //****************************************************
                    ValidIssuer = AppSettingsData.jWTToken.issuer,
                    ValidAudience = AppSettingsData.jWTToken.audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppSettingsData.jWTToken.securityKey)),
                    TokenDecryptionKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AppSettingsData.jWTToken.securityKey)),
                    ClockSkew = TimeSpan.FromMinutes(0)
                };
            });

            //services.AddResponseCompression(options =>
            //{
            //  options.Providers.Add<BrotliCompressionProvider>();
            //  options.Providers.Add<GzipCompressionProvider>();
            //  options.MimeTypes =
            //        ResponseCompressionDefaults.MimeTypes.Concat(new[] { "image/svg+xml",
            //              "application/javascript",
            //              "application/json",
            //              "application/xml",
            //              "text/css",
            //              "text/html",
            //              "text/json",
            //              "text/plain",
            //              "text/xml" });
            //});
            //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            //services.AddWebSocketManager(); // Handle start up.
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider)
        {
            app.Use(next => context =>
            {
                context.Request.EnableBuffering();
                return next(context);
            });
            // app.UseResponseCompression();
            var reportDirectory = Path.Combine(env.ContentRootPath, "Reports");
            DevExpress.XtraReports.Web.Extensions.ReportStorageWebExtension.RegisterExtensionGlobal(new HasibReportStorage(this.AppSettingsData.connectionStrings, app.ApplicationServices.GetService<IHttpContextAccessor>(), env));
            //DevExpress.XtraReports.Configuration.Settings.Default.UserDesignerOptions.DataBindingMode = DevExpress.XtraReports.UI.DataBindingMode.Expressions;
            DevExpress.XtraReports.Web.ClientControls.LoggerService.Initialize(ProcessException);

            //set default culture to be en-US (very important)
            var cultureInfo = new CultureInfo("en-US");
            CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
            CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

            //app.UseRequestLocalization(new RequestLocalizationOptions { DefaultRequestCulture = new RequestCulture("en-US") });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                //app.UseBrowserLink();
            }
            else
            {
                app.UseHsts();
            }
            app.UseExceptionHandler("/Error");
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            // Initialize reporting services.

            app.UseRouting();
            app.UseDevExpressControls();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCookiePolicy();

            // Shows UseCors with CorsPolicyBuilder.
            app.UseCors(corsBuilder => corsBuilder.WithOrigins(AppSettingsData.corsOrigins).AllowAnyHeader().AllowAnyMethod());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });

            // app.UseWebSockets();
            // app.MapWebSocketManager("/ws", serviceProvider.GetService<WebSocketSender>());
            //string ConnectionString = @"Data Source=DEV-DATABASE01\SQL2016;Initial Catalog=HasibApps;User Id=hgsdt2016;Password=hgsdt@2016;";
            //app.UseSqlTableDependency<IDatabaseSubscription>(ConnectionString);
        }

    }
}
