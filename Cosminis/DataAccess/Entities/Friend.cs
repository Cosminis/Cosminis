using System;
using System.Collections.Generic;

namespace DataAccess.Entities
{
    public partial class Friend
    {
        public int RelationshipId { get; set; }
        public int UserIdFrom { get; set; }
        public int UserIdTo { get; set; }
        public string Status { get; set; } = null!;

        public virtual User UserIdFromNavigation { get; set; } = null!;
        public virtual User UserIdToNavigation { get; set; } = null!;
    }
}
