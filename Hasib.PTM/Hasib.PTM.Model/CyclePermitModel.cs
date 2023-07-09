using Hasib.Core;
using Hasib.DBHelpers;
using System;
using System.Data.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hasib.PTM.Model
{
    public class CyclePermit
    {
        public int CyclepermitID { get; set; }
        public int CycleID { get; set; }
        public string PermitFor { get; set; }
        public string PermitForAR { get; set; }
        public string PermitForEN { get; set; }
        public int? UserGroupID { get; set; }
        public string GroupNameAR { get; set; }
        public string GroupNameEN { get; set; }
        public int? UserID { get; set; }
        public string LoginName { get; set; }
        public string UserNameAR { get; set; }
        public string UserNameEN { get; set; }
        public string DepartmentCode { get; set; }
        public string DepartmentNameAR { get; set; }
        public string DepartmentNameEN { get; set; }
        public int? PurchaserID { get; set; }
        public int? EmployeeNumber { get; set; }
        public string EmployeeNameAR { get; set; }
        public string EmployeeNameEN { get; set; }
        public decimal FromAmount { get; set; }
        public decimal ToAmount { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int CreatedSID { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? ModifiedSID { get; set; }
        public DateTime ModifiedOn { get; set; }
        public byte[] RowStamp { get; set; }
    }
    public class CyclePermitModel : BaseModel
    {
        public CyclePermitModel(DBHelper db) : base(db) { }
        public async Task<List<CyclePermit>> LoadCyclePermit(int? cycleID)
        {
            var rd = await db.GetDataReader("pPtmLoadCyclePermit", new DbParameter[] { db.GetParameter("cycleID", cycleID) });
            var res = new List<CyclePermit>();

            int c0 = rd.GetOrdinal("cyclepermitID");
            int c1 = rd.GetOrdinal("cycleID");
            int c2 = rd.GetOrdinal("permitFor");
            int c3 = rd.GetOrdinal("permitForAR");
            int c4 = rd.GetOrdinal("permitForEN");
            int c5 = rd.GetOrdinal("userGroupID");
            int c6 = rd.GetOrdinal("groupNameAR");
            int c7 = rd.GetOrdinal("groupNameEN");
            int c8 = rd.GetOrdinal("userID");
            int c9 = rd.GetOrdinal("loginName");
            int c10 = rd.GetOrdinal("userNameAR");
            int c11 = rd.GetOrdinal("userNameEN");
            int c12 = rd.GetOrdinal("departmentCode");
            int c13 = rd.GetOrdinal("departmentNameAR");
            int c14 = rd.GetOrdinal("departmentNameEN");
            int c15 = rd.GetOrdinal("purchaserID");
            int c16 = rd.GetOrdinal("employeeNumber");
            int c17 = rd.GetOrdinal("employeeNameAR");
            int c18 = rd.GetOrdinal("employeeNameEN");
            int c19 = rd.GetOrdinal("fromAmount");
            int c20 = rd.GetOrdinal("toAmount");
            int c21 = rd.GetOrdinal("fromDate");
            int c22 = rd.GetOrdinal("toDate");
            int c23 = rd.GetOrdinal("createdSID");
            int c24 = rd.GetOrdinal("createdOn");
            int c25 = rd.GetOrdinal("modifiedSID");
            int c26 = rd.GetOrdinal("modifiedOn");
            int c27 = rd.GetOrdinal("rowStamp");

            while (rd.Read())
            {
                var r = new CyclePermit();

                r.CyclepermitID = rd.GetInt32(c0);
                r.CycleID = rd.GetInt32(c1);
                r.PermitFor = rd.GetString(c2);
                r.PermitForAR = rd.GetString(c3);
                r.PermitForEN = rd.GetString(c4);
                if (!rd.IsDBNull(c5)) r.UserGroupID = rd.GetInt32(c5);
                if (!rd.IsDBNull(c6)) r.GroupNameAR = rd.GetString(c6);
                if (!rd.IsDBNull(c7)) r.GroupNameEN = rd.GetString(c7);
                if (!rd.IsDBNull(c8)) r.UserID = rd.GetInt32(c8);
                if (!rd.IsDBNull(c9)) r.LoginName = rd.GetString(c9);
                if (!rd.IsDBNull(c10)) r.UserNameAR = rd.GetString(c10);
                if (!rd.IsDBNull(c11)) r.UserNameEN = rd.GetString(c11);
                if (!rd.IsDBNull(c12)) r.DepartmentCode = rd.GetString(c12);
                if (!rd.IsDBNull(c13)) r.DepartmentNameAR = rd.GetString(c13);
                if (!rd.IsDBNull(c14)) r.DepartmentNameEN = rd.GetString(c14);
                if (!rd.IsDBNull(c15)) r.PurchaserID = rd.GetInt32(c15);
                if (!rd.IsDBNull(c16)) r.EmployeeNumber = rd.GetInt32(c16);
                if (!rd.IsDBNull(c17)) r.EmployeeNameAR = rd.GetString(c17);
                if (!rd.IsDBNull(c18)) r.EmployeeNameEN = rd.GetString(c18);
                r.FromAmount = rd.GetDecimal(c19);
                r.ToAmount = rd.GetDecimal(c20);
                r.FromDate = rd.GetDateTime(c21);
                if (!rd.IsDBNull(c22)) r.ToDate = rd.GetDateTime(c22);
                r.CreatedSID = rd.GetInt32(c23);
                r.CreatedOn = rd.GetDateTime(c24);
                if (!rd.IsDBNull(c25)) r.ModifiedSID = rd.GetInt32(c25);
                if (!rd.IsDBNull(c26)) r.ModifiedOn = rd.GetDateTime(c26);
                r.RowStamp = rd.GetValue(c27) as byte[];

                res.Add(r);
            }

            rd.Close();
            return res;
        }
    }
}
