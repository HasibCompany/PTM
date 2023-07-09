using Hasib.Core;
using Hasib.DBHelpers;
using System;
using System.Data.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hasib.PTM.Model
{
    public class CycleSettings
    {
        public int CycleID { get; set; }
        public string SettingCode { get; set; }
        public string NameAR { get; set; }
        public string NameEN { get; set; }
        public string FieldValue { get; set; }
        public string TypeFlag { get; set; }
        public int CreatedSID { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedSID { get; set; }
        public DateTime ModifiedOn { get; set; }
        public byte[] RowStamp { get; set; }
    }
    public class CycleSettingsModel : BaseModel
    {
        public CycleSettingsModel(DBHelper db) : base(db) { }
        public async Task<List<CycleSettings>> LoadCycleSettings(int? cycleID, string settingCode, int? createdSID)
        {
            var rd = await db.GetDataReader("pPtmLoadCycleSettings", new DbParameter[] { db.GetParameter("cycleID", cycleID), db.GetParameter("settingCode", settingCode), db.GetParameter("createdSID", createdSID) });
            var res = new List<CycleSettings>();

            int c0 = rd.GetOrdinal("cycleID");
            int c1 = rd.GetOrdinal("settingCode");
            int c2 = rd.GetOrdinal("nameAR");
            int c3 = rd.GetOrdinal("nameEN");
            int c4 = rd.GetOrdinal("fieldValue");
            int c5 = rd.GetOrdinal("typeFlag");
            int c6 = rd.GetOrdinal("createdSID");
            int c7 = rd.GetOrdinal("createdOn");
            int c8 = rd.GetOrdinal("modifiedSID");
            int c9 = rd.GetOrdinal("modifiedOn");
            int c10 = rd.GetOrdinal("rowStamp");

            while (rd.Read())
            {
                var r = new CycleSettings();

                r.CycleID = rd.GetInt32(c0);
                r.SettingCode = rd.GetString(c1);
                r.NameAR = rd.GetString(c2);
                r.NameEN = rd.GetString(c3);
                if (!rd.IsDBNull(c4)) r.FieldValue = rd.GetString(c4);
                if (!rd.IsDBNull(c5)) r.TypeFlag = rd.GetString(c5);
                r.CreatedSID = rd.GetInt32(c6);
                r.CreatedOn = rd.GetDateTime(c7);
                if (!rd.IsDBNull(c8)) r.ModifiedSID = rd.GetInt32(c8);
                if (!rd.IsDBNull(c9)) r.ModifiedOn = rd.GetDateTime(c9);
                r.RowStamp = rd.GetValue(c10) as byte[];

                res.Add(r);
            }

            rd.Close();
            return res;
        }
        public async Task<Output> UpdateCycleSettings(int? cycleID, string settingCode, string fieldValue, int? modifiedSID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmUpdateCycleSettings", new DbParameter[] { db.GetParameter("cycleID", cycleID), db.GetParameter("settingCode", settingCode), db.GetParameter("fieldValue", fieldValue), db.GetParameter("modifiedSID", modifiedSID), db.GetParameter("rowStamp", rowStamp) });
        }
        public async Task<Output> DeleteCycleSettings(int? cycleID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmDeleteCycleSettings", new DbParameter[] { db.GetParameter("cycleID", cycleID), db.GetParameter("rowStamp", rowStamp) });
        }

    }
}
