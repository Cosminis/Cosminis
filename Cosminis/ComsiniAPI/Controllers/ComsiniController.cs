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
    private readonly UserServices _userService;
    private readonly CompanionServices _companionRepo;
    private readonly ResourceServices _resourceRepo;

    public CompanionController(CompanionServices service, CompanionServices companionRepo, ResourceServices resourceRepo, UserServices userServices)
    {
        _service = service;
        _companionRepo = companionRepo;
        _resourceRepo = resourceRepo;
        _userService = userServices;
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

    [Route("companions/hatch")]
    [HttpGet]
    public ActionResult<int> HatchCompanion(string username)
    {
        try
        {
            return _companionRepo.HatchCompanion(username);
        }
        catch (UserNotFound)
        {
            return BadRequest("No User has that username");
        }
        catch (ResourceNotFound)
        {
            return BadRequest("No Eggs available");
        }
    }

    [Route("companions/generate")]
    [HttpPost()]
    public ActionResult<Companion> GenerateFreeCompanion(int userId)
    {
        try
        {
            User user = _userService.SearchUserById(userId);
            _resourceRepo.AddEgg(user, 1);
            return _companionRepo.GenerateCompanion(userId);
        }
        catch (TooFewResources)
        {
            return BadRequest("Brokey");
        }
        catch (UserNotFound)
        {
            return NotFound("How you are you here? Why no exist?");
        }
    }

    [Route("companions/setNickname")]
    [HttpPut]
    public ActionResult<Companion> SetCompanionNickname(int companionId, string? nickname)
    {
        try
        {
            return _companionRepo.SetCompanionNickname(companionId, nickname);
        }
        catch (CompNotFound)
        {
            return NotFound("This companion is a mystery to me");
        }
        catch (ResourceNotFound)
        {
            return NotFound("How you are you here? Why no exist?");
        }
    }    
}
