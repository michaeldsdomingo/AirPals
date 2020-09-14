using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.File;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;



namespace Sabio.Web.Api.Controllers
{   
    [Route("api/files")]
    [ApiController]
    public class FileApiController : BaseApiController
    {
        private IFilesService _service = null;
        private IAuthenticationService<int> _authService = null;
        
        public FileApiController(IFilesService service, 
            IAuthenticationService<int> authService,
            ILogger<FileApiController> logger) : base(logger)
        {
            _service = service;
            _authService = authService;

        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<File>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<File> page = _service.GetAll(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<File>> { Item = page };
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

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<File>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                File file = _service.Get(id);

                if (file == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemResponse<File> { Item = file };
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

        [HttpGet("current")]
        public ActionResult<ItemResponse<Paged<File>>> GetByCreatedBy(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int currentUserId = _authService.GetCurrentUserId();
                Paged<File> page = _service.GetByCreatedBy(pageIndex, pageSize, currentUserId);
                
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<File>> { Item = page };
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
                
        [HttpPost]
        public async Task<ActionResult<ItemsResponse<BaseFile>>> Create(List<IFormFile> files)
        {
            ObjectResult result = null;

            try
            {
                int currentUserId = _authService.GetCurrentUserId();
                
                List<BaseFile> urls = await _service.Add(files, currentUserId);

                result = Ok200(new ItemsResponse<BaseFile>() { Items = urls });
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }

            return result;
        }
    }
}