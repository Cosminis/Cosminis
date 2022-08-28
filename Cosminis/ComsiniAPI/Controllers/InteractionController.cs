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
public class InteractionController : ControllerBase
{
	private readonly InteractionService _interactionService;

    public InteractionController(InteractionService interactionService)
    {
        _interactionService = interactionService;
    }

    [Route("/setCompanion")]
    [HttpPut()]
    public ActionResult<bool> Put(int userId, int companionId)
    {
        bool setShowcase = this._interactionService.SetShowcaseCompanion(userId, companionId); 
        if(setShowcase == true)
        {
            return Ok("gj");
        }
        else
        {
            return Conflict("You cannot set your showcase companion to a companion that you do not own.");
        }
    }

}
