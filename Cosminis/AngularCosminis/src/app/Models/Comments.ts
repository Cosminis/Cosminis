export interface Comment 
{
    commentId : number;
    userIdFk : number;
    postIdFk : number;
    content : string;
    commenter? : string;
}