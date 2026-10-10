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
| Chawkbazar iftar market (boro baper polay khay, jilapi, haleem, borhani) | [Wikipedia](https://en.wikipedia.org/wiki/Chawkbazar_Iftar_Market), [The Business Standard](https://www.tbsnews.net/features/food/famous-iftar-lane-chawkbazar-running-more-legacy-taste-818521), [The Daily Star](https://www.thedailystar.net/culture/news/chawkbazar-comes-alive-iftar-delicacies-3837901) |
| Shahi jilapi (Chawkbazar) | [Wikipedia](https://en.wikipedia.org/wiki/Shahi_jilapi) |
| Sweet shops: Madina (Lalbagh), Omullo (Shakharibazar), Green Sweet Meat (Thatari Bazar), Shonamia (Gandaria), Moron Chand and Grandsons (Nawabpur) | [The Financial Express, Top sweets shops in Dhaka](https://thefinancialexpress.com.bd/lifestyle/food/top-sweets-shops-in-dhaka-where-you-can-find-varieties-of-sweets) |
| Haleem: Mona Bhai (Mohammadpur), Khaza (Gopibag), Mama (Kalabagan) | [The Business Standard, 5 hearty haleems in Dhaka](https://www.tbsnews.net/features/food/5-hearty-haleems-dhaka-city-407646) |
| Decent Bakery (Dhanmondi, haleem) | [The Daily Star, Best haleem and jilapi of Dhaka recognised](https://www.thedailystar.net/city/news/best-haleem-and-jilapi-dhaka-recognised-1748149) |
| Breakfast: Nirob Hotel (Chankharpul), Chowrangi Restaurant (Banglabazar), Hirajheel Hotel (Motijheel), Deshbondhu Sweetmeat (Hathkhola), Green Sweetmeat (Thatari Bazar) | [The Business Standard, 5 classic breakfast places in Dhaka](https://www.tbsnews.net/feature/food/5-classic-breakfast-places-dhaka-163855) |
| Pitha: Adda Prabartana, Mirpur Pitha Ghar, Bailey Pitha Ghor, Shantinagar Pitha Ghar | [The Business Standard, Best places to get pitha this winter](https://www.tbsnews.net/feature/food/best-places-get-pitha-winter-186202) |
| Uttara Pitha Ghar | [The Daily Star, Pithas](https://www.thedailystar.net/lifestyle/check-it-out/pithas-1339204) |

Prices in the iftar articles change every year, so none are stored.

Badda and Jatrabari: no article found that names a shop there, so none is listed. Contributors add them in the app.
| Kacchi: Kolkata Kachchi (Satrowza), Grand Nawab (Old Dhaka), Kachchi Bhai, Bashmoti Kachchi (Jigatola) | [The Business Standard, Best 5 Dhakai kacchi](https://www.tbsnews.net/feature/food/best-5-dhakai-kacchi-town-137398) |
| Morog polao: Jhunu Polao Ghor (Narinda) | [The Business Standard](https://www.tbsnews.net/feature/food/jhunu-polao-ghor-serving-aromatic-morog-polao-51-years-229126) |
| Nihari: Nihariwala (Banani), Mia Bhai (Banasree), Peshwarain (Wari), Grand Chandu Shahi Nihari, Maa Shahi Haleem and Nihari (Lalbagh) | [The Business Standard, Best nihari in Dhaka](https://www.tbsnews.net/features/food/5-restaurants-around-dhaka-satisfy-your-nihari-cravings-525830) |
| Maa Shahi Halim, Siddiqui Bhai (Subal Das Lane, Lalbagh) | [The Daily Star](https://www.thedailystar.net/my-dhaka/news/why-old-dhakas-siddiqui-bhai-nihari-must-try-3972511) |
| Lahori Nihari Dhaka (West Dhanmondi) | [Dhaka Tribune](https://www.dhakatribune.com/business/329877/lahori-nihari-dhaka-a-hidden-gem-in-dhanmondi) |
| Shawarma House, Arabian Fast Food (older article, Dhanmondi area) | [The Daily Star, For the love of shawarma](https://www.thedailystar.net/news/for-the-love-of-shawarma) |
| Tea: Pannu's Tea (Nazira Bazar), Cha Chai (Gulshan Avenue), Star Hotel Thatari Bazar | [The Daily Star, The best tea spots you can find](https://www.thedailystar.net/life-living/food-recipes/news/the-best-tea-spots-you-can-find-3161996) |

Mishti doi: no newspaper names a Dhaka shop for it, so none is listed.

## Chattogram (migration 0018)

| What | Source |
|---|---|
| Mezzan Haile Aiyun (Shulakbahar, mezbani) | [Prothom Alo](https://www.prothomalo.com/lifestyle/recipe/legbd117mu), [The Business Standard, Mezban](https://www.tbsnews.net/features/food/mezban-cuisine-choice-feasts-310606) |
| Kutumbari (AK Khan), Bir Chattala (SS Khaled Road), Member Hotel (Pahartali), Hotel Nizam (railway station area) | [The Business Standard, Where to find the best desi food in Chattogram](https://www.tbsnews.net/features/food/where-find-best-desi-food-chattogram-310618) |
| Hamid Bhai er Malai Tea (beside MA Aziz Stadium) | [The Business Standard, Drinks and dessert in Chattogram](https://www.tbsnews.net/features/food/food-happiness-drinks-dessert-chattogram-310639) |
| Goni Bakery (biscuits baked in wood-fired ovens) | [The Daily Star via Asia News Network](https://asianews.network/why-you-should-explore-bangladeshs-chattogram-the-city-of-stories-shores-and-surprises/) |
| Jhautola street food (chaap, haleem) | [The Business Standard, The delicious street foods of Chattogram](https://www.tbsnews.net/features/food/delicious-street-foods-chattogram-363451) |

## Sylhet (migration 0019)

| What | Source |
|---|---|
| Akhni, the iftar dish of Sylhet | [The Daily Star, Akhni: a staple at Sylheti iftars](https://www.thedailystar.net/news/bangladesh/news/akhni-staple-sylheti-iftars-3583866) |
| Shatkora beef | [Wikipedia](https://en.wikipedia.org/wiki/Satkara_beef) |
| Panshi and Pach Bhai (already seeded) linked to shatkora beef | Travel guides: [Hello Sylhet](https://hellosylhetcity.com/en/blog/a-taste-of-sylhet-must-try-sylheti-food-best-places), [Sylhet Tourist Guide](https://sylhettouristguide.com/restaurant/panshi). No newspaper names Sylhet shops, so no other Sylhet shop is listed. |

## Customer reviews

None are copied. Articles, Google Maps, Foodpanda and Facebook reviews belong to their authors and
platforms; reviews in ShojaShapta come only from people using the app (decision P5).
