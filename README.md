# Cosminis #

## Overview ##
With the rise in popularity of metaverses, we are excited to announce our addition to it - Cosmini’s! A social media hub where users socialize and showcase their digital pets. Free from physical limits, users decide what their companion will be like; shapes and forms are checked only by their imagination! This application will allow users to sign in and register themselves. Trade, adopt and perform various activities with your pets. Most importantly, you can showcase your fluffy, scaly or ethereal companions to your friends and gain further resources for growing and expanding your team.

_Suggested from Team Default_
We present to you, an eccommerence marketplace built with an underlying social aspect and game for consumer interaction. Pulling from the familarity of gacha games, this is an ecommerce app focused on microtransactions. These microtransactions almost force a user to buy into the system to progress in a neopet esq. environment. A user can purchase gems, a resource not found in the game, to gain in game currency and food for their creatures. The gems also allow the user to enter a lottery where they can gain a large amount of resources for a small price of gems.

## User Stories ##
* Users should be able to obtain a companion.
* Users should be able to purchase gems in bundles and with a monthly subscription
* Users should be able to use gems in a shop to purchase in game resources
* Users should be able to use in game currency to purchase in game resources
* Users should be able to use gems in a lottery
* Users should be able to like/comment on content.
* Users should be able to add one another to their friends list.
* Users should be able to view user profiles.
* Users should be able to showcase their companion.
* Users should be able to login using a third party account.
* Users should be able to feed their companions
* Users should be able to pet their companions


## MVP Goals ##
* User Registration
* User Login
* Portal/Hub
* Liking/Commenting on content
* Posting Content
* Editing profile
* Search/view/add friend
* Resource/Economics system
    * When posting/commenting on posts/being liked/making new friends generates a finite amount of resources
    * In-game marketplace that allows users to trade food/gold/eggs
    * Marketplace that allows users to purchase gems
    * Marketplace that allows users to use gems on in-game resources
    * Lottery roulette system where users can spend gems to spin the wheel and gain a random selection of items
* Companion interactions
    * Petting
    * Feeding - use your resources to accomplish this
        * Sharing resources with other players and their Companions
            * Companion sale days where people can buy your Companion resources at a discounted rate
    * Conversation based on Companion status
        * Happy, sad, sick, angry, silly, tired....
* Companion Customization/Equipment
    * Stock elemental companions (volcanic, glacial, forest, sky, holy, dark)   
    * Creature species name, and also a nickname

## Stretch Goals ##
* Companion adventure/battle
    * Procedurally generated dungeons (easy, medium, hard) that can be run through many times as long as the companion food requirement is met
        * Mostly text-based but a graphic mini map
    * Infinite dungeon where you can try once a day:
        * Async multiplayer via assisting combatants (friends’ main companion)
        * Leaderboard
    * Dungeon rewards include gold(80%), food and gold(15%), eggs(5%)
    * Creature hunger level - depletes with dungeon runs
    * No pvp or co-op at first, but that can be a super stretch goal
* Hunger now influences the companions' combat stats
* In-game shop where you can use gold to buy food or items (mtx)
    * Items can be healing/offensive/or temporary power ups
    * Eventually more eggs or creature parts 
* Customization/Theme
* Visual/Audio Feedback
* Teams/Guilds
* Time limited events
* Inter-pet conversation

## Technologies ##
* C#
* SQL
* ASP.NET
* ADO.NET
* Azure Cloud Server
* Angular
* HTML
* CSS
* Typescript
* Github Action
* Entity Framework Core

## Tables ##
* Comments
* Companions
* Conversations
* EmotionCharts 
* FoodElements
* FoodInventories
* FoodStats
* Friends
* Orders
* Posts
* Species
* Users

## ERD ##
![Screenshot](P2_ERD_FinalFinal.png)


