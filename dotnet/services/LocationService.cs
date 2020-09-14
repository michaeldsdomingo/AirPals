using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Location;
using Sabio.Models.Domain.Messengers;
using Sabio.Models.Requests.Locations;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class LocationsService : ILocationsService, ILocationsMapper
    {

        IDataProvider _data = null;

        public LocationsService(IDataProvider data)
        {
            _data = data;
        }

        public Location Get(int id)
        {
            Location location = null;

            string procName = "[dbo].[Locations_Select_ById]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {

                paramCollection.AddWithValue("@Id", id);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                location = MapLocation<Location>(reader, ref startingIndex);

            });

            return location;
        }

        public List<Location> GetByCustomerId(int customerId)
        {
            List<Location> list = null;

            string procName = "[dbo].[Locations_Select_ByCustomerId]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@CustomerId", customerId);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Location location = MapLocation<Location>(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<Location>();
                }

                list.Add(location);
            });

            return list;

        }

        public List<Location> GetByContactId(int contactId)
        {
            List<Location> list = null;

            string procName = "[dbo].[Locations_Select_ByContactId]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@ContactId", contactId);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Location location = MapLocation<Location>(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<Location>();
                }

                list.Add(location);

            });

            return list;
        }

        public Paged<Location> GetAll(int pageIndex, int pageSize, int userId)
        {
            Paged<Location> pagedResult = null;

            List<Location> list = null;

            int totalCount = 0;

            string procName = "[dbo].[Locations_Select_ByCreatedBy]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@CreatedBy", userId);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                Location location = MapLocation<Location>(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<Location>();
                }

                list.Add(location);

            });

            if (list != null)
            {
                pagedResult = new Paged<Location>(list, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public int Add(LocationAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Locations_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                CommonParams(model, collection);
                collection.AddWithValue("@CreatedBy", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                collection.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {

                object objId = returnCollection["@Id"].Value;
                int.TryParse(objId.ToString(), out id);

            });

            return id;
        }

        public int AddByCustomer(LocationByCustomerAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Locations_Insert_ByCustomerId]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                CommonParams(model, collection);
                collection.AddWithValue("@CreatedBy", userId);
                collection.AddWithValue("@CustomerId", model.CustomerId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                collection.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {

                object objId = returnCollection["@Id"].Value;
                int.TryParse(objId.ToString(), out id);

            });

            return id;
        }

        public int AddByContact(LocationByContactAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Locations_Insert_ByContactId]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                CommonParams(model, collection);
                collection.AddWithValue("@CreatedBy", userId);
                collection.AddWithValue("@ContactId", model.ContactId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                collection.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {

                object objId = returnCollection["@Id"].Value;
                int.TryParse(objId.ToString(), out id);

            });

            return id;
        }

        public void Update(LocationUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Locations_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {

                CommonParams(model, collection);
                collection.AddWithValue("@ModBy", userId);
                collection.AddWithValue("@Id", model.Id);

            });
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Locations_Delete_ById]";

            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection collection)
                {

                    collection.AddWithValue("@Id", id);

                });
        }

        public List<State> GetAllStates()
        {
            string procName = "dbo.States_SelectAll";

            List<State> list = null;

            _data.ExecuteCmd(procName, inputParamMapper: null, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                State state = new State();

                if (list == null)
                {
                    list = new List<State>();
                }

                state.Id = reader.GetSafeInt32(startingIndex++);
                state.Code = reader.GetSafeString(startingIndex++);
                state.Name = reader.GetSafeString(startingIndex++);

                list.Add(state);
            });

            return list;
        }

        private static void CommonParams(LocationAddRequest model, SqlParameterCollection collection)
        {
            collection.AddWithValue("@LocTId", model.LocationTypeId);
            collection.AddWithValue("@LOne", model.LineOne);
            collection.AddWithValue("@LTwo", model.LineTwo);
            collection.AddWithValue("@City", model.City);
            collection.AddWithValue("@Zip", model.Zip);
            collection.AddWithValue("@StId", model.StateId);
            collection.AddWithValue("@Lat", model.Latitude);
            collection.AddWithValue("@Long", model.Longitude);

        }

        public T MapLocation<T>(IDataReader reader, ref int startingIndex) where T: BaseLocation, new ()
        {
            T location = new T();
   
            location.Id = reader.GetSafeInt32(startingIndex++);
            location.LocationTypeId = reader.GetSafeInt32(startingIndex++);
            location.LineOne = reader.GetSafeString(startingIndex++);
            location.LineTwo = reader.GetSafeString(startingIndex++);
            location.City = reader.GetSafeString(startingIndex++);
            location.Zip = reader.GetSafeString(startingIndex++);
            location.StateId = reader.GetSafeInt32(startingIndex++);

            if (reader.FieldCount > 7 && location is Location)
            {
                Location loc = location as Location;
             
                loc.Latitude = reader.GetDouble(startingIndex++);
                loc.Longitude = reader.GetDouble(startingIndex++);
                loc.DateCreated = reader.GetDateTime(startingIndex++);
                loc.DateModified = reader.GetDateTime(startingIndex++);
                loc.CreatedBy = reader.GetSafeInt32(startingIndex++);
                loc.ModifiedBy = reader.GetSafeInt32(startingIndex++);
            }
            return location;
        }
    }
}