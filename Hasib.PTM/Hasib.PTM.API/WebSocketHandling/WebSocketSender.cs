using Hasib.DBHelpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;

namespace Hasib.Apps.API.WebSocketHandling
{
    public class WebSocketSender : WebSocketHandler
    {
        public WebSocketSender(WebSocketConnectionManager webSocketConnectionManager) : base(webSocketConnectionManager) { }

        public override async Task OnConnected(WebSocket socket)
        {
            await base.OnConnected(socket);
            //var socketId = WebSocketConnectionManager.GetId(socket);
        }
        public override async Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer)
        {
            var socketConnectionId = WebSocketConnectionManager.GetId(socket);
            UserWebSocket userWebSocket = WebSocketConnectionManager.GetSocketById(socketConnectionId);
            if (userWebSocket != null)
            {
                var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                string[] messageParts;
                #region Store Sending UserID Message.

                if (message.Contains("RefrehToken") && message.Contains(':'))
                {
                    WebSocketConnectionManager.AssignIsRefreshToWebSocket(socketConnectionId, true);
                }
                else if (message.Contains("Token") && message.Contains(':'))
                {
                    messageParts = message.Split(":");
                    if (messageParts.Length > 1)
                    {
                        WebSocketConnectionManager.AssignTokenToWebSocket(socketConnectionId, messageParts[1]);
                    }
                }

                #endregion
            }
        }
    }
}
