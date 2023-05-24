using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace Hasib.Apps.API.WebSocketHandling
{
    public class WebSocketConnectionManager
    {
        // You can access it by using GetAll Method.
        private static ConcurrentDictionary<Guid, UserWebSocket> _sockets = new ConcurrentDictionary<Guid, UserWebSocket>();
        public UserWebSocket GetSocketById(Guid connectionId)
        {
            return _sockets.FirstOrDefault(p => p.Key == connectionId).Value;
        }
        public ConcurrentDictionary<Guid, UserWebSocket> GetAll()
        {
            return _sockets;
        }
        public Guid GetId(WebSocket socket)
        {
            return _sockets.FirstOrDefault(p => p.Value.WebSocket == socket).Key;
        }
        public UserWebSocket GetById(WebSocket socket)
        {
            return _sockets.FirstOrDefault(p => p.Value.WebSocket == socket).Value;
        }
        public void AddSocket(WebSocket socket)
        {
            UserWebSocket userWebSocket = new UserWebSocket() { WebSocket = socket, Token = string.Empty }; //UserId Will Be updated in case connection open
            _sockets.TryAdd(CreateConnectionId(), userWebSocket);
        }
        public void AssignTokenToWebSocket(Guid connectionId, string token)
        {
            UserWebSocket userWebSocket = _sockets.Where(x => x.Key == connectionId).FirstOrDefault().Value;
            if (userWebSocket != null)
            {
                userWebSocket.Token = token;
            }
        }

        public void AssignIsRefreshToWebSocket(Guid connectionId, bool isRefresh)
        {
            UserWebSocket userWebSocket = _sockets.Where(x => x.Key == connectionId).FirstOrDefault().Value;
            if (userWebSocket != null)
            {
                userWebSocket.IsRefresh = isRefresh;
            }
        }


        //public void AssignUsernameToWebSocket(string connectionId, string username)
        //{
        //    UserWebSocket userWebSocket = _sockets.Where(x => x.Key == connectionId).FirstOrDefault().Value;
        //    if (userWebSocket != null && !string.IsNullOrWhiteSpace(username))
        //    {
        //        userWebSocket.Username = username;
        //    }
        //}

        //public void AssignDataBaseConnectionIDToWebSocket(string connectionId,string databaseConnectionID)
        //{
        //    UserWebSocket userWebSocket = _sockets.Where(x => x.Key == connectionId).FirstOrDefault().Value;
        //    if (userWebSocket != null && !string.IsNullOrWhiteSpace(databaseConnectionID))
        //    {
        //        userWebSocket.DataBaseConnectionID = databaseConnectionID;
        //    }
        //}
        public async Task RemoveSocket(Guid connectionId)
        {
            UserWebSocket userWebSocket;
            _sockets.TryRemove(connectionId, out userWebSocket);
            if (userWebSocket != null && userWebSocket.WebSocket != null)
            {
                await userWebSocket.WebSocket.CloseAsync(closeStatus: WebSocketCloseStatus.NormalClosure,
                                        statusDescription: "Closed by the WebSocketManager",
                                        cancellationToken: CancellationToken.None);

            }

        }
        private Guid CreateConnectionId()
        {
            return Guid.NewGuid(); //  to prevent the dublication.
        }
    }
    public class UserWebSocket
    {
        public int UserId { get; set; }
        public string Token { get; set; }
        public string Username { get; set; }
        public string DataBaseConnectionID { get; set; }
        public WebSocket WebSocket { get; set; }
        public bool IsRefresh { get; set; }
    }
}
