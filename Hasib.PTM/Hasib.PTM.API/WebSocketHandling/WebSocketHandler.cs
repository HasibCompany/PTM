using Hasib.DBHelpers;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Hasib.Apps.API.WebSocketHandling
{
    public abstract class WebSocketHandler
    {
        protected WebSocketConnectionManager WebSocketConnectionManager { get; set; }
        public WebSocketHandler(WebSocketConnectionManager webSocketConnectionManager)
        {
            WebSocketConnectionManager = webSocketConnectionManager;
        }
        public virtual async Task OnConnected(WebSocket socket)
        {
            WebSocketConnectionManager.AddSocket(socket);
        }

        public virtual async Task OnDisconnected(WebSocket socket)
        {
            var handler = new JwtSecurityTokenHandler();

            UserWebSocket userWebSocket = WebSocketConnectionManager.GetById(socket);
            if (userWebSocket != null && !string.IsNullOrWhiteSpace(userWebSocket.Token) && !userWebSocket.IsRefresh)
            {
                var token = handler.ReadToken(userWebSocket.Token) as JwtSecurityToken;
                int sessionId = int.Parse(token.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sid).Value);
                if (DB.Logout(sessionId, string.Empty))
                {
                    await WebSocketConnectionManager.RemoveSocket(WebSocketConnectionManager.GetId(socket));
                }
            }

        }
        public abstract Task ReceiveAsync(WebSocket socket, WebSocketReceiveResult result, byte[] buffer);

        #region Old Logic For Send Message
        //public async Task SendMessageAsync(WebSocket socket, string message)
        //{
        //    if (socket.State != WebSocketState.Open)
        //        return;
        //    await socket.SendAsync(buffer: new ArraySegment<byte>(array: Encoding.ASCII.GetBytes(message),
        //                                                          offset: 0,
        //                                                          count: message.Length),
        //                           messageType: WebSocketMessageType.Text,
        //                           endOfMessage: true,
        //                           cancellationToken: CancellationToken.None);
        //}
        //public async Task SendMessageAsync(string socketId, string message)
        //{
        //    await SendMessageAsync(WebSocketConnectionManager.GetSocketById(socketId).WebSocket, message);
        //}
        //public async Task SendMessageToAllAsync(string message)
        //{
        //    foreach (var pair in WebSocketConnectionManager.GetAll())
        //    {
        //        if (pair.Value.WebSocket.State == WebSocketState.Open)
        //            await SendMessageAsync(pair.Value.WebSocket, message);
        //    }
        //}
        #endregion
    }
}
