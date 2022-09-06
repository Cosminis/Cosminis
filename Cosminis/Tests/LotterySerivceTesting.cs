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

        }
        [Fact]
        public void CanPlayReturnsValueWithProperGemCount()
        {

        }

        /*
         *      Winnings Test
         */
        [Fact]
        public void WinningsReturnsListWithSpins()
        {

        }
        [Fact]
        public void WinningsReturnsNewListWithNoSpins()
        {

        }
        /*
         *      GiveRewards
         */
        [Fact]
        public void GiveRewardsReturnsListOfWinningsWithSpins()
        {

        }
        [Fact]
        public void GiveRewardsReturnsNewListForNoSpins()
        {

        }
        /*
         *      Prize Tests
         */
        [Fact]
        public void PrizeReturnsValueWithinRange()
        {

        }
    }
}
