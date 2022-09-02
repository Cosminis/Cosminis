using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccess.Entities;
using DataAccess;
using Models;

namespace Services
{
    public class LotteryService
    {
        private IResourceGen _resource;
        public LotteryService(IResourceGen resource)
        {
            _resource = resource;
        }

        /// <summary>
        /// Goes through and selects prize
        /// </summary>
        /// <param name="spins">Number of spins</param>
        /// <returns>List of indexed rewards</returns>
        public List<int> Winnings(int spins)
        {
            int[] list = new int[6];
            while (spins > 0)
            {
                int num = Prize();
                switch (num)
                {
                    case < 25: // Food
                        list[0] = (Prize() / 2 != 0 ? Prize() / 2 : 1) + list[0];
                        break;
                    case < 50: //Gold
                        list[1] = (Prize() / 2 != 0 ? Prize() / 2 * 100 : 100) + list[1];
                        break;
                    case < 80: //Food
                        list[2] = (Prize() / 2 != 0 ? Prize() / 2 : 10) + list[2];
                        break;
                    case < 90: //Food
                        list[3] = (Prize() / 2 != 0 ? Prize() / 2 : 100) + list[3];
                        break;
                    case < 97://Gems
                        list[4] = (Prize() / 5 != 0 ? Prize() / 5 : 1) + list[4];
                        break;
                    default: //eggs
                        list[5] = 2 + list[5];
                        break;
                }
                spins--;
            }
            return list.ToList();
        }
        /// <summary>
        /// Random Number Generator for the Lottery
        /// </summary>
        /// <returns></returns>
        public int Prize()
        {
            Random num = new();
            return num.Next(1, 100);
        }

        /// <summary>
        /// States how many spins are available
        /// </summary>
        /// <param name="gemsPaid"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public int CanPlay(int gemsPaid, User user)
        {
            int yes = gemsPaid % 5 != 0 ? 0 : gemsPaid / 5;
            //Remove Gems
            gemsPaid *= -1;
            if (user.GemCount - gemsPaid < 0)
            {
                return 0;
            }
            user = _resource.UpdateGems((int)user.UserId!, gemsPaid);
            return yes;
        }
        /// <summary>
        /// Reward player 
        /// </summary>
        /// <param name="spins"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public List<int> GiveRewards(int spins, User user)
        {
            List<int> wins = Winnings(spins);
            //Add food
            int weight = wins[0] + wins[2] + wins[3];
            _resource.AddFood(user, weight);
            //Add Gold
            _resource.AddGold(user, wins[1]);
            //Add Gems
            _resource.UpdateGems((int)user.UserId!, wins[4]);
            //Add Egg
            _resource.AddEgg(user, wins[5]);
            return wins;
        }
    }
}