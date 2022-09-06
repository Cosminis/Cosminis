using Moq;
using DataAccess.Entities;
using CustomExceptions;
using Services;
using Xunit;
using DataAccess;
using Controllers;
using Microsoft.AspNetCore.Mvc;

namespace Tests;

public class LotteryControllerTesting
{  
    /*
    *     Get Controller Testing
    */
    [Fact]
    public void ControllerGet()
    {
        var moqU = new Mock<IUserDAO>();
        var moqC = new Mock<ICompanionDAO>();
        var moqRepo = new Mock<IResourceGen>();
        var mockedLotteryService = new Mock<LotteryService>(moqRepo.Object);
        User user = new(){
            UserId = 1,
            GemCount = 10
        }; 
        moqU.Setup(r => r.GetUserByUserId(1)).Returns(user);
        var mockedUserService = new Mock<UserServices>(moqU.Object,moqC.Object);
        LotteryController controller = new LotteryController(mockedLotteryService.Object,mockedUserService.Object);
        ActionResult<int> s = controller.Get(5, user.UserId);
        Assert.NotNull(s); 
        Assert.Equal("Microsoft.AspNetCore.Mvc.OkObjectResult", s.Result.ToString());
        Assert.IsType<ActionResult<int>>(s);
        
    }
    /*
    *     Put Controller Testing
    */
    [Fact]
    public void ControllerPutBadRequest()
    {
        var moqU = new Mock<IUserDAO>();
        var moqC = new Mock<ICompanionDAO>();
        var moqRepo = new Mock<IResourceGen>();
        var mockedLotteryService = new Mock<LotteryService>(moqRepo.Object);
        User user = new()
        {
            UserId = 1,
            GemCount = 10
        };
        moqU.Setup(r => r.GetUserByUserId(1)).Returns(user);
        var mockedUserService = new Mock<UserServices>(moqU.Object, moqC.Object);
        LotteryController controller = new LotteryController(mockedLotteryService.Object, mockedUserService.Object);
        ActionResult<List<int>> s = controller.Put(0, user); 
        Assert.Equal("Microsoft.AspNetCore.Mvc.BadRequestObjectResult", s.Result.ToString());
        Assert.IsType<ActionResult<List<int>>>(s);

    }
    [Fact]
    public void ControllerPutAccepted()
    {
        var moqU = new Mock<IUserDAO>();
        var moqC = new Mock<ICompanionDAO>();
        var moqRepo = new Mock<IResourceGen>();
        var mockedLotteryService = new Mock<LotteryService>(moqRepo.Object);
        User user = new()
        {
            UserId = 1,
            GemCount = 10
        };
        moqU.Setup(r => r.GetUserByUserId(1)).Returns(user);
        var mockedUserService = new Mock<UserServices>(moqU.Object, moqC.Object);
        LotteryController controller = new LotteryController(mockedLotteryService.Object, mockedUserService.Object);
        ActionResult<List<int>> s = controller.Put(5, user);
        Assert.NotNull(s);
        Assert.Equal("Microsoft.AspNetCore.Mvc.AcceptedResult", s.Result.ToString());
        Assert.IsType<ActionResult<List<int>>>(s);

    }
}