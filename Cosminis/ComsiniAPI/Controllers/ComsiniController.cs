using DataAccess.Entities;
using Microsoft.AspNetCore.Mvc;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Services;

namespace Controllers;

[ApiController]
public class CompanionController : ControllerBase
{
    private readonly CompanionServices _service;

    public CompanionController(CompanionServices service)
    {
        _service = service;
    }

    [Route("/companions/GetAll")]
    [HttpGet()]
    public ActionResult<List<Companion>> GetAllCompanions()
    {
        List<Companion> companionList = _service.GetAllCompanions();
        if(companionList.Count > 0)
        {
            return Accepted(companionList);
        }
        return NoContent();
    }         

    [Route("/companions/SearchByCompanionId")]
    [HttpGet()]
    public ActionResult<Companion> SearchForCompanionById(int companionId)
    {
        try
        {   
            Companion queriedCompanion = _service.GetCompanionByCompanionId(companionId);
            return Ok(queriedCompanion);
        }
        catch(CompNotFound)
        {
            return NotFound("There is no companion with this ID");
        }
        catch(ResourceNotFound)
        {
            return NotFound("Something went wrong with this request.");
        }        
    } 

    [Route("companions/SearchByUserId")]
    [HttpGet()]
    public ActionResult<List<Companion>> SearchForCompanionByUserId(int userId)
    {
        try
        {   
            List<Companion> queriedCompanion = _service.GetCompanionByUser(userId);
            return Ok(queriedCompanion);
        }
        catch(UserNotFound)
        {
            return NotFound("There is no user with this ID");
        }
        catch(ResourceNotFound)
        {
            return NotFound("Something went wrong with this request.");
        }         
    } 
}
