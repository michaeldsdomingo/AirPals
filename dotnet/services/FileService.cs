using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Amazon;
using Amazon.S3;
using Amazon.S3.Transfer;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Sabio.Models.Domain.File;
using File = Sabio.Models.Domain.File.File;
using Sabio.Models.AppSettings;
using Microsoft.Extensions.Options;
using Sabio.Models.Enums;

namespace Sabio.Services
{
 

    public class FilesService : IFilesService
    {
        private const string PDF = "application/pdf";
        private const string TEXT = "text/plain";
        private const string JPG = "image/jpeg";
        private const string PNG = "image/png";
        private const string DOCX = "application/octet-stream";

        IDataProvider _data = null;
        private AWSStorageConfig _awsStorageConfig;

        public FilesService(IDataProvider data, IOptions<AWSStorageConfig> awsStorageConfig)
        {
            _data = data;
            _awsStorageConfig = awsStorageConfig.Value;
            
        }

        public Paged<File> GetAll(int pageIndex, int pageSize)
        {
            string procName = "dbo.Files_SelectAll";

            Paged<File> pagedResult = null;

            List<File> result = null;

            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@PageIndex", pageIndex);
                collection.AddWithValue("@PageSize", pageSize);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                File file = MapFile(reader, ref startingIndex);
    
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (result == null)
                {
                    result = new List<File>();
                }

                result.Add(file);
            });

            if (result != null)
            {
                pagedResult = new Paged<File>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public File Get(int id)
        {
            string procName = "dbo.Files_Select_ById";

            File file = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);
            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                file = MapFile(reader, ref startingIndex);
            });
                

            return file;
        }

        public Paged<File> GetByCreatedBy(int pageIndex, int pageSize, int createdBy)
        {
            string procName = "dbo.Files_Select_ByCreatedBy";

            Paged<File> pagedResult = null;

            List<File> result = null;

            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@PageIndex", pageIndex);
                collection.AddWithValue("@PageSize", pageSize);
                collection.AddWithValue("@CreatedBy", createdBy);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                File file = MapFile(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (result == null)
                {
                    result = new List<File>();
                }

                result.Add(file);

            });

            if (result != null)
            {
                pagedResult = new Paged<File>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public async Task<List<BaseFile>> Add(List<IFormFile> files, int currentUserId)
        {
            List<BaseFile> baseFiles = null;
     
            IAmazonS3 s3Client = new AmazonS3Client(_awsStorageConfig.AccessKey, _awsStorageConfig.Secret, RegionEndpoint.USWest2);

            foreach(IFormFile file in files)
            {
                string fileName = file.FileName;

                int fileTypeId = GetFileTypeId(file.ContentType);

                string keyName = "airpals/" + Guid.NewGuid().ToString() + "_" + fileName;

                string url = _awsStorageConfig.Domain + keyName;
                
                using (Stream reader = file.OpenReadStream())
                {
                    var fileTransferUtility = new TransferUtility(s3Client);
                    await fileTransferUtility.UploadAsync(reader, _awsStorageConfig.BucketName, keyName);
                }

                if (baseFiles == null)
                {
                    baseFiles = new List<BaseFile>();
                }

                int id = AddToDb(url, fileName, fileTypeId, currentUserId);

                if (id > 0) {
                    BaseFile baseFile = new BaseFile
                    {
                        Id = id,
                        Url = url
                    };

                    baseFiles.Add(baseFile);
                }
            }

            return baseFiles;
        }

        private int AddToDb(string url, string fileName, int fileTypeId, int userId)
        {
            int id = 0;
            string procName = "dbo.Files_Insert_V2";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Url", url);
                collection.AddWithValue("@FileName", fileName);
                collection.AddWithValue("@FileTypeId", fileTypeId);
                collection.AddWithValue("@CreatedBy", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                collection.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                Int32.TryParse(oId.ToString(), out id);
            });

            return id;

        }

        private static int GetFileTypeId(string fileType)
        {
            int fileTypeId = 0;
            
            switch (fileType)
            {
                case PDF:
                    fileTypeId = (int)FileType.PDF;
                    break;
                case TEXT:
                    fileTypeId = (int)FileType.Text;
                    break;
                case JPG:
                    fileTypeId = (int)FileType.Image;
                    break;
                case PNG:
                    fileTypeId = (int)FileType.Image;
                    break;
                case DOCX:
                    fileTypeId = (int)FileType.Doc;
                    break;
            }

            return fileTypeId;
        }

        private static File MapFile(IDataReader reader,  ref int startingIndex)
        {
            File file;

            file = new File();

            file.Id = reader.GetSafeInt32(startingIndex++);
            file.Url = reader.GetSafeString(startingIndex++);
            file.FileTypeId = reader.GetSafeInt32(startingIndex++);
            file.CreatedBy = reader.GetSafeInt32(startingIndex++);
            file.DateCreated = reader.GetDateTime(startingIndex++);

            return file;
        }

    }
}