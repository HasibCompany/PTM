using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hasib.Apps.API.SqlTableDependencyHelper
{
    public static class UseSqlTableDependencyHelpers
    {
        //public static void UseSqlTableDependency<T>(this IApplicationBuilder services, string connectionString) where T : IDatabaseSubscription
        //{
        //    var serviceProvider = services.ApplicationServices;
        //    var subscription = serviceProvider.GetService<T>();
        //    subscription.Configure(connectionString);
        //}
    }
}
