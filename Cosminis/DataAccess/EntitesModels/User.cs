using System;
using System.Collections.Generic;

namespace DataAccess.Entities
{
    public partial class User
    {
        public override string ToString()
        { 
            int goldCount = this.GoldCount ?? 0;
            int eggCount = this.EggCount ?? 0;
            int eggTimer = this.EggTimer ?? 0;
            return String.Format("UserId: {0}, Username: {1}, GoldCount: {2}, EggCount: {3}, EggTimer: {4}", this.UserId, this.Username, goldCount, eggCount, eggTimer);
        }  

        
        public User(int UserId, string username, string password, int? Goldcount, int? Eggcount, int? Eggtimer)
        {
            UserId = this.UserId;
            username = this.Username;
            password = this.Password;
            Goldcount = this.GoldCount;
            Eggcount = this.EggCount;
            Eggtimer = this.EggTimer;
        }
    }
}
