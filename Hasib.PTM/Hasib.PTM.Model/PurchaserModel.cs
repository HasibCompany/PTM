using Hasib.Core;
using Hasib.DBHelpers;
using System;
using System.Data.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hasib.PTM.Model
{
    public class Purchaser
    {
        public int? PurchaserID { get; set; }
        public int? PurchaserNumber { get; set; }
        public string PurchaserNameAR { get; set; }
        public string PurchaserNameEN { get; set; }
        public bool IsActive { get; set; }
        public bool IsDefault { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int CreatedSID { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedSID { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public byte[] RowStamp { get; set; }
    }
    public class PurchaserModel : BaseModel
    {
        public PurchaserModel(DBHelper db) : base(db) { }
        public async Task<List<Purchaser>> LoadPurchaser(int? purchaserID)
        {
            var rd = await db.GetDataReader("pPtmLoadPurchaser", new DbParameter[] { db.GetParameter("purchaserID", purchaserID) });
            var res = new List<Purchaser>();

            int c0 = rd.GetOrdinal("purchaserID");
            int c1 = rd.GetOrdinal("purchaserNumber");
            int c2 = rd.GetOrdinal("purchaserNameAR");
            int c3 = rd.GetOrdinal("purchaserNameEN");
            int c4 = rd.GetOrdinal("isActive");
            int c5 = rd.GetOrdinal("isDefault");
            int c6 = rd.GetOrdinal("fromDate");
            int c7 = rd.GetOrdinal("toDate");
            int c8 = rd.GetOrdinal("createdSID");
            int c9 = rd.GetOrdinal("createdOn");
            int c10 = rd.GetOrdinal("modifiedSID");
            int c11 = rd.GetOrdinal("modifiedOn");
            int c12 = rd.GetOrdinal("rowStamp");

            while (rd.Read())
            {
                var r = new Purchaser();

                if (!rd.IsDBNull(c0)) r.PurchaserID = rd.GetInt32(c0);
                if (!rd.IsDBNull(c1)) r.PurchaserNumber = rd.GetInt32(c1);
                if (!rd.IsDBNull(c2)) r.PurchaserNameAR = rd.GetString(c2);
                if (!rd.IsDBNull(c3)) r.PurchaserNameEN = rd.GetString(c3);
                if (!rd.IsDBNull(c4)) r.IsActive = rd.GetBoolean(c4);
                if (!rd.IsDBNull(c5)) r.IsDefault = rd.GetBoolean(c5);
                if (!rd.IsDBNull(c6)) r.FromDate = rd.GetDateTime(c6);
                if (!rd.IsDBNull(c7)) r.ToDate = rd.GetDateTime(c7);
                if (!rd.IsDBNull(c8)) r.CreatedSID = rd.GetInt32(c8);
                if (!rd.IsDBNull(c9)) r.CreatedOn = rd.GetDateTime(c9);
                if (!rd.IsDBNull(c10)) r.ModifiedSID = rd.GetInt32(c10);
                if (!rd.IsDBNull(c11)) r.ModifiedOn = rd.GetDateTime(c11);
                if (!rd.IsDBNull(c12)) r.RowStamp = rd.GetValue(c12) as byte[];

                res.Add(r);
            }

            rd.Close();
            return res;
        }
        public async Task<Output> InsertPurchaser(int? purchaserID, bool? isActive, bool? isDefault, DateTime? fromDate, DateTime? toDate, int? createdSID)
        {
            return await db.ExecuteCUD("pPtmInsertPurchaser", new DbParameter[] { db.GetParameter("purchaserID", purchaserID), db.GetParameter("isActive", isActive), db.GetParameter("isDefault", isDefault), db.GetParameter("fromDate", fromDate), db.GetParameter("toDate", toDate), db.GetParameter("createdSID", createdSID) });
        }
        public async Task<Output> UpdatePurchaser(int? purchaserID, bool? isActive, bool? isDefault, DateTime? fromDate, DateTime? toDate, int? modifiedSID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmUpdatePurchaser", new DbParameter[] { db.GetParameter("purchaserID", purchaserID), db.GetParameter("isActive", isActive), db.GetParameter("isDefault", isDefault), db.GetParameter("fromDate", fromDate), db.GetParameter("toDate", toDate), db.GetParameter("modifiedSID", modifiedSID), db.GetParameter("rowStamp", rowStamp) });
        }
        public async Task<Output> DeletePurchaser(int? purchaserID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmDeletePurchaser", new DbParameter[] { db.GetParameter("purchaserID", purchaserID), db.GetParameter("rowStamp", rowStamp) });
        }
    }
}
