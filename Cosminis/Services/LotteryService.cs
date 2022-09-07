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
        /// <returns>Random number</returns>
        public int Prize()
        {
            Random num = new();
            return num.Next(1, 100);
        }

        /// <summary>
        /// States how many spins are available
        /// </summary>
        /// <param name="gemsPaid">Gems paid provided from buttons</param>
        /// <param name="user">Current user playing</param>
        /// <returns>Number of times they can spin the wheel</returns>
        public int CanPlay(int gemsPaid, User user)
        {
            int yes = gemsPaid % 5 != 0 ? 0 : gemsPaid / 5;
            //Remove Gems 
            if (user.GemCount <gemsPaid)
            {
                return 0;
            }
            gemsPaid *= -1;
            user = _resource.UpdateGems((int)user.UserId!, gemsPaid);
            return yes;
        }
        /// <summary>
        /// Reward player 
        /// </summary>
        /// <param name="spins">Number of spins being played</param>
        /// <param name="user">Current User gambling</param>
        /// <returns>List of rewards</returns>
        public List<int> GiveRewards(int spins, User user)
        {
            List<int> wins = Winnings(spins); 
            int win1 = wins[0] == 0 ? 1 : wins[0] * 10;
            int win2 = wins[2] == 0 ? 1 : wins[2]*10;
            int win3 = wins[3] == 0 ? 1 : wins[3] * 10;
            wins.Add(_resource.WinFood(user, win1));
            wins.Add(_resource.WinFood(user, win2));
            wins.Add(_resource.WinFood(user, win3)); 
            _resource.AddGold(user, wins[1]); 
            _resource.UpdateGems((int)user.UserId!, wins[4]); 
            _resource.AddEgg(user, wins[5]);
            return wins;
        }
    }
}