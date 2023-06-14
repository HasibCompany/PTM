using Hasib.Core;
using System.Collections.Generic;
using System.Threading.Tasks;
using Hasib.PTM.Model;
using Hasib.Common.Business.Shared;
using Hasib.Common.Model.Shared;
using System;

namespace Hasib.PTM.Business
{
    public class CodesBL : BaseBL
    {
        CodesModel CodesModel;
        GeneralAttachmentBL GeneralAttachmentBL;
        public CodesBL(int sessionId, int actionType) : base(sessionId, actionType)
        {
            CodesModel = new CodesModel(db);
            GeneralAttachmentBL = new GeneralAttachmentBL(db);
        }
        public async Task<List<Codes>> LoadCodes(string codeType)
        {
            try
            {
                return await CodesModel.LoadCodes(codeType);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> DeleteCodes(int? codeID, byte[] rowStamp)
        {
            try
            {
                return await CodesModel.DeleteCodes(codeID, rowStamp);
            }
            finally
            {
                db.Close();
            }
        }
        public async Task<Output> UpdateCodes(Codes obj, int? currentUserID)
        {
            Output output = new Output();
            try
            {
                db.BeginTransaction();
                db.SetIsUsed(true);
                output = await CodesModel.UpdateCodes(obj.CodeType, obj.CodeID, obj.DescriptionAR, obj.DescriptionEN, obj.IsActive, obj.IsDefault, obj.TypeFlag, obj.AppendixLink, obj.DurationType, obj.Duration, obj.SortOrder, obj.ModifiedSID, obj.RowStamp);
                await GeneralAttachmentBL.HandleGeneralAttachment(obj.insertedAttachments, obj.deletedAttachments, obj.CodeID, null, obj.CreatedSID, AttachmentBusinessType.PtmCodes, currentUserID);

                db.CommitTransaction();

                return output;
            }
            catch (Exception e)
            {
                throw e;
            }
            finally
            {
                db.SetIsUsed(false);
                db.Close();
            }
        }
        public async Task<Output> InsertCodes(Codes obj, int? currentUserID)
        {
            Output output = new Output();
            try
            {
                db.BeginTransaction();
                db.SetIsUsed(true);
                output = await CodesModel.InsertCodes(obj.CodeType, obj.Code, obj.DescriptionAR, obj.DescriptionEN, obj.IsActive, obj.IsDefault, obj.TypeFlag, obj.AppendixLink, obj.DurationType, obj.Duration, obj.SortOrder, obj.CreatedSID);
                obj.CodeID = output.InsertedID;

                await GeneralAttachmentBL.HandleGeneralAttachment(obj.insertedAttachments, obj.deletedAttachments, obj.CodeID, null, obj.CreatedSID, AttachmentBusinessType.PtmCodes, currentUserID);

                db.CommitTransaction();

                return output;
            }
            catch (Exception e)
            {
                throw e;
            }
            finally
            {
                db.SetIsUsed(false);
                db.Close();
            }
        }
    }
}
