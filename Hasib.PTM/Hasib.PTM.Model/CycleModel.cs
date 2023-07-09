using Hasib.Core;
using Hasib.DBHelpers;
using System;
using System.Data.Common;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hasib.PTM.Model
{
    public class Cycle
    {
        public int CycleID { get; set; }
        public string DescriptionAR { get; set; }
        public string DescriptionEN { get; set; }
        public string ContractMethod { get; set; }
        public string ContractMethodAR { get; set; }
        public string ContractMethodEN { get; set; }
        public bool PurchaseOrTender { get; set; }
        public decimal MinAmount { get; set; }
        public decimal MaxAmount { get; set; }
        public bool BuyKnownItem { get; set; }
        public bool BuyUnkownItem { get; set; }
        public bool BuyService { get; set; }
        public bool EnableWorkflow { get; set; }
        public bool AllowAllUsers { get; set; }
        public bool AllowAllPurchasers { get; set; }
        public bool DoCostEstimate { get; set; }
        public bool IsDefault { get; set; }
        public bool IsActive { get; set; }
        public int? ModifiedSID { get; set; }
        public DateTime ModifiedOn { get; set; }
        public byte[] RowStamp { get; set; }
        public int? OrganizationID { get; set; }
        public int? CreatedSID { get; set; }
    }
    public class CycleModel : BaseModel
    {
        public CycleModel(DBHelper db) : base(db) { }
        public async Task<List<Cycle>> LoadCycle(int? organizationID, int? cycleID)
        {
            var rd = await db.GetDataReader("pPtmLoadCycle", new DbParameter[] { db.GetParameter("organizationID", organizationID), db.GetParameter("cycleID", cycleID) });
            var res = new List<Cycle>();

            int c0 = rd.GetOrdinal("cycleID");
            int c1 = rd.GetOrdinal("descriptionAR");
            int c2 = rd.GetOrdinal("descriptionEN");
            int c3 = rd.GetOrdinal("contractMethod");
            int c4 = rd.GetOrdinal("contractMethodAR");
            int c5 = rd.GetOrdinal("contractMethodEN");
            int c6 = rd.GetOrdinal("purchaseOrTender");
            int c7 = rd.GetOrdinal("minAmount");
            int c8 = rd.GetOrdinal("maxAmount");
            int c9 = rd.GetOrdinal("buyKnownItem");
            int c10 = rd.GetOrdinal("buyUnkownItem");
            int c11 = rd.GetOrdinal("buyService");
            int c12 = rd.GetOrdinal("enableWorkflow");
            int c13 = rd.GetOrdinal("allowAllUsers");
            int c14 = rd.GetOrdinal("allowAllPurchasers");
            int c15 = rd.GetOrdinal("doCostEstimate");
            int c16 = rd.GetOrdinal("isDefault");
            int c17 = rd.GetOrdinal("isActive");
            int c18 = rd.GetOrdinal("modifiedSID");
            int c19 = rd.GetOrdinal("modifiedOn");
            int c20 = rd.GetOrdinal("rowStamp");

            while (rd.Read())
            {
                var r = new Cycle();

                r.CycleID = rd.GetInt32(c0);
                r.DescriptionAR = rd.GetString(c1);
                r.DescriptionEN = rd.GetString(c2);
                r.ContractMethod = rd.GetString(c3);
                r.ContractMethodAR = rd.GetString(c4);
                r.ContractMethodEN = rd.GetString(c5);
                r.PurchaseOrTender = rd.GetBoolean(c6);
                r.MinAmount = rd.GetDecimal(c7);
                r.MaxAmount = rd.GetDecimal(c8);
                r.BuyKnownItem = rd.GetBoolean(c9);
                r.BuyUnkownItem = rd.GetBoolean(c10);
                r.BuyService = rd.GetBoolean(c11);
                r.EnableWorkflow = rd.GetBoolean(c12);
                r.AllowAllUsers = rd.GetBoolean(c13);
                r.AllowAllPurchasers = rd.GetBoolean(c14);
                r.DoCostEstimate = rd.GetBoolean(c15);
                r.IsDefault = rd.GetBoolean(c16);
                r.IsActive = rd.GetBoolean(c17);
                if (!rd.IsDBNull(c18)) r.ModifiedSID = rd.GetInt32(c18);
                if (!rd.IsDBNull(c19)) r.ModifiedOn = rd.GetDateTime(c19);
                r.RowStamp = rd.GetValue(c20) as byte[];

                res.Add(r);
            }

            rd.Close();
            return res;
        }
        public async Task<Output> InsertCycle(int? organizationID, string descriptionAR, string descriptionEN, string contractMethod, bool? purchaseOrTender, decimal minAmount, decimal maxAmount, bool? buyKnownItem, bool? buyUnkownItem, bool? buyService, bool? enableWorkflow, bool? allowAllUsers, bool? allowAllPurchasers, bool? doCostEstimate, bool? isDefault, bool? isActive, int? createdSID)
        {
            return await db.ExecuteCUD("pPtmInsertCycle", new DbParameter[] { db.GetParameter("organizationID", organizationID), db.GetParameter("descriptionAR", descriptionAR), db.GetParameter("descriptionEN", descriptionEN), db.GetParameter("contractMethod", contractMethod), db.GetParameter("purchaseOrTender", purchaseOrTender), db.GetParameter("minAmount", minAmount), db.GetParameter("maxAmount", maxAmount), db.GetParameter("buyKnownItem", buyKnownItem), db.GetParameter("buyUnkownItem", buyUnkownItem), db.GetParameter("buyService", buyService), db.GetParameter("enableWorkflow", enableWorkflow), db.GetParameter("allowAllUsers", allowAllUsers), db.GetParameter("allowAllPurchasers", allowAllPurchasers), db.GetParameter("doCostEstimate", doCostEstimate), db.GetParameter("isDefault", isDefault), db.GetParameter("isActive", isActive), db.GetParameter("createdSID", createdSID) });
        }
        public async Task<Output> UpdateCycle(int? cycleID, int? organizationID, string descriptionAR, string descriptionEN, string contractMethod, bool? purchaseOrTender, decimal minAmount, decimal maxAmount, bool? buyKnownItem, bool? buyUnkownItem, bool? buyService, bool? enableWorkflow, bool? allowAllUsers, bool? allowAllPurchasers, bool? doCostEstimate, bool? isDefault, bool? isActive, int? modifiedSID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmUpdateCycle", new DbParameter[] { db.GetParameter("cycleID", cycleID), db.GetParameter("organizationID", organizationID), db.GetParameter("descriptionAR", descriptionAR), db.GetParameter("descriptionEN", descriptionEN), db.GetParameter("contractMethod", contractMethod), db.GetParameter("purchaseOrTender", purchaseOrTender), db.GetParameter("minAmount", minAmount), db.GetParameter("maxAmount", maxAmount), db.GetParameter("buyKnownItem", buyKnownItem), db.GetParameter("buyUnkownItem", buyUnkownItem), db.GetParameter("buyService", buyService), db.GetParameter("enableWorkflow", enableWorkflow), db.GetParameter("allowAllUsers", allowAllUsers), db.GetParameter("allowAllPurchasers", allowAllPurchasers), db.GetParameter("doCostEstimate", doCostEstimate), db.GetParameter("isDefault", isDefault), db.GetParameter("isActive", isActive), db.GetParameter("modifiedSID", modifiedSID), db.GetParameter("rowStamp", rowStamp) });
        }
        public async Task<Output> DeleteCycle(int? cycleID, byte[] rowStamp)
        {
            return await db.ExecuteCUD("pPtmDeleteCycle", new DbParameter[] { db.GetParameter("cycleID", cycleID), db.GetParameter("rowStamp", rowStamp) });
        }

    }
}
