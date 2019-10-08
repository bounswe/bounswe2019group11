require('dotenv').config();
console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');
const database = require('../helpers/database');
var async = require('async')
var User = require('../models/user')
var Article = require('../models/article')
var TradingEquipment = require('../models/tradingEquipment')

const conn = async()=> {
    await database.establishConnection();
}
var users = []
var articles = []
var tradingEquipments = []

function userCreate(name, surname, email, password, idNumber, iban, cb) {
    userdetail = {name:name , surname: surname,email:email,password:password,idNumber:idNumber,iban:iban }

    var user = new User(userdetail);

    user.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New user: ' + user);
        users.push(user)
        cb(null, user)
    }  );
}


function articleCreate(title, body, authorId, rank,comment, cb) {
    articledetail = {
        title: title,
        body: body,
        authorId: authorId,
        rank: rank
    }
    if (genre != false) articledetail.comment = comment

    var article = new Article(articledetail);
    article.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log('New Article: ' + article);
        articles.push(article)
        cb(null, article)
    }  );
}


function tradingEquipmentCreate(name, sellP, buyP, cb) {
    tradingEquipmentdetail = {
        name: name,
        sellPrice: sellP,
        buyPrice: buyP

    }
    var tradingEquipment = new TradingEquipment (tradingEquipmentdetail);
    tradingEquipment.save(function (err) {
        if (err) {
            console.log('ERROR CREATING tradingEquipment: ' + tradingEquipment);
            cb(err, null)
            return
        }
        console.log('New tradingEquipment: ' + tradingEquipment);
        tradingEquipments.push(tradingEquipment)
        cb(null, tradingEquipment)
    }  );
}


function createUsersAndTE(cb) {
    async.series([
            function(callback) {
                userCreate('Cansu', 'Tekin', 'eurohack@yahoo.ca', '123456',"11111111111","TR480006274832592429697373", callback);
            },
            function(callback) {
                userCreate('Kâni', 'Hayal', 'mcrawfor@comcast.net', '123456',"11111111112","TR510006257213591611697964\n" +
                    "\n", callback);
            },
            function(callback) {
                userCreate('Ugur', 'Gultekin', 'report@comcast.net', '123456',"11111111113","TR900006252256359556981742", callback);
            },
            function(callback) {
                userCreate('Bob', 'Billings', 'hellfire@sbcglobal.net', '123456',"11111111114","TR810006221368259924941966", callback);
            },
            function(callback) {
                userCreate('Jim', 'Jones', 'cderoove@hotmail.com', '123456',"11111111115","TR840006234977194221895499" , callback);
            },
            function(callback) {
                tradingEquipmentCreate("AAPL",225,227, callback);
            },
            function(callback) {
                tradingEquipmentCreate("AMZN", 1720,1732 , callback);
            },
            function(callback) {
                tradingEquipmentCreate("TSLA" ,230,237, callback);
            },
        ],
        // optional callback
        cb);
}


