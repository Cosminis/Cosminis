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
        /// 
        /// </summary>
        /// <param name="gemSpent"></param>
        /// <param name="userID"></param>
        /// <returns></returns>
        [HttpGet()]
        public ActionResult<int> Get(int gemSpent, int userID)
        {
            User user = _user.SearchUserById(userID);
            return _service.CanPlay(gemSpent, user);
        }

        [HttpPut()]
        public ActionResult<List<int>> Put(int spins, [FromBody] User user)
        {
            if (spins == 0)
            {
                return BadRequest("You Broke!");
            }
            return Accepted(user);
        }
    }
}
