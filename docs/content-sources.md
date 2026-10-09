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
| Tehari Ghar (Dhanmondi), Moti Biryani House (Nazira Bazar), Shad Tehari Ghar (Lalmatia), Maruf Biryani House (Hazaribagh) | [The Business Standard, Dhaka's top 5 tehari places](https://www.tbsnews.net/node/366331) |
| Farmgate pavement chitoi pitha with bhorta | [bdnews24 photo feature](https://bdnews24.com/media-en/hob5vtnb45) |
| Bukhara, Lucknow (Banani) | [The Financial Express](https://thefinancialexpress.com.bd/food/craving-indian-food-in-dhaka-give-these-restaurants-a-try) |
| Madhur Canteen (Shahbagh, Dhaka University) | [Wikipedia](https://en.wikipedia.org/wiki/Madhur_Canteen), [The Daily Star](https://www.thedailystar.net/node/1153813) |
| Iskaton Garden Road kabab vans (near Shahbagh) | [Prothom Alo, street food spots](https://www.prothomalo.com/lifestyle/spaqn1qg00) |
| Metro Kitchens (Bashundhara R/A, fish BBQ) | [The Daily Star, Five popular hangout zones](https://www.thedailystar.net/star-youth/five-popular-hangout-zones-1456795) |
| Star Hotel (started at Thatari Bazar, branch at Karwan Bazar), Rabbani Hotel (Mirpur 11), Hotel Jannat (Mohammadpur) | [The Business Standard Bangla, five old food hotels of Dhaka](https://www.tbsnews.net/bangla/feature/news-details-366616) |
| Mamun Biryani House (Nazirabazar) | [Prothom Alo, restaurants open nearly 24 hours](https://www.prothomalo.com/lifestyle/%E0%A6%A2%E0%A6%BE%E0%A6%95%E0%A6%BE%E0%A7%9F-%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A7%9F-%E0%A7%A8%E0%A7%AA-%E0%A6%98%E0%A6%A3%E0%A7%8D%E0%A6%9F%E0%A6%BE%E0%A6%87-%E0%A6%96%E0%A7%8B%E0%A6%B2%E0%A6%BE-%E0%A6%A5%E0%A6%BE%E0%A6%95%E0%A7%87-%E0%A6%AF%E0%A7%87%E0%A6%B8%E0%A6%AC-%E0%A6%B0%E0%A7%87%E0%A6%B8%E0%A7%8D%E0%A6%A4%E0%A7%8B%E0%A6%B0%E0%A6%BE%E0%A6%81) |

Badda and Jatrabari: no article found that names a shop there, so none is listed. Contributors add them in the app.

## Customer reviews

None are copied. Articles, Google Maps, Foodpanda and Facebook reviews belong to their authors and
platforms; reviews in ShojaShapta come only from people using the app (decision P5).
