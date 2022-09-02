export interface Order
{
    orderId : number;
    userIdFk : number;
    cost : number;
    timeOrdered : Date;
}