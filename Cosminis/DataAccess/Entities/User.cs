﻿using System;
using System.Collections.Generic;

namespace DataAccess.Entities
{
    public partial class User
    {
        public User()
        {
            Comments = new HashSet<Comment>();
            Companions = new HashSet<Companion>();
            FoodInventories = new HashSet<FoodInventory>();
            FriendUserIdFromNavigations = new HashSet<Friends>();
            FriendUserIdToNavigations = new HashSet<Friends>();
            Posts = new HashSet<Post>();
            PostIdFks = new HashSet<Post>();
        }

        public int? UserId { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public DateTime AccountAge { get; set; } = DateTime.Now;
        public int? GoldCount { get; set; } 
        public int? EggCount { get; set; }
        public DateTime EggTimer { get; set; } = DateTime.Now;

        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<Companion> Companions { get; set; }
        public virtual ICollection<FoodInventory> FoodInventories { get; set; }
        public virtual ICollection<Friends> FriendUserIdFromNavigations { get; set; }
        public virtual ICollection<Friends> FriendUserIdToNavigations { get; set; }
        public virtual ICollection<Post> Posts { get; set; }

        public virtual ICollection<Post> PostIdFks { get; set; }
    }
}
