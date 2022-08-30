using Moq;
using Xunit;
using Models;
using Services;
using DataAccess;
using CustomExceptions;

namespace Tests;

public class ResourceTests
{
    [Fact]
    public void PurchaseWithGemsNoItemsSelected()
    {
        int Gold = 0;
        int Egg = 0;
        int UserId = 0;
        int[] FoodQuantity = new int[6] { 0, 0, 0, 0, 0, 0 };

        var MockedUserRepo = new Mock<IUserDAO>();
        var MockedResRepo = new Mock<IResourceGen>();

        ResourceServices services = new ResourceServices(MockedResRepo.Object, MockedUserRepo.Object);

        Assert.Throws<GottaBuySomething>(() => services.PurchaseWithGems(UserId, FoodQuantity, Egg, Gold));
    }

    [Fact]
    public void PurchaseNoItemsSelected()
    {
        int Egg = 0;
        int UserId = 0;
        int[] FoodQuantity = new int[6] { 0, 0, 0, 0, 0, 0 };

        var MockedUserRepo = new Mock<IUserDAO>();
        var MockedResRepo = new Mock<IResourceGen>();

        ResourceServices services = new ResourceServices(MockedResRepo.Object, MockedUserRepo.Object);

        Assert.Throws<GottaBuySomething>(() => services.Purchase(UserId, FoodQuantity, Egg));
    }
}