
namespace Hasib.Apps.API
{
    public class NotificationHub// : Hub
    {

        //public async Task StartNotificationService(int userId)
        //{
        //    //NotificationService currentNotificationService = notificationServiceList.Where(x => x.connectionId == this.Context.ConnectionId).FirstOrDefault();
        //    //if (currentNotificationService == null)
        //    //{
        //    //    currentNotificationService = new NotificationService(this.Context.ConnectionId, userId);
        //    //    notificationServiceList.Add(currentNotificationService);
        //    //}
        //    //currentNotificationService.GetNotification(userId)
        //     await Clients.Client(this.Context.ConnectionId).InvokeAsync("StartNotificationService", "Welcome To signalR");
        //}
        //public override Task OnDisconnectedAsync(Exception exception)
        //{
        //    bool isLogout = Settings.Logout(new BaseController().SessionId);
        //    return base.OnDisconnectedAsync(exception);
        //}
    }
}