function articleCreate(cb) {
    async.series([
            function(callback) {
                articleCreate('Low-Cost Investing Can’t Get Any Lower Than Free', 'Charles Schwab said Tuesday that it would allow customers to trade stocks and exchange-traded funds for free, ramping up the intensity of brokers’ fight for the average investor’s dollars.\n' +
                    '\n' +
                    'The cost of investing has been steadily falling, and Peter Crawford, Schwab’s chief financial officer, acknowledged in a statement that the elimination of trading commissions had been pretty much inevitable.\n' +
                    '\n' +
                    '“We are seeing new firms trying to enter our market — using zero- or low-equity commissions as a lever,” Mr. Crawford said. “We’re not feeling competitive pressure from these firms … yet. But we don’t want to fall into the trap that a myriad of other firms in a variety of industries have fallen into and wait too long to respond to new entrants.”\n' +
                    '\n' +
                    'The commission-free trading structure will go into effect Monday for accounts of all sizes, wiping out Schwab’s $4.95-per-trade charge. (Option investors will continue to pay 65 cents per contract, though commissions were eliminated.)\n' +
                    '\n' +
                    'It’s a noteworthy move coming from Schwab, which, once upon a time, was the new entrant paving the way for retail investors. And it’s a mark of how drastically the investment industry has changed over the past decade: Access to the stock and bond markets has never been easier or cheaper.\n' +
                    '\n' +
                    'In recent years, small investors have become able to trade a wide collection of exchange-traded funds without charge — and they could build entire portfolios on their own with little effort and for little money. They also have more options to outsource the job entirely to mostly automated services, which will build and monitor your nest egg for a tiny fraction of the cost of your grandfather’s financial adviser.\n' +
                    '\n' +
                    'But that doesn’t mean all inexpensive products are created equal, or that investors should blindly assume that such products are always the right fit.\n' +
                    '\n' +
                    'Lower fees are almost always better for customers, said Alex Bryan, director of passive strategies research at Morningstar, but free trades don’t mean there are no underlying costs.\n' +
                    '\n' +
                    'Firms that forgo fees can make money in other ways, Mr. Bryan said. For example, the cash in your brokerage account — money you haven’t yet invested — may be pushed into the firm’s money market account during hours when the market is closed. While you do earn interest as a result, it’s below the market rate, and the firm pockets the difference.\n' +
                    '\n' +
                    '“Keep in mind that these firms aren’t charities,” Mr. Bryan said.\n' +
                    '\n' +
                    'The new plan will cost Schwab roughly 3 to 4 percent of its total net revenue — perhaps $100 million each quarter. But the firm noted that its “commissions per revenue trade” have been falling for several years, which may have given Schwab the confidence to become the first major firm to eliminate commissions across the board.\n' +
                    '\n' +
                    'Schwab’s fee elimination follows Interactive Brokers Group’s announcement last week of IBKR Lite, a service that will offer unlimited commission-free trading on domestic stocks and exchange-traded funds. (E.T.F.s are similar to index funds but trade like stocks on an exchange, meaning investors must pay commissions whenever they buy or sell shares, which also carry underlying investment fees.)\n' +
                    '\n' +
                    'Investment firms have long been moving in this direction, with no-fee E.T.F. offerings expanding steadily since they first appeared about a decade ago.', users[0]._id, 2, callback);
            },
            function(callback) {
                articleCreate("Another Fed Rate Cut Is Expected After Weak Economic Data", 'Top Federal Reserve officials have said they are open-minded about whether additional interest rate cuts will be necessary in 2019, but recent economic data are putting that equanimity to the test.\n' +
                    '\n' +
                    'The central bank cut rates for the first time since the Great Recession in late July, then followed that up in mid-September, likening the moves to taking out insurance. They were meant to give the economy a little bit of extra padding in case risks on the horizon — from uncertainty created by President Trump’s trade war to economic weakening in Asia and Europe that threatened to spill over — turned into realities.\n' +
                    '\n' +
                    'Data increasingly suggest that a slowdown is, in fact, materializing. Both of the Institute for Supply Management’s closely watched surveys, one that tracks manufacturing and another that monitors services, posted declines for September, reports this week showed. Consumer confidence has shown signs of weakening, and while spending is still growing, it has slowed from a robust pace earlier this year.\n' +
                    '\n' +
                    'Against that backdrop, investors have ramped up their expectations for a rate cut at the Fed’s Oct. 29-30 meeting. In the past week, they have gone from seeing a 50-50 chance that the Fed will cut rates this month to pricing in a move almost entirely.\n' +
                    '\n' +
                    'Subscribe to With Interest\n' +
                    'Catch up and prep for the week ahead with this newsletter of the most important business insights, delivered Sundays.\n' +
                    '\n' +
                    'SIGN UP\n' +
                    '“Clearly the data have shifted the narrative for the market,” said Matthew Luzzetti, chief United States economist at Deutsche Bank. “The data in July and September were more mixed — it is now clear that a slowdown has taken hold.”\n' +
                    '\n' +
                    'Fed officials, including the chair, Jerome H. Powell, and the president of the Federal Reserve Bank of New York, John C. Williams, have been hesitant to clearly signal what comes next for monetary policy.\n' +
                    '\n' +
                    'You have 3 free articles remaining.\n' +
                    'Subscribe to The Times\n' +
                    'But their comments preceded the latest round of data. On Thursday evening, Richard Clarida, vice chair of the Fed, left the door open to coming rate cuts rather than trying to convince markets that they had gone too far in expecting an October move.\n' +
                    '\n' +
                    'The central bank takes its decisions “one meeting at a time,” Mr. Clarida said at a Wall Street Journal event when asked about the potential for a coming cut.\n' +
                    '\n' +
                    '“But we will act as appropriate to sustain a low unemployment rate, solid growth and stable inflation,” he added. “We said that in June, July and September, and I’m saying it to you tonight.”\n' +
                    '\n' +
                    'Editors’ Picks\n' +
                    '\n' +
                    'What Happened After the Joke: A Stand-Up’s Harrowing Tale\n' +
                    '\n' +
                    '‘Saturday Night Live’: Matthew Broderick Joins the Trump Team\n' +
                    '\n' +
                    'The Beauty of America’s Ugliest Ballpark\n' +
                    'Fed officials have had reasons to keep their options open. The end of October is far away, with many fresh data points between now and then. And until lately, incoming data had been mixed: Bad factory numbers came alongside strong consumer and service-sector figures.\n' +
                    '\n' +
                    'As signs of a broader deterioration surface, Friday’s jobs report will be in the spotlight. Officials have taken comfort in the fact that the labor market has remained strong, and will be looking for confirmation of that. Employers added 130,000 jobs in August, and economists expect them to hire a similar number this month.\n' +
                    '\n' +
                    'Even a great report may not shift expectations away from an October rate cut, said Neil Dutta, head of economics at Renaissance Macro Research. Fed officials and most economists anticipate decent hiring and low unemployment, so a strong job market would amount to reaffirmation.\n' +
                    '\n' +
                    'If the labor market shows signs of cracking, though, “the odds for a cut in December will probably look like October does now,” Mr. Dutta said.\n' +
                    '\n' +
                    'Should economic data weaken further, economists said, it is possible the Fed would move from its current mode — one in which it’s playing a protective offense — to all-out defense. They could signal that more aggressive rate cuts are coming, rather than the gentle midbusiness cycle adjustments underway.\n' +
                    '\n' +
                    'The data have yet to call for that change in stance, because there are many signs that economic activity is holding up. Wages are growing, though the pace has stopped accelerating. Unemployment is near a half-century low. Consumers continue to spend, and housing starts have headed higher.\n' +
                    '\n' +
                    'But the bright spots are getting fewer and farther between. Tiffany Wilding, chief United States economist at PIMCO, pointed out in a research note that the current level of manufacturing and service indexes has historically come alongside 1 percent overall growth.\n' +
                    '\n' +
                    'If the economy heads in that direction, it will be a major change from the 2.2 percent gross domestic product gains Fed officials expect in 2019.\n' +
                    '\n' +
                    'Charles Evans, president of the Federal Reserve Bank of Chicago, said on Bloomberg Television on Thursday that he had yet to decide whether the central bank should cut rates this month. But asked whether investors overreacted to weak manufacturing data by ramping up bets for a rate cut, he said, “It was an important piece of data — I don’t know if it was an overreaction.”\n' +
                    '\n' +
                    'Mr. Evans, who spoke before weak service industry data had been released, said the Fed was monitoring incoming information as it headed toward its Oct. 30 decision.\n' +
                    '\n' +
                    '“We’ll learn more before the meeting at the end of this month,” he said. “Whether or not one more rate cut at this point is the right decision or not, I think we’re just going to have to go into the meeting and see.”', users[3]._id, 4, callback);
            },
            function(callback) {
                articleCreate("Small Cap Stocks vs. Large Cap Stocks: What's the Difference?", 'Small cap stocks have fewer publicly-traded shares than mid or large-cap companies. As mentioned earlier, these businesses have between $300 million and $2 billion of the total dollar value of all outstanding shares—those held by investors, institutional investors, and company insiders.\n' +
                    '\n' +
                    'Smaller businesses will float smaller offerings of shares. So, these stocks may be thinly traded and it may take longer for their transactions to finalize. However, the small-cap marketplace is one place where the individual investor has an advantage over institutional investors. Since they buy large blocks of stocks, institutional investors do not involve themselves as frequently in small-cap offerings. If they did, they would find themselves owning controlling portions of these smaller businesses.\n' +
                    '\n' +
                    'Lack of liquidity remains a struggle for small-cap stocks, especially for investors who take pride in building their portfolios on diversification. This difference has two effects:\n' +
                    '\n' +
                    'Small cap investors may struggle to offload shares. When there is less liquidity in a marketplace, an investor may find it takes longer to buy or sell a particular holding with little daily trading volume.\n' +
                    'The managers of small-cap funds close their funds to new investors at lower assets under management (AUM) thresholds.\n' +
                    'Volatility struck small caps in late 2018, although this is not a new phenomenon. Small cap stocks did well in the first three quarters of 2018, entering September of that year with the Russell 2000 index up 13.4% compared to 8.5% for the S&P 500. Between 1980 and 2015, small caps averaged 11.24% annual growth in the face of rising interest rates, easily outpacing midcaps at 8.59% and large caps at 8.00%. In the first weeks of 2019, the Russell 2000 led the market by 7% to the S&P 500’s 3.7%.\n' +
                    '\n' +
                    ' Lack of liquidity remains a struggle for small caps, especially for investors who take pride in building their portfolios on diversification.\n' +
                    'Large Cap Stocks\n' +
                    'Large-cap stocks—also known as big caps—are shares that trade for corporations with a market capitalization of $10 billion or more. Large-cap stocks tend to be less volatile during rough markets as investors fly to quality and stability and become more risk-averse. These companies comprise over 90% of the American equities marketplace and include names such as mobile communications giant Apple (AAPL), multinational conglomerate Berkshire Hathaway (BRK.A), and oil and gas colossus Exxon Mobil (XOM). Many indices and benchmarks follow large-cap companies such as the Dow Jones Industrial Average (DJIA) and the Standard and Poor\'s 500 (S&P 500).\n' +
                    '\n' +
                    'Key Differences\n' +
                    'There is a decided advantage for large caps in terms of liquidity and research coverage. Large-cap offerings have a strong following, and there is an abundance of company financials, independent research, and market data available for investors to review. Additionally, large caps tend to operate with more market efficiency—trading at prices that reflect the underlying company—also, they trade at higher volumes than their smaller cousins.\n' +
                    '\n' +
                    'Despite its struggles, the earnings growth for the S&P 500 remains positive for the first quarter of 2019, with earnings outlooks for the end of the year totaling $154.67 per share. In early 2019, the S&P 500 experienced a breadth thrust—a market momentum indicator—in which more than 85% of the NYSE stocks advance within two-weeks.\n' +
                    '\n' +
                    'This momentum phenomenon historically signals an upswing in the market. In 1987, 2009, 2011, and 2016, it represented a prime buying opportunity for short-hold investors wishing to realize short term gains. However, in 2008, the breadth thrust was followed by a steep decline in the market some months after its occurrence in late March. Nevertheless, there are reasons to be optimistic when it comes to large caps.', users[0]._id, 1, callback);
            },
            function(callback) {
                articleCreate("Small Firm Effect", "What Is the Small Firm Effect?\n" +
                    "The small firm effect is a theory that holds that smaller firms, or those companies with a small market capitalization, outperform larger companies. Publicly traded companies are classified into three categories: large-cap ($10 billion +), mid-cap ($2-$10 billion), and small-cap (< $2 billion). Most small capitalization firms are startups or relatively young companies with high-growth potential. Within this class of stocks, there are even smaller classifications: micro-cap ($50 million - $2 billion) and nano-cap (<$50 million).\n" +
                    "\n" +
                    "The small firm effect market anomaly is a factor used to explain superior returns in Gene Fama and Kenneth French's Three-Factor Model, with the three factors being the market return, companies with high book-to-market values, and small stock capitalization. Of course, verification of this phenomenon is subject to some time period bias. The time period examined when looking for instances in which small-cap stocks outperform large-caps largely influences whether the researcher will find any instance of the small firm effect. At times, the small firm effect is used as a rationale for the higher fees that are often charged by fund companies for small-cap funds.\n" +
                    "\n" +
                    "Understanding the Small Firm Effect\n" +
                    "The small firm effect theory holds that smaller companies have a greater amount of growth opportunities than larger companies. Small-cap companies also tend to have a more volatile business environment, and the correction of problems—such as the correction of a funding deficiency—can lead to a large price appreciation.\n" +
                    "\n" +
                    "Finally, small-cap stocks tend to have lower stock prices, and these lower prices mean that price appreciations tend to be larger than those found among large-cap stocks. Tagging onto the small firm effect is the January effect, which refers to the stock price pattern exhibited by small-cap stocks in late December and early January. Generally, these stocks rise during that period, making small-cap funds even more attractive to investors.\n" +
                    "\n" +
                    " The small firm effect is not foolproof as large-cap stocks generally outperform small-cap stocks during recessions.\n" +
                    "Small Firm Effect Versus Neglected Firm Effect\n" +
                    "The small firm effect is often confused with the neglected firm effect. The neglected firm effect theorizes that publicly traded companies that are not followed closely by analysts tend to outperform those that receive attention or are scrutinized. The small firm effect and the neglected firm effect are not mutually exclusive. Some small-cap companies may be ignored by analysts, and so both theories can apply.\n" +
                    "\n" +
                    "Advantages of the Small Firm Effect\n" +
                    "Small-cap stocks tend to be more volatile than large-cap funds, but they potentially offer the greatest return. Small-cap companies have more room to grow than their larger counterparts. For example, it's easier for cloud computing company Appian (APPN) to double, or even triple, in size than Microsoft.\n" +
                    "\n" +
                    "Disadvantages of the Small Firm Effect\n" +
                    "On the other hand, it's much easier for a small-cap company to become insolvent than a large-cap company. Using the previous example, Microsoft has plenty of capital, a strong business model, and an even stronger brand, making it less susceptible to failure than small firms with none of those attributes.",  users[1]._id, 3, callback);
            },
            function(callback) {
                articleCreate("How the Fed Is Trying to Fix Its White Male Problem","The Federal Reserve’s research staff is far less diverse than the American population it is meant to serve, a reality that the central bank is trying to change as a reckoning over inclusion sweeps through the economics profession.\n" +
                    "\n" +
                    "Three in four Fed economists are men and a majority of those are white. That matters beyond optics: Varied backgrounds can help the Fed better understand the people its policies are meant to help, from working mothers to the underemployed.\n" +
                    "\n" +
                    "The Fed’s lack of diversity is not atypical in economics. Fewer women and minorities express interest in and complete degrees in the field. About 32 percent of economics Ph.D.s awarded in 2018 were to women, based on one survey, a share that has hardly budged over the past two decades.\n" +
                    "\n" +
                    "But a few years ago, officials at the Fed Board in Washington realized that entry-level hiring criteria were exacerbating the lack of diversity early in the Fed’s hiring pipeline.\n" +
                    "\n" +
                    "Subscribe to With Interest\n" +
                    "Catch up and prep for the week ahead with this newsletter of the most important business insights, delivered Sundays.\n" +
                    "\n" +
                    "SIGN UP\n" +
                    "The board receives hundreds of applications each year for research assistant positions, jobs that require technical skills in coding and statistics, but only a bachelor’s degree. To go through the résumés efficiently, managers would often prioritize highly ranked programs and would sometimes insist that students had earned good grades in a high-level math course called real analysis.\n" +
                    "\n" +
                    "That left the candidate pool unintentionally skewed in favor of those who gravitated toward the desired class and who could afford top universities — and that group seemed to be heavily made up of white men from privileged backgrounds, said David Wilcox, a senior fellow at the Peterson Institute who ran the Fed’s research and statistics division.\n" +
                    "\n" +
                    "You have 2 free articles remaining.\n" +
                    "Subscribe to The Times\n" +
                    "It showed through to the numbers. At the Fed Board of Governors in Washington, about 34 percent of research assistants were women in 2013, and 23 percent were minorities, according to a recent Brookings Institution report. That may have had a lasting impact, because research assistants often go back for doctorates and become full-fledged central bank economists.\n" +
                    "\n" +
                    "Criteria used to screen résumés were also poor predictors of which candidates would make great research assistants, Mr. Wilcox said.\n" +
                    "\n" +
                    "Editors’ Picks\n" +
                    "\n" +
                    "The Beauty of America’s Ugliest Ballpark\n" +
                    "\n" +
                    "This Is the Moment Rachel Maddow Has Been Waiting For\n" +
                    "\n" +
                    "What Happened After the Joke: A Stand-Up’s Harrowing Tale\n" +
                    "So starting several years ago, the central bank shook things up. It has begun casting a wider net for applicants, adding a recruiter who trekked out to a more varied set of schools. Starting in 2015, it brought in Amanda Bayer — a former Fed researcher who teaches at Swarthmore College — to help to rethink how résumés were reviewed. While the Fed cannot legally hire based on race and gender, it could make sure a broader swath of applicants were considered.",  users[2]._id, 5, callback);
            },
            function(callback) {
                articleCreate('This Week in Business: No More E-Cigarettes at Walmart, and an Attack on the World’s Oil Supply', 'When President Trump decided a year ago to roll back Obama-era rules for car pollution, California shrugged, ignored him and kept its stricter regulations. Thirteen other states then followed its lead. The auto industry isn’t equipped to make different cars for different states, so it must adhere to whoever’s rules are the tightest — rendering Mr. Trump’s moot. Peeved, the president has now revoked California’s right to break with the federal government’s looser environmental standards. His order is in a legal gray area, and on Friday, California and nearly two dozen other states sued to block it. The ultimate decision will have an obvious impact on carmakers as well as air quality. Tailpipe pollution is the United States’ largest source of greenhouse gases.\n' +
                    '\n' +
                    'Speaking of Car Problems\n' +
                    'More than 49,000 workers at General Motors went on strike last weekend to protest their pay, health care costs and job security. G.M. says it offered “best-in-class wages and benefits,” along with more employment opportunities, but the United Automobile Workers union wasn’t satisfied. The company has been making record profits for the past several years, and workers want to see more of those dollars in their paychecks. But they may be short on bargaining chips, as the union faces dwindling numbers and a federal corruption inquiry. Meanwhile, G.M. is eager to cut costs so that it can invest in new technologies like electric and self-driving cars.\n' +
                    '\n' +
                    'Subscribe to With Interest\n' +
                    'Catch up and prep for the week ahead with this newsletter of the most important business insights, delivered Sundays.\n' +
                    '\n' +
                    'SIGN UP\n' +
                    'Lower Rates Have Landed\n' +
                    'Surprise, surprise: The Federal Reserve decreased interest rates by a smidge (a quarter percentage point), making it cheaper for Americans to borrow money. The decision was widely expected, and was meant to juice the slowing economy. But Fed officials are still sharply divided on how much the rate cut was needed, considering that the economy is still pretty robust — unemployment is low, people are spending and wages are on the rise. On the flip side, more hawkish economists (and Mr. Trump) want the Fed to cut rates more drastically to head off a potential recession. But no one can agree how much of a threat that really is. Saudi Arabia could take months to fully restore oil output after its biggest oil-processing plant was attacked last Saturday by … well, it’s still not entirely clear. The Trump administration blames Iran, whose government denies it. Meanwhile, the Houthi rebels in Yemen, who are backed by Iran, are claiming responsibility, but no one believes that they had the resources to pull it off. Either way, the attack has squeezed the world’s oil supply, and Saudi Arabia has tapped into reserves to keep it flowing. Here in the United States, Mr. Trump is threatening retaliation against Iran, although it’s unclear what that means. His top priority? Keeping oil prices down and the economy steady, which would be hard to do if tensions between Iran and Saudi Arabia escalate further.\n' +
                    '\n' +
                    'Walmart Quits E-Cigarettes\n' +
                    'As the number of vaping-related lung illnesses keeps climbing, Walmart said on Friday that it would no longer sell e-cigarettes of any kind in its stores in the United States. (That is, after its current supply has sold out.) The action follows a federal initiative to ban dessert-flavored e-cigarette products, which are particularly popular among teenagers. For Walmart, it’s another example of taking corporate responsibility on a larger public issue. Earlier this month, the retailer announced that it would limit its ammunition and gun sales after a fatal shooting at one of its stores in El Paso, Tex. Also on Walmart’s docket: avoiding a potential discrimination lawsuit. Almost 200 female employees have claimed that they were paid less than their male counterparts from 1999 to 2011, and the company is working on a settlement offer.\n' +
                    '\n' +
                    'Editors’ Picks\n' +
                    '\n' +
                    'The Beauty of America’s Ugliest Ballpark\n' +
                    '\n' +
                    'This Is the Moment Rachel Maddow Has Been Waiting For\n' +
                    '\n' +
                    'What Happened After the Joke: A Stand-Up’s Harrowing Tale\n' +
                    'Boris Johnson’s Big Moment\n' +
                    'Now for the latest chapter in the Brexit saga: Britain’s Supreme Court is expected to make a decision this week about the legality of Prime Minister Boris Johnson’s decision to suspend Parliament two weeks ago. If he gets the thumbs up, he’ll be allowed to push forward with his Brexit plan (or lack thereof) unencumbered by his political opponents. But if the court doesn’t rule in his favor, his leadership will be seriously compromised — along with Brexit itself. The current deadline for Britain’s departure from the European Union is Oct. 31, and without an agreement in place for border checks and trade procedures, the country could see skyrocketing food prices, import and export delays and goodness knows what other economic havoc.', users[5]._id, 6,  callback);
            },
            function(callback) {
                articleCreate('Test Book 2', 'Longer-term bonds have been trading at interest rates that are lower than those on short-term securities — what is known as the yield curve inverting. It’s an unusual occurrence that often happens before recessions, and one that could signal that investors have become pessimistic about the economic outlook.\n' +
                    '\n' +
                    'The global economy is slowing as manufacturing activity weakens, and political tensions, including President Trump’s trade war with China, are creating uncertainty for businesses. That is slowing down investment, which could hold back growth.\n' +
                    '\n' +
                    'The Fed keeps a close eye on how fast the economy is expanding because the pace of growth is crucial to its two main goals: reaching maximum employment and maintaining stable inflation around 2 percent. A slowdown could prevent policymakers from hitting their long-elusive inflation goal, and a downturn might lead to higher unemployment.\n' +
                    '\n' +
                    'For now, consumers are powering the economy ahead. Unemployment is low, wages are rising and households are spending. But surveys in recent months have shown consumer sentiment may be wavering, a cause for concern if it bleeds into real-life behavior. Consumers fuel about 70 percent of the economy. The United States is in a comparatively strong position compared with other large economic powers: China’s economy has already begun to slow, Japan is nowhere near hitting its inflation target despite negative interest rates and Europe is showing cracks as Germany teeters on the brink of a recession.\n' +
                    '\n' +
                    'Against that backdrop, countries around the world have been cutting borrowing costs. Last week, the European Central Bank cut one of its policy rates to a record low and rolled out a broader package of monetary stimulus.\n' +
                    '\n' +
                    'After the Fed’s move on Wednesday, the focus will quickly turn to whether it will continue cutting rates before the year’s end, or if this move will be enough to keep the American economy humming along.\n' +
                    '\n' +
                    'Based on economic projections released Wednesday, a growing number of Fed officials expect one more reduction this year — in-line with investor and economist expectations.',  users[4]._id, 7, callback)
            }
        ],
        // optional callback
        cb);
}

console.log("Starting to connect database")
conn();
console.log("database connection established")
/*
async.series([
        createUsersAndTE,
        articleCreate
    ],
// Optional callback
    function(err, results) {
        if (err) {
            console.log('FINAL ERR: '+err);
        }
        else {
            console.log('Articles: '+results);

        }
        // All done, disconnect from database
    });
*/
const loader =  () =>{
    createUsersAndTE(()=>{
        console.log("create user and TE done")
        articleCreate(()=>{
            console.log("articles created")
        })
    })


}
loader();

