export interface Cosminis 
{
    companionId : number;
    trainerId : number;
    userFk : number;
    speciesFk : number;
    nickname : string;
    emotion : number;
    mood : number;
    hunger : number;
    speciesNickname?:string;
    emotionString?:string;
    image?: string;
    hasBattled?: boolean;
}