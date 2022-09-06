using Moq;
using DataAccess.Entities;
using CustomExceptions;
using Services;
using Xunit;
using DataAccess;
using Controllers;

namespace Tests;

public class LotteryControllerTesting
{  
    /*
    *     Get Controller Testing
    */
    [Fact]
    public void ControllerGet()
    {
    var mockedLotteryService = new Mock<LotteryService>();
    var mockedUserService = new Mock<UserServices>();
    User user = new(){
        UserId = 1,
        GemCount = 10
    };
    
    LotteryController controller = new LotteryController(mockedLotteryService.Object,mockedUserService.Object);
    }
    /*
    *     Put Controller Testing
    */
    [Fact]
    public void ControllerPutBadRequest()
    {
    var mockedLotteryService = new Mock<LotteryService>();
    var mockedUserService = new Mock<UserServices>();
    LotteryController controller = new LotteryController(mockedLotteryService.Object,mockedUserService.Object);

    }
    [Fact]
    public void ControllerPutAccepted()
    {
    var mockedLotteryService = new Mock<LotteryService>();
    var mockedUserService = new Mock<UserServices>();
    LotteryController controller = new LotteryController(mockedLotteryService.Object,mockedUserService.Object);

    }
}