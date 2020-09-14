using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Location;
using Sabio.Models.Requests.Locations;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;


namespace Sabio.Web.Api.Controllers
{
    [Route("api/locations")]
    [ApiController]
    public class LocationApiController : BaseApiController
    {
        private ILocationsService _service = null;
        private IAuthenticationService<int> _authService = null;
        
        public LocationApiController(ILocationsService service
            , ILogger<LocationApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("current")]
        public ActionResult<ItemResponse<Location>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                Paged<Location> paged = _service.GetAll(pageIndex, pageSize, userId);

                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Locations not found.");

                }
                else
                {
                    response = new ItemResponse<Paged<Location>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: ${ex.Message}");
                base.Logger.LogError(ex.ToString());

            }

            return StatusCode(code, response);

        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Location>> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Location location = _service.Get(id);


                if (location == null)
                {
                    code = 404;
                    response = new ErrorResponse("Location not found.");

                }
                else
                {
                    response = new ItemResponse<Location> { Item = location };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ex.Message}");

            }

            return StatusCode(code, response);
        }

        [HttpGet("customers/{customerId:int}")]
        public ActionResult<ItemsResponse<Location>> GetByCustomerId(int customerId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Location> list = _service.GetByCustomerId(customerId);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Location not found.");
                }
                else
                {
                    response = new ItemsResponse<Location> { Items = list };
                }

            }
            catch (Exception ex)
            {

                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ex.Message}");

            }

            return StatusCode(code, response);
        }

        [HttpGet("contacts/{contactId:int}")]
        public ActionResult<ItemsResponse<Location>> GetByContactId(int contactId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<Location> list = _service.GetByContactId(contactId);

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Location not found.");
                }
                else
                {
                    code = 200;
                    response = new ItemsResponse<Location> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ex.Message}");
            }

            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {

            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);

                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ex.Message}");

            }

            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(LocationAddRequest model)
        {

            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                int id = _service.Add(model, userId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);

            }

            return result;
        }

        [HttpPost("customer")]
        public ActionResult<ItemResponse<int>> CreateByCustomer(LocationByCustomerAddRequest model)
        {

            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                int id = _service.AddByCustomer(model, userId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);

            }

            return result;
        }

        [HttpPost("contact")]
        public ActionResult<ItemResponse<int>> CreateByContact(LocationByContactAddRequest model)
        {

            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                int id = _service.AddByContact(model, userId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);

            }

            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(LocationUpdateRequest model)
        {

            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                _service.Update(model, userId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: ${ex.Message}");
            }

            return StatusCode(code, response);
        }

        [HttpGet("states")]
        public ActionResult<ItemsResponse<State>> GetAllStates()
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<State> list = _service.GetAllStates();

                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<State> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }
    }
}