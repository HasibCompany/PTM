using Hasib.Core;
using Hasib.DBHelpers;
using System;
using System.Data.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hasib.PTM.Model
{
    public class Services
    {
        public int ServiceID { get; set; }
        public int OrganizationID { get; set; }
        public string ServiceNumber { get; set; }
        public string DescriptionAR { get; set; }
        public string DescriptionEN { get; set; }
        public int? ParentID { get; set; }
        public string ParentDescriptionAR { get; set; }
        public string ParentDescriptionEN { get; set; }
        public bool HasChild { get; set; }
        public byte TreeLevel { get; set; }
        public short LevelSerial { get; set; }
        public short LevelOrder { get; set; }
        public string TreePath { get; set; }
        public bool IsDefault { get; set; }
        public int? AccountID { get; set; }
        public string AccountNumber { get; set; }
        public string AccountNameAR { get; set; }
        public string AccountNameEN { get; set; }
        public decimal? Price { get; set; }
        public decimal? MinPrice { get; set; }
        public bool IsSuspended { get; set; }
        public int CreatedSID { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedSID { get; set; }
        public DateTime ModifiedOn { get; set; }
        public byte[] RowStamp { get; set; }
    }
    public class ServicesModel : BaseModel
    {
        public ServicesModel(DBHelper db) : base(db) { }
        public async Task<List<Services>> LoadServices(int? organizationID, int? serviceID)
        {
            var rd = await db.GetDataReader("pPtmLoadServices", new DbParameter[] { db.GetParameter("organizationID", organizationID), db.GetParameter("serviceID", serviceID) });
            var res = new List<Services>();

            int c0 = rd.GetOrdinal("serviceID");
            int c1 = rd.GetOrdinal("organizationID");
            int c2 = rd.GetOrdinal("serviceNumber");
            int c3 = rd.GetOrdinal("descriptionAR");
            int c4 = rd.GetOrdinal("descriptionEN");
            int c5 = rd.GetOrdinal("parentID");
            int c6 = rd.GetOrdinal("parentDescriptionAR");
            int c7 = rd.GetOrdinal("parentDescriptionEN");
            int c8 = rd.GetOrdinal("hasChild");
            int c9 = rd.GetOrdinal("treeLevel");
            int c10 = rd.GetOrdinal("levelSerial");
            int c11 = rd.GetOrdinal("levelOrder");
            int c12 = rd.GetOrdinal("treePath");
            int c13 = rd.GetOrdinal("isDefault");
            int c14 = rd.GetOrdinal("accountID");
            int c15 = rd.GetOrdinal("accountNumber");
            int c16 = rd.GetOrdinal("accountNameAR");
            int c17 = rd.GetOrdinal("accountNameEN");
            int c18 = rd.GetOrdinal("price");
            int c19 = rd.GetOrdinal("minPrice");
            int c20 = rd.GetOrdinal("isSuspended");
            int c21 = rd.GetOrdinal("createdSID");
            int c22 = rd.GetOrdinal("createdOn");
            int c23 = rd.GetOrdinal("modifiedSID");
            int c24 = rd.GetOrdinal("modifiedOn");
            int c25 = rd.GetOrdinal("rowStamp");

            while (rd.Read())
            {
                var r = new Services();

                r.ServiceID = rd.GetInt32(c0);
                r.OrganizationID = rd.GetInt32(c1);
                r.ServiceNumber = rd.GetString(c2);
                r.DescriptionAR = rd.GetString(c3);
                r.DescriptionEN = rd.GetString(c4);
                if (!rd.IsDBNull(c5)) r.ParentID = rd.GetInt32(c5);
                if (!rd.IsDBNull(c6)) r.ParentDescriptionAR = rd.GetString(c6);
                if (!rd.IsDBNull(c7)) r.ParentDescriptionEN = rd.GetString(c7);
                r.HasChild = rd.GetBoolean(c8);
                r.TreeLevel = rd.GetByte(c9);
                r.LevelSerial = rd.GetInt16(c10);
                r.LevelOrder = rd.GetInt16(c11);
                r.TreePath = rd.GetString(c12);
                r.IsDefault = rd.GetBoolean(c13);
                if (!rd.IsDBNull(c14)) r.AccountID = rd.GetInt32(c14);
                if (!rd.IsDBNull(c15)) r.AccountNumber = rd.GetString(c15);
                if (!rd.IsDBNull(c16)) r.AccountNameAR = rd.GetString(c16);
                if (!rd.IsDBNull(c17)) r.AccountNameEN = rd.GetString(c17);
                if (!rd.IsDBNull(c18)) r.Price = rd.GetDecimal(c18);
                if (!rd.IsDBNull(c19)) r.MinPrice = rd.GetDecimal(c19);
                r.IsSuspended = rd.GetBoolean(c20);
                r.CreatedSID = rd.GetInt32(c21);
                r.CreatedOn = rd.GetDateTime(c22);
                if (!rd.IsDBNull(c23)) r.ModifiedSID = rd.GetInt32(c23);
                if (!rd.IsDBNull(c24)) r.ModifiedOn = rd.GetDateTime(c24);
                r.RowStamp = rd.GetValue(c25) as byte[];

                res.Add(r);
            }

            rd.Close();
            return res;
        }
        public async Task<Output> InsertServices(int? organizationID, int? parentID, string descriptionAR, string descriptionEN, bool? hasChild, bool? isDefault, int? accountID, decimal price, decimal minPrice, bool? isSuspended, int? createdSID)
        {
            return await db.ExecuteCUD("pPtmInsertServices", new DbParameter[] { db.GetParameter("organizationID", organizationID), db.GetParameter("parentID", parentID), db.GetParameter("descriptionAR", descriptionAR), db.GetParameter("descriptionEN", descriptionEN), db.GetParameter("hasChild", hasChild), db.GetParameter("isDefault", isDefault), db.GetParameter("accountID", accountID), db.GetParameter("price", price), db.GetParameter("minPrice", minPrice), db.GetParameter("isSuspended", isSuspended), db.GetParameter("createdSID", createdSID) });
        }
        public async Task<Output> UpdateServices(int? serviceID, int? organizationID, short levelSerial, string descriptionAR, string descriptionEN, int? parentID, bool? hasChild, short levelOrder, bool? isDefault, int? accountID, decimal price, decimal minPrice, bool? isSuspended, int? modifiedSID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmUpdateServices", new DbParameter[] { db.GetParameter("serviceID", serviceID), db.GetParameter("organizationID", organizationID), db.GetParameter("levelSerial", levelSerial), db.GetParameter("descriptionAR", descriptionAR), db.GetParameter("descriptionEN", descriptionEN), db.GetParameter("parentID", parentID), db.GetParameter("hasChild", hasChild), db.GetParameter("levelOrder", levelOrder), db.GetParameter("isDefault", isDefault), db.GetParameter("accountID", accountID), db.GetParameter("price", price), db.GetParameter("minPrice", minPrice), db.GetParameter("isSuspended", isSuspended), db.GetParameter("modifiedSID", modifiedSID), db.GetParameter("rowStamp", rowStamp) });
        }
        public async Task<Output> DeleteServices(int? serviceID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmDeleteServices", new DbParameter[] { db.GetParameter("serviceID", serviceID), db.GetParameter("rowStamp", rowStamp) });
        }
    }
}
