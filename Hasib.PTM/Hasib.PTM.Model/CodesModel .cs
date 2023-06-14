using Hasib.Core;
using Hasib.DBHelpers;
using System;
using System.Data.Common;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hasib.Common.Model.Shared;

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
        public string AppendixLink { get; set; }
        public short? Duration { get; set; }
        public string DurationType { get; set; }
        public string DurationTypeAR { get; set; }
        public string DurationTypeEN { get; set; }
        public int SortOrder { get; set; }
        public int CreatedSID { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedSID { get; set; }
        public DateTime ModifiedOn { get; set; }
        public byte[] RowStamp { get; set; }
        public List<GeneralAttachment> insertedAttachments { get; set; }
        public List<GeneralAttachment> deletedAttachments { get; set; }
        public Codes()
        {
            insertedAttachments = new List<GeneralAttachment>();
            deletedAttachments = new List<GeneralAttachment>();
        }
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
            int c9 = rd.GetOrdinal("appendixLink");
            int c10 = rd.GetOrdinal("duration");
            int c11 = rd.GetOrdinal("durationType");
            int c12 = rd.GetOrdinal("durationTypeAR");
            int c13 = rd.GetOrdinal("durationTypeEN");
            int c14 = rd.GetOrdinal("sortOrder");
            int c15 = rd.GetOrdinal("createdSID");
            int c16 = rd.GetOrdinal("createdOn");
            int c17 = rd.GetOrdinal("modifiedSID");
            int c18 = rd.GetOrdinal("modifiedOn");
            int c19 = rd.GetOrdinal("rowStamp");

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
                if (!rd.IsDBNull(c9)) r.AppendixLink = rd.GetString(c9);
                if (!rd.IsDBNull(c10)) r.Duration = rd.GetInt16(c10);
                if (!rd.IsDBNull(c11)) r.DurationType = rd.GetString(c11);
                if (!rd.IsDBNull(c12)) r.DurationTypeAR = rd.GetString(c12);
                if (!rd.IsDBNull(c13)) r.DurationTypeEN = rd.GetString(c13);
                r.SortOrder = rd.GetInt32(c14);
                r.CreatedSID = rd.GetInt32(c15);
                r.CreatedOn = rd.GetDateTime(c16);
                if (!rd.IsDBNull(c17)) r.ModifiedSID = rd.GetInt32(c17);
                if (!rd.IsDBNull(c18)) r.ModifiedOn = rd.GetDateTime(c18);
                r.RowStamp = rd.GetValue(c19) as byte[];

                res.Add(r);
            }

            rd.Close();
            return res;
        }
        public async Task<Output> DeleteCodes(int? codeID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmDeleteCodes", new DbParameter[] { db.GetParameter("codeID", codeID), db.GetParameter("rowStamp", rowStamp) });
        }
        public async Task<Output> UpdateCodes(string codeType, int? codeID, string descriptionAR, string descriptionEN, bool? isActive, bool? isDefault, bool? typeFlag, string appendixLink, string durationType, short? duration, int? sortOrder, int? modifiedSID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmUpdateCodes", new DbParameter[] { db.GetParameter("codeType", codeType), db.GetParameter("codeID", codeID), db.GetParameter("descriptionAR", descriptionAR), db.GetParameter("descriptionEN", descriptionEN), db.GetParameter("isActive", isActive), db.GetParameter("isDefault", isDefault), db.GetParameter("typeFlag", typeFlag), db.GetParameter("appendixLink", appendixLink), db.GetParameter("durationType", durationType), db.GetParameter("duration", duration), db.GetParameter("sortOrder", sortOrder), db.GetParameter("modifiedSID", modifiedSID), db.GetParameter("rowStamp", rowStamp) });
        }
        public async Task<Output> InsertCodes(string codeType, int? code, string descriptionAR, string descriptionEN, bool? isActive, bool? isDefault, bool? typeFlag, string appendixLink, string durationType, short? duration, int? sortOrder, int? createdSID)
        {
            return await db.ExecuteCUD("pPtmInsertCodes", new DbParameter[] { db.GetParameter("codeType", codeType), db.GetParameter("code", code), db.GetParameter("descriptionAR", descriptionAR), db.GetParameter("descriptionEN", descriptionEN), db.GetParameter("isActive", isActive), db.GetParameter("isDefault", isDefault), db.GetParameter("typeFlag", typeFlag), db.GetParameter("appendixLink", appendixLink), db.GetParameter("durationType", durationType), db.GetParameter("duration", duration), db.GetParameter("sortOrder", sortOrder), db.GetParameter("createdSID", createdSID) });
        }
    }
}
