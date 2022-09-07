using DataAccess.Entities;
using Microsoft.AspNetCore.Mvc;
using CustomExceptions;
using Models;
using System.Data.SqlClient;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Services;
namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LotteryController : ControllerBase
    {
        private LotteryService _service;
        private UserServices _user;
        public LotteryController(LotteryService service, UserServices user)
        {
            _service = service;
            _user = user;
        }
        /// <summary>
        /// Checks if the user can spin the wheel
        /// </summary>
        /// <param name="gemSpent">Amount of gems spent from buttons</param>
        /// <param name="userID">current user ID</param>
        /// <returns>200: How many spins possible</returns>
        [HttpGet()]
        public ActionResult<int> Get(int gemSpent, int userID)
        {
            User user = _user.SearchUserById(userID);
            return Ok(_service.CanPlay(gemSpent, user));
        }

        /// <summary>
        /// Gives rewards to the user if they can play
        /// </summary>
        /// <param name="spins">Number of spins</param>
        /// <param name="user">Current User</param>
        /// <returns>202: List of Rewards <br>400: Spins=0</br></returns> 
        [HttpPut()]
        public ActionResult<List<int>> Put(int spins, [FromBody] User user)
        {
            if (spins == 0)
            {
                return BadRequest("You Broke!");
            }
            return Accepted(_service.GiveRewards(spins,user));
        }
    }
}
