using Hasib.Core;
using Hasib.DBHelpers;
using System;
using System.Data.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hasib.PTM.Model
{
    public class Codes
    {
        public int CodeID { get; set; }
        public string CodeType { get; set; }
        public int Code { get; set; }
        public string DescriptionAR { get; set; }
        public string DescriptionEN { get; set; }
        public bool IsReserved { get; set; }
        public bool IsActive { get; set; }
        public bool IsDefault { get; set; }
        public bool? TypeFlag { get; set; }
        public int SortOrder { get; set; }
        public int CreatedSID { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedSID { get; set; }
        public DateTime ModifiedOn { get; set; }
        public byte[] RowStamp { get; set; }
    }
    public class CodesModel : BaseModel
    {
        public CodesModel(DBHelper db) : base(db) { }
        public async Task<List<Codes>> LoadCodes(string codeType)
        {
            var rd = await db.GetDataReader("pPtmLoadCodes", new DbParameter[] { db.GetParameter("codeType", codeType) });
            var res = new List<Codes>();

            int c0 = rd.GetOrdinal("codeID");
            int c1 = rd.GetOrdinal("codeType");
            int c2 = rd.GetOrdinal("code");
            int c3 = rd.GetOrdinal("descriptionAR");
            int c4 = rd.GetOrdinal("descriptionEN");
            int c5 = rd.GetOrdinal("isReserved");
            int c6 = rd.GetOrdinal("isActive");
            int c7 = rd.GetOrdinal("isDefault");
            int c8 = rd.GetOrdinal("typeFlag");
            int c9 = rd.GetOrdinal("sortOrder");
            int c10 = rd.GetOrdinal("createdSID");
            int c11 = rd.GetOrdinal("createdOn");
            int c12 = rd.GetOrdinal("modifiedSID");
            int c13 = rd.GetOrdinal("modifiedOn");
            int c14 = rd.GetOrdinal("rowStamp");

            while (rd.Read())
            {
                var r = new Codes();

                r.CodeID = rd.GetInt32(c0);
                r.CodeType = rd.GetString(c1);
                r.Code = rd.GetInt32(c2);
                r.DescriptionAR = rd.GetString(c3);
                r.DescriptionEN = rd.GetString(c4);
                r.IsReserved = rd.GetBoolean(c5);
                r.IsActive = rd.GetBoolean(c6);
                r.IsDefault = rd.GetBoolean(c7);
                if (!rd.IsDBNull(c8)) r.TypeFlag = rd.GetBoolean(c8);
                r.SortOrder = rd.GetInt32(c9);
                r.CreatedSID = rd.GetInt32(c10);
                r.CreatedOn = rd.GetDateTime(c11);
                if (!rd.IsDBNull(c12)) r.ModifiedSID = rd.GetInt32(c12);
                if (!rd.IsDBNull(c13)) r.ModifiedOn = rd.GetDateTime(c13);
                r.RowStamp = rd.GetValue(c14) as byte[];

                res.Add(r);
            }

            rd.Close();
            return res;
        }
        public async Task<Output> DeleteCodes(int? codeID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmDeleteCodes", new DbParameter[] { db.GetParameter("codeID", codeID), db.GetParameter("rowStamp", rowStamp) });
        }
        public async Task<Output> UpdateCodes(string codeType, int? codeID, string descriptionAR, string descriptionEN, bool? isActive, bool? isDefault, bool? typeFlag, int? sortOrder, int? modifiedSID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmUpdateCodes", new DbParameter[] { db.GetParameter("codeType", codeType), db.GetParameter("codeID", codeID), db.GetParameter("descriptionAR", descriptionAR), db.GetParameter("descriptionEN", descriptionEN), db.GetParameter("isActive", isActive), db.GetParameter("isDefault", isDefault), db.GetParameter("typeFlag", typeFlag), db.GetParameter("sortOrder", sortOrder), db.GetParameter("modifiedSID", modifiedSID), db.GetParameter("rowStamp", rowStamp) });
        }
        public async Task<Output> InsertCodes(string codeType, int? code, string descriptionAR, string descriptionEN, bool? isActive, bool? isDefault, bool? typeFlag, int? sortOrder, int? createdSID)
        {
            return await db.ExecuteCUD("pPtmInsertCodes", new DbParameter[] { db.GetParameter("codeType", codeType), db.GetParameter("code", code), db.GetParameter("descriptionAR", descriptionAR), db.GetParameter("descriptionEN", descriptionEN), db.GetParameter("isActive", isActive), db.GetParameter("isDefault", isDefault), db.GetParameter("typeFlag", typeFlag), db.GetParameter("sortOrder", sortOrder), db.GetParameter("createdSID", createdSID) });
        }


    }
}
