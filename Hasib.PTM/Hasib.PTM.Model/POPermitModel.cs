using Hasib.Core;
using Hasib.DBHelpers;
using System;
using System.Data.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hasib.PTM.Model
{
    public class POPermit
    {
        public int POpermitID { get; set; }
        public string ScreenCode { get; set; }
        public string PermitFor { get; set; }
        public int? UserGroupID { get; set; }
        public int? AdministrativePostID { get; set; }
        public int? ProfessionID { get; set; }
        public int? UserID { get; set; }
        public string PermissionNameAR { get; set; }
        public string PermissionNameEN { get; set; }
        public string UserNameAR { get; set; }
        public string UserNameEN { get; set; }
        public decimal FromAmount { get; set; }
        public decimal ToAmount { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public bool IsActive { get; set; }
        public int CreatedSID { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedSID { get; set; }
        public DateTime ModifiedOn { get; set; }
        public byte[] RowStamp { get; set; }
    }
    public class POPermitModel : BaseModel
    {
        public POPermitModel(DBHelper db) : base(db) { }
        public async Task<List<POPermit>> LoadPOPermit(string screenCode)
        {
            var rd = await db.GetDataReader("pPtmLoadPOPermit", new DbParameter[] { db.GetParameter("screenCode", screenCode) });
            var res = new List<POPermit>();

            int c0 = rd.GetOrdinal("POpermitID");
            int c1 = rd.GetOrdinal("screenCode");
            int c2 = rd.GetOrdinal("permitFor");
            int c3 = rd.GetOrdinal("userGroupID");
            int c4 = rd.GetOrdinal("administrativePostID");
            int c5 = rd.GetOrdinal("professionID");
            int c6 = rd.GetOrdinal("userID");
            int c7 = rd.GetOrdinal("permissionNameAR");
            int c8 = rd.GetOrdinal("permissionNameEN");
            int c9 = rd.GetOrdinal("userNameAR");
            int c10 = rd.GetOrdinal("userNameEN");
            int c11 = rd.GetOrdinal("fromAmount");
            int c12 = rd.GetOrdinal("toAmount");
            int c13 = rd.GetOrdinal("fromDate");
            int c14 = rd.GetOrdinal("toDate");
            int c15 = rd.GetOrdinal("isActive");
            int c16 = rd.GetOrdinal("createdSID");
            int c17 = rd.GetOrdinal("createdOn");
            int c18 = rd.GetOrdinal("modifiedSID");
            int c19 = rd.GetOrdinal("modifiedOn");
            int c20 = rd.GetOrdinal("rowStamp");

            while (rd.Read())
            {
                var r = new POPermit();

                r.POpermitID = rd.GetInt32(c0);
                r.ScreenCode = rd.GetString(c1);
                r.PermitFor = rd.GetString(c2);
                if (!rd.IsDBNull(c3)) r.UserGroupID = rd.GetInt32(c3);
                if (!rd.IsDBNull(c4)) r.AdministrativePostID = rd.GetInt32(c4);
                if (!rd.IsDBNull(c5)) r.ProfessionID = rd.GetInt32(c5);
                if (!rd.IsDBNull(c6)) r.UserID = rd.GetInt32(c6);
                if (!rd.IsDBNull(c7)) r.PermissionNameAR = rd.GetString(c7);
                if (!rd.IsDBNull(c8)) r.PermissionNameEN = rd.GetString(c8);
                if (!rd.IsDBNull(c9)) r.UserNameAR = rd.GetString(c9);
                if (!rd.IsDBNull(c10)) r.UserNameEN = rd.GetString(c10);
                r.FromAmount = rd.GetDecimal(c11);
                r.ToAmount = rd.GetDecimal(c12);
                r.FromDate = rd.GetDateTime(c13);
                if (!rd.IsDBNull(c14)) r.ToDate = rd.GetDateTime(c14);
                r.IsActive = rd.GetBoolean(c15);
                r.CreatedSID = rd.GetInt32(c16);
                r.CreatedOn = rd.GetDateTime(c17);
                if (!rd.IsDBNull(c18)) r.ModifiedSID = rd.GetInt32(c18);
                if (!rd.IsDBNull(c19)) r.ModifiedOn = rd.GetDateTime(c19);
                r.RowStamp = rd.GetValue(c20) as byte[];

                res.Add(r);
            }

            rd.Close();
            return res;
        }
        public async Task<Output> InsertPOPermit(string screenCode, string permitFor, int? userGroupID, int? administrativePostID, int? professionID, int? userID, decimal fromAmount, decimal toAmount, DateTime? fromDate, DateTime? toDate, bool? isActive, int? createdSID)
        {
            return await db.ExecuteCUD("pPtmInsertPOPermit", new DbParameter[] { db.GetParameter("screenCode", screenCode), db.GetParameter("permitFor", permitFor), db.GetParameter("userGroupID", userGroupID), db.GetParameter("administrativePostID", administrativePostID), db.GetParameter("professionID", professionID), db.GetParameter("userID", userID), db.GetParameter("fromAmount", fromAmount), db.GetParameter("toAmount", toAmount), db.GetParameter("fromDate", fromDate), db.GetParameter("toDate", toDate), db.GetParameter("isActive", isActive), db.GetParameter("createdSID", createdSID) });
        }
        public async Task<Output> UpdatePOPermit(int? pOpermitID, string screenCode, string permitFor, int? userGroupID, int? administrativePostID, int? professionID, int? userID, decimal fromAmount, decimal toAmount, DateTime? fromDate, DateTime? toDate, bool? isActive, int? modifiedSID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmUpdatePOPermit", new DbParameter[] { db.GetParameter("pOpermitID", pOpermitID), db.GetParameter("screenCode", screenCode), db.GetParameter("permitFor", permitFor), db.GetParameter("userGroupID", userGroupID), db.GetParameter("administrativePostID", administrativePostID), db.GetParameter("professionID", professionID), db.GetParameter("userID", userID), db.GetParameter("fromAmount", fromAmount), db.GetParameter("toAmount", toAmount), db.GetParameter("fromDate", fromDate), db.GetParameter("toDate", toDate), db.GetParameter("isActive", isActive), db.GetParameter("modifiedSID", modifiedSID), db.GetParameter("rowStamp", rowStamp) });
        }
        public async Task<Output> DeletePOPermit(int? pOpermitID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmDeletePOPermit", new DbParameter[] { db.GetParameter("pOpermitID", pOpermitID), db.GetParameter("rowStamp", rowStamp) });
        }
    }
}
