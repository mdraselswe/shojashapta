# Content sources

Where the launch content in `scripts/seed/*.ts` comes from. Rules: facts only (a name, an area, what it
is known for), nothing copied word for word, no ratings, prices or reviews. Shops close and move, so
every place is flagged `is_seed` and the app's verify flow is how real people correct it
(`select purge_seed_data();` removes the lot).

## Dhaka (migration 0013)

| What | Source |
|---|---|
| Haji Biryani (Nazira Bazar), Hanif, Bokhari, Bismillah Kabab Ghar, Badshahi Kabab, Kabab King, Beauty Lassi | [Prothom Alo English, Old Dhaka eateries](https://en.prothomalo.com/lifestyle/5j2cgkma56) |
| Nanna Miar Biryani, Junu Polao Ghor, Rahmania Kabab (Gandaria), Bot Tolar Kabab (Thatari Bazar) | [Dhaka Tribune, Culinary delights of Puran Dhaka](https://www.dhakatribune.com/bangladesh/351060/culinary-delights-of-puran-dhaka-a-voyage-through) |
| Beauty Lassi and Faluda (Johnson Road) | [The Business Standard](https://www.tbsnews.net/node/260941), [Wikipedia](https://en.wikipedia.org/wiki/Beauty_Lacchi_and_Faluda) |
| Bokhari (Johnson Road: lassi, faluda, kebab) | [The Daily Star Bangla](https://bangla.thedailystar.net/life-living/food-recipe/news-3906956) |
| Bakarkhani shops (Al-Amin, Shahjalal at Agamasi Lane, Yakub Ali at Nazira Bazar, Mostofa at Becharam Dewri) | [The Business Standard, Still in love with Bakarkhani](https://www.tbsnews.net/feature/food/still-love-bakarkhani) |
| Star Hotel, Hotel Al-Razzaque | [ESPNcricinfo, Dhaka's biryani](https://espncricinfo.com/story/dhaka-s-biryani-489063), [Lonely Planet](https://www.lonelyplanet.com/bangladesh/restaurants?page=1) |
| Fuchka: Jummon (Armanitola), Mujibur Miar (Bangshal), Mama (Lalmatia), Paanipuri (Gulshan) | [The Business Standard, The best fuchkawalas of Dhaka](https://www.tbsnews.net/node/493514) |
| Mostakim's Chaap (Mohammadpur) | [The Daily Star, Mostakim](https://tds-images.thedailystar.net/lifestyle/the-love-food/mostakim-tale-broken-dreams-1325557), [TBS, An evening at the chaap side of the town](https://www.tbsnews.net/node/29997) |
| Selim Kabab Ghor (Mohammadpur), Shawkat Kabab Ghor (Mirpur 10) | [The Financial Express](https://thefinancialexpress.com.bd/food/from-kabab-to-pitha-mohammadpurs-streets-tell-a-story-in-flavours), [Asia News Network / Daily Star](https://asianews.network/?p=176220) |
| Kallu Kabab Ghar (Mirpur) | [The Daily Star, Secret alleys](https://www.thedailystar.net/lifestyle/the-love-food/kallu-king-1487227) |
| Kasturi (Dhanmondi), Chittagong Bull (Gulshan) | [The Daily Star, Bengali cuisine in Dhaka](https://www.thedailystar.net/life-living/food-recipes/news/top-7-places-try-bengali-cuisine-dhaka-3113316), [Financial Express](https://thefinancialexpress.com.bd/lifestyle/food/craving-indian-food-in-dhaka-give-these-restaurants-a-try) |
| Star Kabab (Dhanmondi) | [Lonely Planet](https://www.lonelyplanet.com/bangladesh/restaurants?page=1) |
| Kacchi Wala (Uttara) | [The Daily Star](https://www.thedailystar.net/lifestyle/news/kacchi-wala-2072745) |

## Customer reviews

None are copied. Articles, Google Maps, Foodpanda and Facebook reviews belong to their authors and
platforms; reviews in ShojaShapta come only from people using the app (decision P5).
