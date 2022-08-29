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
        /// <summary>
        /// Goes through and selects prize
        /// </summary>
        /// <param name="spins">Number of spins</param>
        /// <returns>List of indexed rewards</returns>
        public List<int> Winnings(int spins)
        {
            List<int> list = new List<int>();
            while (spins > 0)
            {
                int num = Prize();
                switch (num)
                {
                    case < 25: // Food
                        list[0] = Prize() / 2!=0?Prize()/2:1;
                        break;
                    case < 50: //Gold
                        list[1]= Prize() / 2!=0?Prize()/2 *100:100;
                        break;
                    case < 80: //Food
                        list[3]= Prize() / 2!=0?Prize()/2:10;
                        break;
                    case < 90: //Food
                        list[4]= Prize() / 2!=0?Prize()/2:100;
                        break;
                    case < 97://Gems
                        list[5]= Prize() / 5!=0?Prize()/5:1; 
                        break;
                    default: //eggs
                        list[6] = 2;
                        break;
                }
                spins--;
            }
            return list;
        }
        /// <summary>
        /// Random Number Generator for the Lottery
        /// </summary>
        /// <returns></returns>
        public int Prize()
        {
            Random num = new();
            return num.Next(1,100);
        }

        /// <summary>
        /// States how many spins are available
        /// </summary>
        /// <param name="gemsPaid"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        public int CanPlay(int gemsPaid,User user)
        {
            int yes= gemsPaid % 5 != 0 ? 0 : gemsPaid % 5;
            //Remove Gems
            return yes;
        }

        public User GiveRewards(int spins, User user)
        {
            List<int> wins = Winnings(spins); 
            //Add food

            //Add Gold

            //Add Gems

            return user;
        }
    }
}
