using Hasib.Core;
using Hasib.DBHelpers;
using System;
using System.Data.Common;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;

namespace Hasib.PTM.Model
{ //todo : create a class called generalSettings
    public class Settings
    {
        public Settings() { }

        public int? OrganizationID { get; set; }
        public string SettingCode { get; set; }
        public string SettingNameAR { get; set; }
        public string SettingNameEN { get; set; }
        public string FieldType { get; set; }
        public string SettingDescription { get; set; }
        public bool? IsActive { get; set; }
        public int? CreatedSID { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? ModifiedSID { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public byte[] RowStamp { get; set; }
        //todo: add a property called tabNumber type tinyint and not nullable
        public byte? TabNumber { get; set; }
        //todo: add a property called packageType type char and not nullable
        public string PackageType { get; set; }
        public string JsonData { get; set; }
        //todo: add a property called fieldValue type string and nullable
        public string FieldValue { get; set; }

    }

    public class SettingsModel : BaseModel
    { 
        public SettingsModel(DBHelper db) : base(db) { }
        //todo creat a method called LoadSettings the loads all the settings from the database and takes 3 parameters organizationID type int,settingCode type string and createdSID type int and fill the list of Settings and return the list of Settings
        public async Task<List<Settings>> LoadSettings(int? organizationID, string settingCode, int? createdSID)
        {
            var rd = await db.GetDataReader("pPtmLoadSettings", new DbParameter[] { db.GetParameter("organizationID", organizationID), db.GetParameter("settingCode", settingCode), db.GetParameter("createdSID", createdSID) });
            var res = new List<Settings>();

            int c0 = rd.GetOrdinal("organizationID");
            int c1 = rd.GetOrdinal("settingCode");
            int c2 = rd.GetOrdinal("nameAR");
            int c3 = rd.GetOrdinal("nameEN");
            int c4 = rd.GetOrdinal("fieldValue");
            int c5 = rd.GetOrdinal("fieldType");
            int c6 = rd.GetOrdinal("tabNumber");
            int c7 = rd.GetOrdinal("packageType");
            int c8 = rd.GetOrdinal("createdSID");
            int c9 = rd.GetOrdinal("createdOn");
            int c10 = rd.GetOrdinal("modifiedSID");
            int c11 = rd.GetOrdinal("modifiedOn");
            int c12 = rd.GetOrdinal("rowStamp");
            //todo create a while loop that loops through the data reader and fill the list of Settings
            while (rd.Read())
            {//todo check if the data reader is not null before each assigment fill and then fill the list of Settings
                var item = new Settings();
                if (!rd.IsDBNull(c0)) item.OrganizationID = rd.GetInt32(c0);
                if (!rd.IsDBNull(c1)) item.SettingCode = rd.GetString(c1);
                if (!rd.IsDBNull(c2)) item.SettingNameAR = rd.GetString(c2);
                if (!rd.IsDBNull(c3)) item.SettingNameEN = rd.GetString(c3);
                if (!rd.IsDBNull(c4)) item.FieldValue = rd.GetString(c4);
                if (!rd.IsDBNull(c5)) item.FieldType = rd.GetString(c5);
                if (!rd.IsDBNull(c6)) item.TabNumber = rd.GetByte(c6);
                if (!rd.IsDBNull(c7)) item.PackageType = rd.GetString(c7);
                if (!rd.IsDBNull(c8)) item.CreatedSID = rd.GetInt32(c8);
                if (!rd.IsDBNull(c9)) item.CreatedOn = rd.GetDateTime(c9);
                if (!rd.IsDBNull(c10)) item.ModifiedSID = rd.GetInt32(c10);
                if (!rd.IsDBNull(c11)) item.ModifiedOn = rd.GetDateTime(c11);
                if (!rd.IsDBNull(c12)) item.RowStamp = rd.GetValue(c12) as byte[];
                res.Add(item);


            }
            //todo close date reader and return the list of Settings
            rd.Close();
            return res;



        }

        public async Task<Output> UpdateSettings(int? organizationID, string settingCode, string fieldValue, int? modifiedSID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmUpdateSettings", new DbParameter[] { db.GetParameter("organizationID", organizationID), db.GetParameter("settingCode", settingCode), db.GetParameter("fieldValue", fieldValue), db.GetParameter("modifiedSID", modifiedSID), db.GetParameter("rowStamp", rowStamp) });
        }
        //todo:create method called UpdateSettingsBulk that takes an object of type Settings and return an object of type Settings
        public async Task<Output> UpdateSettingsBulk(Settings settings)
        {
            //todo: return await db.ExecuteCUD("pPtmUpdateSettingsBulk", new DbParameter[] { db.GetParameter("organizationID", settings.OrganizationID), db.GetParameter("fieldValue", settings.SettingValue), db.GetParameter("rowStamp", settings.RowStamp) });
            return await db.ExecuteCUD("pPtmUpdateSettingsBulk", new DbParameter[] { db.GetParameter("organizationID", settings.OrganizationID), db.GetParameter("jsonData", settings.JsonData), db.GetParameter("modifiedSID", settings.ModifiedSID) });

        }


    }
}
