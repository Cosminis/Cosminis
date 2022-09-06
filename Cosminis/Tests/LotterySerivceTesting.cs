using Moq;
using DataAccess.Entities;
using CustomExceptions;
using Services;
using Xunit;
using DataAccess;

namespace Tests
{
    public class LotterySerivceTesting
    {
        /*
         *      CanPlay Tests
         */
        [Fact]
        public void CanPlayReturnsZeroWithImproperGemCount()
        {
            var moqRepo = new Mock<IResourceGen>();
            LotteryService v = new(moqRepo.Object);
            User user = new()
            {
                UserId = 1,
                GemCount = 1

            };
            int spin = v.CanPlay(5, user);
            Assert.Equal(0, spin);
        }
        [Fact]
        public void CanPlayReturnsValueWithProperGemCount()
        {
            var moqRepo = new Mock<IResourceGen>();
            LotteryService v = new(moqRepo.Object);
            User user = new()
            {
                UserId = 1,
                GemCount = 5

            };
            int spin = v.CanPlay(5, user);
            Assert.Equal(1, spin);
        }

        /*
         *      Winnings Test
         */
        [Fact]
        public void WinningsReturnsListWithSpins()
        {
            var moqRepo = new Mock<IResourceGen>();
            LotteryService v = new(moqRepo.Object);
            List<int> s = v.Winnings(1);
            Assert.Equal(6, s.Count());
            Assert.NotEmpty(s);
        }
        [Fact]
        public void WinningsReturnsNewListWithNoSpins()
        {
            var moqRepo = new Mock<IResourceGen>();
            LotteryService v = new(moqRepo.Object);
            List<int> s = v.Winnings(0);
            Assert.Equal(6, s.Count());
            Assert.Equal(new int[6].ToList(), s);
        }
        /*
         *      GiveRewards
         */
        [Fact]
        public void GiveRewardsReturnsListOfWinningsWithSpins()
        {
            var moqRepo = new Mock<IResourceGen>();
            LotteryService v = new(moqRepo.Object);
            User user = new()
            {
                UserId = 1,
                GemCount = 5

            };
            List<int> ou = v.GiveRewards(1, user);
            Assert.Equal(9, ou.Count());
            Assert.NotEmpty(ou);
        }
        [Fact]
        public void GiveRewardsReturnsNewListForNoSpins()
        {
            var moqRepo = new Mock<IResourceGen>();
            LotteryService v = new(moqRepo.Object);
            User user = new()
            {
                UserId = 1,
                GemCount = 5

            };
            List<int> ou = v.GiveRewards(0, user);
            Assert.Equal(9, ou.Count());
            Assert.Equal(new int[9].ToList(), ou);
        }
        /*
         *      Prize Tests
         */
        [Fact]
        public void PrizeReturnsValueWithinRange()
        {
            var moqRepo = new Mock<IResourceGen>();
            LotteryService v = new(moqRepo.Object);
            int rn = v.Prize();              
            Assert.InRange(rn, 1, 100);
        }
    }
}
