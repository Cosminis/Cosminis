using System;
using System.Collections.Generic;

namespace DataAccess.Entities
{
    public partial class Order
    {
        public int OrderId { get; set; }
        public int UserIdFk { get; set; }
        public decimal Cost { get; set; }
        public DateTime TimeOrdered { get; set; }

        public virtual User UserIdFkNavigation { get; set; } = null!;
    }
}
