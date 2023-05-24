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
        public int? ServiceID { get; set; }
        public int OrganizationID { get; set; }
        public short? TreeLevel { get; set; }
        public short? LevelSerial { get; set; }
        public string TreePath { get; set; }
        public string ServiceNumber { get; set; }
        public string DescriptionAR { get; set; }
        public string DescriptionEN { get; set; }
        public int? ParentID { get; set; }
        public string ParentDescriptionAR { get; set; }
        public string ParentDescriptionEN { get; set; }
        public bool HasChild { get; set; }
        public short? LevelOrder { get; set; }
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
            int c1 = rd.GetOrdinal("treeLevel");
            int c2 = rd.GetOrdinal("levelSerial");
            int c3 = rd.GetOrdinal("treePath");
            int c4 = rd.GetOrdinal("serviceNumber");
            int c5 = rd.GetOrdinal("descriptionAR");
            int c6 = rd.GetOrdinal("descriptionEN");
            int c7 = rd.GetOrdinal("parentID");
            int c8 = rd.GetOrdinal("parentDescriptionAR");
            int c9 = rd.GetOrdinal("parentDescriptionEN");
            int c10 = rd.GetOrdinal("hasChild");
            int c11 = rd.GetOrdinal("levelOrder");
            int c12 = rd.GetOrdinal("modifiedSID");
            int c13 = rd.GetOrdinal("modifiedOn");
            int c14 = rd.GetOrdinal("rowStamp");

            while (rd.Read())
            {
                var r = new Services();

                if (!rd.IsDBNull(c0)) r.ServiceID = rd.GetInt32(c0);
                if (!rd.IsDBNull(c1)) r.TreeLevel = rd.GetByte(c1);
                if (!rd.IsDBNull(c2)) r.LevelSerial = rd.GetInt16(c2);
                if (!rd.IsDBNull(c3)) r.TreePath = rd.GetString(c3);
                if (!rd.IsDBNull(c4)) r.ServiceNumber = rd.GetString(c4);
                if (!rd.IsDBNull(c5)) r.DescriptionAR = rd.GetString(c5);
                if (!rd.IsDBNull(c6)) r.DescriptionEN = rd.GetString(c6);
                if (!rd.IsDBNull(c7)) r.ParentID = rd.GetInt32(c7);
                if (!rd.IsDBNull(c8)) r.ParentDescriptionAR = rd.GetString(c8);
                if (!rd.IsDBNull(c9)) r.ParentDescriptionEN = rd.GetString(c9);
                if (!rd.IsDBNull(c10)) r.HasChild = rd.GetBoolean(c10);
                if (!rd.IsDBNull(c11)) r.LevelOrder = rd.GetInt16(c11);
                if (!rd.IsDBNull(c12)) r.ModifiedSID = rd.GetInt32(c12);
                if (!rd.IsDBNull(c13)) r.ModifiedOn = rd.GetDateTime(c13);
                if (!rd.IsDBNull(c14)) r.RowStamp = rd.GetValue(c14) as byte[];

                res.Add(r);
            }

            rd.Close();
            return res;
        }
        public async Task<Output> InsertServices(int? organizationID, int? parentID, string descriptionAR, string descriptionEN, bool? hasChild, int? createdSID)
        {
            return await db.ExecuteCUD("pPtmInsertServices", new DbParameter[] { db.GetParameter("organizationID", organizationID), db.GetParameter("parentID", parentID), db.GetParameter("descriptionAR", descriptionAR), db.GetParameter("descriptionEN", descriptionEN), db.GetParameter("hasChild", hasChild), db.GetParameter("createdSID", createdSID) });
        }
        public async Task<Output> UpdateServices(int? serviceID, short? levelSerial, string descriptionAR, string descriptionEN, int? parentID, bool? hasChild, short? levelOrder, int? modifiedSID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmUpdateServices", new DbParameter[] { db.GetParameter("serviceID", serviceID), db.GetParameter("levelSerial", levelSerial), db.GetParameter("descriptionAR", descriptionAR), db.GetParameter("descriptionEN", descriptionEN), db.GetParameter("parentID", parentID), db.GetParameter("hasChild", hasChild), db.GetParameter("levelOrder", levelOrder), db.GetParameter("modifiedSID", modifiedSID), db.GetParameter("rowStamp", rowStamp) });
        }
        public async Task<Output> DeleteServices(int? serviceID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmDeleteServices", new DbParameter[] { db.GetParameter("serviceID", serviceID), db.GetParameter("rowStamp", rowStamp) });
        }
    }
}
