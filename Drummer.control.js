/**
 * Drummer for Bitwig - Algorithmic drum pattern generator
 * Based on the "260 Drum Machine Patterns" book.
 * Port of the Drummer device from scribble-for-max.
 * @version 0.1.0
 * @author Walmik Deshpande
 */

loadAPI(17)
host.setShouldFailOnDeprecatedUse(true)
host.defineController('Scribbletune', 'Drummer', '0.1.0', '021191cd-c3b6-49e0-9a61-927495b16b30', 'Drummer')

// ============================================================================
// DRUM PATTERNS — 268 patterns from "260 Drum Machine Patterns" book
// ============================================================================

const DRUM_PATTERNS = [
  {"title":"AfroCub1","signature":"4/4","length":16,"tracks":{"ch":"x-xxx-x-x-x-x-x-","rs":"---x--x-----x---","bd":"x-------x-x---x-"}},
  {"title":"AfroCub2","signature":"4/4","length":16,"tracks":{"ch":"x-xxx-x-x-x-x-x-","ht":"------x---------","mt":"----------x-----","rs":"---x--------x---","lt":"--------------x-","bd":"x-------x-----x-"}},
  {"title":"AfroCub3","signature":"4/4","length":16,"tracks":{"cc":"x-xxx-x-x-x-x-x-","ch":"x-x-x-x-x-x-x-x-","mt":"----------x-----","rs":"------x---------","lt":"--------------x-","bd":"x-------x-------"}},
  {"title":"AfroCub4","signature":"4/4","length":16,"tracks":{"cc":"x-xxx-x-x-x-x-x-","ch":"x-x-x-x-x-x-x-x-","rs":"---x--x---x---x-","bd":"x-------x-------"}},
  {"title":"AfroCub5","signature":"4/4","length":16,"tracks":{"ch":"--x---x---x---x-","mt":"x-------x-x-----","sd":"--xx-xx---------","lt":"------------xxxx","bd":"x---x---x---x---"}},
  {"title":"AfroCub6","signature":"4/4","length":16,"tracks":{"ch":"--x---x---x---x-","rs":"x-xx-x-xx-x-xx-x","cb":"x-xx-x-xx-x-xx-x","bd":"x---x---x---x---"}},
  {"title":"AfroCub7","signature":"4/4","length":16,"tracks":{"cc":"x-xxx-x-x-xxx-x-","ch":"x-x-x-x-x-x-x-x-","mt":"--------x-x-----","rs":"----x-----------","lt":"--------------x-","bd":"x-------x-x---x-"}},
  {"title":"AfroCub8","signature":"4/4","length":16,"tracks":{"ch":"--x---x---x---x-","ht":"--------xxx-----","mt":"x-----------xxx-","sd":"--xx-xx---------","bd":"x---x---x---x---"}},
  {"title":"AfroCub9","signature":"4/4","length":16,"tracks":{"ch":"--x---x---x---x-","ht":"-------x--------","mt":"---x-------x----","sd":"-xx--xx--xx--xx-","lt":"---------------x","cb":"x---x---x---x---","bd":"x---x---x---x---"}},
  {"title":"AfroCubBreak1","signature":"4/4","length":16,"tracks":{"ht":"------------[xx]---","mt":"----------x-----","sd":"---x--x-[xx]-------","lt":"--------------x-","cb":"x-xxx-x---------","bd":"x---------------"}},
  {"title":"AfroCubBreak2","signature":"4/4","length":16,"tracks":{"cc":"x---------------","mt":"---x-------x----","sd":"--x-x--x--x-x--x","lt":"------x-x-----x-","bd":"x---------------"}},
  {"title":"AfroCubBreak3","signature":"4/4","length":16,"tracks":{"ht":"---------xx-----","mt":"------xx--------","sd":"xx-xx-----------","lt":"------------xx-x"}},
  {"title":"AfroCubBreak4","signature":"4/4","length":16,"tracks":{"ht":"------------x-xx","mt":"----xx-x--------","lt":"--------x-------","cb":"x-xx------xx----"}},
  {"title":"AfroCubBreak5","signature":"4/4","length":16,"tracks":{"ch":"x---x---x---x---","mt":"----[xx]-xx--------","sd":"[xx]-xx------------","cb":"--------x-x-x-x-"}},
  {"title":"AfroCubBreak6","signature":"4/4","length":16,"tracks":{"ht":"----x-x---------","mt":"xx-x------------","sd":"--------xx-x----","lt":"------------x-xx"}},
  {"title":"Blues1","signature":"12/8","length":12,"tracks":{"ch":"x-xx-xx-xxxx","sd":"---x-----x-x","bd":"x-x--xx-x-x-"}},
  {"title":"Blues2","signature":"12/8","length":12,"tracks":{"ch":"xxxxxxxxxxxx","sd":"---x-x---x--","bd":"x-x---x-x--x"}},
  {"title":"Blues3","signature":"12/8","length":12,"tracks":{"ch":"xxxxxxxxxx-x","oh":"----------x-","sd":"---x-----x--","bd":"x-x--xx-x-x-"}},
  {"title":"Blues4","signature":"12/8","length":12,"tracks":{"cc":"x-xx-xx-xx--","ch":"x--x--x--x-x","oh":"----------x-","sd":"---x-----x--","bd":"x-x--xx-x-xx"}},
  {"title":"Blues5","signature":"12/8","length":12,"tracks":{"cc":"x--x-xx--x-x","ch":"---x-----x--"}},
  {"title":"Blues6","signature":"12/8","length":12,"tracks":{"cc":"x-xx-xx-xxxx","ch":"---x-----x--","sd":"---x-----x--","bd":"----------xx"}},
  {"title":"BluesBreak1","signature":"12/8","length":12,"tracks":{"cc":"x-----------","mt":"-----[xx]------","sd":"---[xx]-----[xx]--","lt":"-------[xx]----","bd":"x---x-x-x-xx"}},
  {"title":"BluesBreak2","signature":"12/8","length":12,"tracks":{"cc":"-----------x","ch":"x-----x-x---","sd":"-xxx---x-[xx]--","bd":"x---xxx-x-xx"}},
  {"title":"BluesBreak3","signature":"12/8","length":12,"tracks":{"cc":"x-----------","ch":"---x--x-----","sd":"-xxxxxxxx[xx]--","bd":"x---------xx"}},
  {"title":"Boogie1","signature":"4/4","length":16,"tracks":{"cc":"x---x---x---x---","sd":"----x-------x---","bd":"x--x---xx--x---x"}},
  {"title":"Boogie2","signature":"4/4","length":16,"tracks":{"cc":"x--xx--xx--xx--x","sd":"----x-------x---","bd":"x-------x--x----"}},
  {"title":"Boogie3","signature":"4/4","length":16,"tracks":{"cc":"x--xx--xx--xx--x","sd":"----x--x----x--x","bd":"x--x----x--x----"}},
  {"title":"BoogieBreak1","signature":"4/4","length":12,"tracks":{"cc":"x--x--x--x--","mt":"----xx------","sd":"-xx----xx---","lt":"----------xx","bd":"x--x--x--x--"}},
  {"title":"BoogieBreak2","signature":"4/4","length":12,"tracks":{"mt":"---xxx------","sd":"xxx---xxx---","lt":"---------xxx"}},
  {"title":"BoogieBreak3","signature":"4/4","length":12,"tracks":{"mt":"---x-----x--","sd":"-xx-xx-xx-xx","lt":"x-----x-----"}},
  {"title":"Bossa1","signature":"4/4","length":16,"tracks":{"cc":"x-x-x-x-x-x-x-x-","mt":"--x-----x-----x-","rs":"x-----x-----x---","bd":"x-----x-x-----x-"}},
  {"title":"Bossa2","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","rs":"--x-x---x-x---x-","bd":"x-----x-x-----x-"}},
  {"title":"Bossa3","signature":"4/4","length":16,"tracks":{"cc":"--x---x---x---x-","ch":"----x-------x---","rs":"x-x---x---x---x-","bd":"x-----x-x-----x-"}},
  {"title":"Bossa4","signature":"4/4","length":16,"tracks":{"cc":"--x---x---x---x-","ch":"----x-------x---","rs":"x-x---x---x---x-","bd":"x-----x-x-----x-"}},
  {"title":"Bossa5","signature":"4/4","length":16,"tracks":{"cc":"x---x---x---x---","ch":"----x-------x---","rs":"x-x---x-x-------","bd":"x-----x-x-----x-"}},
  {"title":"Bossa6","signature":"4/4","length":16,"tracks":{"cc":"x-x-x-x-x-x-x-x-","mt":"------x---------","rs":"----x-----x-----","lt":"------------x---","bd":"x-----x-x-----x-"}},
  {"title":"BossaBreak1","signature":"4/4","length":16,"tracks":{"ch":"-----------x----","mt":"x---------------","sd":"x-x---x-x--x----","lt":"--x---x-x-------"}},
  {"title":"BossaBreak2","signature":"4/4","length":16,"tracks":{"ht":"------x---------","mt":"--x-----------x-","sd":"x---x-------x---","lt":"--------x-------","bd":"x----x-x------x-"}},
  {"title":"BossaBreak3","signature":"4/4","length":16,"tracks":{"ch":"------------x---","ht":"--[xx]-------------","mt":"----------[xx]-----","sd":"[xx]-----------[xx]---","lt":"------[xx]---------"}},
  {"title":"ChaCha1","signature":"4/4","length":16,"tracks":{"ch":"----x-------x---","mt":"------------x-x-","sd":"------x---------","rs":"--x-------x-----","cb":"x---x---x---x---","bd":"x-----x-x-----x-"}},
  {"title":"ChaCha2","signature":"4/4","length":16,"tracks":{"ch":"----x-x-----x-x-","oh":"x-------x-------","mt":"------------x---","sd":"------x---------","lt":"--------------x-","cb":"x---x---x---x---","bd":"x-----x-x-----x-"}},
  {"title":"ChaCha3","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"------x---------","lt":"------------x-x-","cb":"x---x---x---x---","bd":"x-----x-------x-"}},
  {"title":"ChaChaBreak1","signature":"4/4","length":16,"tracks":{"mt":"------[xx]-------x-","sd":"[xx]-----------[xx]---","lt":"--x-----[xx]-------","cb":"--------------x-","bd":"--------------x-"}},
  {"title":"ChaChaBreak2","signature":"4/4","length":16,"tracks":{"mt":"----xx----xx----","lt":"-------xx----xx-","cb":"x---------------"}},
  {"title":"ChaChaBreak3","signature":"4/4","length":16,"tracks":{"mt":"--[xx]---xx--------","sd":"----[xx]-----------","lt":"----------x-xx-x"}},
  {"title":"Disco1","signature":"4/4","length":16,"tracks":{"ch":"x-x---x-x-x---x-","oh":"----x-------x---","sd":"----x-------x---","bd":"x---x---x---x---"}},
  {"title":"Disco1","signature":"4/4","length":16,"tracks":{"ch":"x-xx--xxxxxx--xx","oh":"----x-------x---","hc":"--x---x---x-x---","bd":"x---x---x---x---"}},
  {"title":"Disco2","signature":"4/4","length":16,"tracks":{"ch":"x-xx--xxxxxx--xx","oh":"----x-------x---","hc":"--x---x---x-x---","bd":"x---x---x---x---"}},
  {"title":"Disco3","signature":"4/4","length":16,"tracks":{"ch":"xx--xxxxxx--xxxx","oh":"--x-------x-----","hc":"--x-x-------x-x-","bd":"x---x--xx---x---"}},
  {"title":"Disco4","signature":"4/4","length":16,"tracks":{"ch":"-xxx-xxx-x-x-xxx","sd":"x---x---x-x-x---","hc":"----x-------x---","tb":"x-xxx-xxx-xxx-xx","bd":"x---x---x---x---"}},
  {"title":"Disco5","signature":"4/4","length":16,"tracks":{"ch":"xxxx-xxxx---x---","oh":"----------x---x-","sd":"----x-----------","hc":"----x-----x-x---","bd":"x---x---x---x---"}},
  {"title":"Disco6","signature":"4/4","length":16,"tracks":{"ch":"----x---x---x---","oh":"----------x---x-","sd":"xxx-x-----------","tb":"x-x-x-x-x-x-x-x-","bd":"x---x-x-x---x---"}},
  {"title":"Disco7","signature":"4/4","length":16,"tracks":{"ch":"-xxx-xxx---x-xxx","sd":"----x-------x---","hc":"----x---x---xx--","cb":"x---x---xxx-x---","bd":"x---x---x---x---"}},
  {"title":"Disco8","signature":"4/4","length":16,"tracks":{"ch":"xxx--xx-xxx--xx-","oh":"---x---x-------x","sd":"----x------xx---","hc":"x-x-x-------x---","bd":"x---x---x---x---"}},
  {"title":"Disco9","signature":"4/4","length":16,"tracks":{"ch":"--xx--x---xx--x-","sd":"----x-------x---","hc":"--x-x---x-x-x-x-","cb":"x---x---x---x---","bd":"x---x---x---x---"}},
  {"title":"Disco10","signature":"4/4","length":16,"tracks":{"ch":"xxxx-xx-x-x-----","oh":"------------x---","sd":"----x-----------","hc":"--x-x-----x-x---","bd":"x---x---x---x---"}},
  {"title":"Disco11","signature":"4/4","length":16,"tracks":{"ch":"x-x-----x-x-----","oh":"-x-------x------","sd":"----x-------x---","hc":"-x--x-------x---","bd":"x---x--xx---x--x"}},
  {"title":"Disco12","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x--x--x-x--x","tb":"x-xxx-xxx-xxx-xx","bd":"x-x-x---x---xx--"}},
  {"title":"DiscoBreak1","signature":"4/4","length":16,"tracks":{"ch":"--------x---x---","oh":"------x---x-----","sd":"------x---------","hc":"--x-x-----x-x---","bd":"x--xx---x--xx---"}},
  {"title":"DiscoBreak2","signature":"4/4","length":16,"tracks":{"ch":"--x-x-----------","oh":"------x---------","mt":"--------------xx","sd":"---------x-x----","lt":"------------xx--","bd":"--------x-x-----"}},
  {"title":"DiscoBreak3","signature":"4/4","length":16,"tracks":{"ht":"----------x-----","mt":"--x-------------","sd":"xx------xx------","tb":"--x-x-----------","bd":"----x-------x---"}},
  {"title":"DiscoBreak4","signature":"4/4","length":16,"tracks":{"ht":"----x-x---------","mt":"------------xxxx","sd":"--x-----xxxx----"}},
  {"title":"DiscoBreak5","signature":"4/4","length":16,"tracks":{"oh":"x---------------","mt":"-----------xx---","sd":"--------xxx-----","lt":"-------------xxx","bd":"----x-----------"}},
  {"title":"DiscoBreak6","signature":"4/4","length":16,"tracks":{"ch":"-x-x-x-x-x-x-x-x","sd":"x-x-x-x-x-x-x-x-"}},
  {"title":"DiscoBreak7","signature":"4/4","length":16,"tracks":{"ht":"--------x-------","mt":"--x-----------x-","sd":"x-----x-----x---","tb":"x-xxx-xxx-xxx-xx","bd":"----x-----x-----"}},
  {"title":"DiscoBreak8","signature":"4/4","length":16,"tracks":{"ch":"--x---x---x---x-","sd":"xx-xxx-xxx-xxx-x"}},
  {"title":"DiscoBreak9","signature":"4/4","length":16,"tracks":{"ch":"----x---------x-","mt":"------------xx--","sd":"--x-------xx----","lt":"--------xx------","bd":"--x-x-----------"}},
  {"title":"Funk1","signature":"4/4","length":16,"tracks":{"ch":"x---x---x---x---","oh":"---------------x","sd":"--x---------x---","bd":"x-----x--x------"}},
  {"title":"Funk2","signature":"4/4","length":16,"tracks":{"ch":"x---x---x---x---","oh":"--x-------------","ht":"----------x-----","sd":"-----x----------","lt":"--------------x-","bd":"x-x---xx-----x--"}},
  {"title":"Funk3","signature":"4/4","length":16,"tracks":{"ch":"x---x---x---x---","oh":"--------------x-","ht":"------x---------","sd":"-x--------x-----","bd":"x--xx--xx---x---"}},
  {"title":"Funk4","signature":"4/4","length":16,"tracks":{"ch":"x---x---x---x---","oh":"--------------x-","mt":"---------xx-----","sd":"---x---------x--","bd":"xx----xx---x----"}},
  {"title":"Funk5","signature":"4/4","length":16,"tracks":{"ch":"x---x---x---x---","oh":"-x--------------","mt":"---------------x","sd":"---x--------xx--","bd":"xx----xx-xx---x-"}},
  {"title":"Funk6","signature":"4/4","length":16,"tracks":{"ch":"x---x---x---x---","oh":"-----x----x-----","sd":"-------x----x---","bd":"--x---x---x---xx"}},
  {"title":"Funk7","signature":"4/4","length":16,"tracks":{"ch":"xx-xx--xx-xx-xx-","sd":"--x--xx--x--x--x","bd":"x--xx--xx-------"}},
  {"title":"Funk8","signature":"4/4","length":16,"tracks":{"ch":"xxx-x-xxx---x---","oh":"----------x---x-","sd":"-----x---x--x---","bd":"x--xx-x-x---x---"}},
  {"title":"Funk9","signature":"4/4","length":16,"tracks":{"ch":"x-x-xx--x--xx---","ht":"--------------x-","sd":"---x--xx-xx--x-x","bd":"x---x---x--x----"}},
  {"title":"Funk10","signature":"4/4","length":16,"tracks":{"ch":"------x----xx-xx","oh":"x--x---x-x------","sd":"-xx-x---x-x--x--","bd":"x--x---x-x-xx--x"}},
  {"title":"Funk11","signature":"4/4","length":16,"tracks":{"ch":"x---x----xx-x---","oh":"-----x-x--------","sd":"--x---x-x--x-x--","bd":"x----x-x-x------"}},
  {"title":"Funk12","signature":"4/4","length":16,"tracks":{"ch":"x--x-xx--x-xx---","oh":"--------------x-","sd":"----x--xx-x--x--","bd":"x--x-----x-xx---"}},
  {"title":"Funk13","signature":"4/4","length":16,"tracks":{"ch":"x-x--xx-x-x-----","oh":"---x--------x---","sd":"-------x-x----x-","bd":"----x------xx---"}},
  {"title":"Funk14","signature":"4/4","length":16,"tracks":{"ch":"x-x--xx-x-x-----","oh":"---x--------x---","sd":"-------x-x----x-","bd":"----x------xx---"}},
  {"title":"Funk15","signature":"4/4","length":16,"tracks":{"ch":"x-x-x---x-xxx---","oh":"------x-------x-","sd":"---x-x-x-x---x--","bd":"xx------x-x-x---"}},
  {"title":"FunkBreak1","signature":"4/4","length":16,"tracks":{"ch":"x--x------------","ht":"-----------x----","mt":"--------x-------","sd":"-xx-xxxx-xx--xxx","lt":"------------x---","bd":"x--x-------x----"}},
  {"title":"FunkBreak2","signature":"4/4","length":16,"tracks":{"ch":"x-x-------------","oh":"--------------x-","ht":"------------xx-x","mt":"--------x-------","sd":"----x-xx--------","bd":"x--x-------x----"}},
  {"title":"FunkBreak3","signature":"4/4","length":16,"tracks":{"ch":"x-x-------------","oh":"-x-x------------","ht":"-----------x----","mt":"--------xx------","sd":"----x-x---------","lt":"-------------xx-","bd":"xx-x----x-------"}},
  {"title":"FunkBreak4","signature":"4/4","length":16,"tracks":{"sd":"----[xx]----xx-[xx]---","bd":"x-x--x-x---x----"}},
  {"title":"FunkBreak5","signature":"4/4","length":16,"tracks":{"ht":"------[xx]x--------","mt":"---[xx]x-----------","sd":"[xx]x----------[xx]-xx","lt":"---------[xx]x-----"}},
  {"title":"FunkBreak6","signature":"4/4","length":16,"tracks":{"ch":"x---------------","sd":"----xx-x--[xx]---xx","bd":"x--------x------"}},
  {"title":"FunkBreak7","signature":"4/4","length":16,"tracks":{"ht":"-------------xx-","sd":"-xxxx-xxx-[xx]-----","bd":"x----x---x------"}},
  {"title":"FunkBreak8","signature":"4/4","length":16,"tracks":{"ht":"---------x------","sd":"x--xx---x---[xx]---","lt":"----------x-----","bd":"-----x-----x----"}},
  {"title":"FunkBreak9","signature":"4/4","length":16,"tracks":{"ht":"--------xx------","mt":"------xx--------","sd":"xxxx------------","lt":"------------xx--"}},
  {"title":"FunkBreak10","signature":"4/4","length":16,"tracks":{"cc":"------------x---","mt":"---[xx]------------","sd":"[xx]---------xx----","lt":"------[xx]---------","bd":"------------x---"}},
  {"title":"FunkBreak11","signature":"4/4","length":16,"tracks":{"ht":"--------xx-x----","mt":"-------------x--","sd":"------x---------","lt":"--------------x-","bd":"x---x--xx-x-x---"}},
  {"title":"FunkBreak12","signature":"4/4","length":16,"tracks":{"ch":"x--x----x--x----","mt":"------------xx--","sd":"-xx-xxxx-xx-----","lt":"--------------xx","bd":"x--x----x--x----"}},
  {"title":"FunkBreak13","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-----------","ht":"------------xx--","mt":"--------xxx-----","sd":"----xxxx--------","lt":"--------------xx","bd":"x--x-------x----"}},
  {"title":"FunkBreak14","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-----","sd":"----x--x-x--[xx]-[xx]-","bd":"x--x-------x-x-x"}},
  {"title":"FunkBreak15","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-----","sd":"----x--x-x--x--[xx]","bd":"x--x-------x----"}},
  {"title":"Jazz1","signature":"4/4","length":12,"tracks":{"cc":"x--x-xx--x-x","sd":"---x-------x","bd":"x----x------"}},
  {"title":"Jazz2","signature":"4/4","length":12,"tracks":{"cc":"x--x-xx--x-x","sd":"--x------x-x","bd":"x-----x-----"}},
  {"title":"Jazz3","signature":"4/4","length":12,"tracks":{"cc":"x--x-xx--x-x","sd":"---x-x---x--","bd":"------x----x"}},
  {"title":"Jazz4","signature":"4/4","length":12,"tracks":{"cc":"x--x-xx--x-x","sd":"--x-----x--x","bd":"x----x------"}},
  {"title":"Jazz5","signature":"4/4","length":12,"tracks":{"cc":"x--x-xx--x-x","sd":"---x-----x--","bd":"x-x---x-x---"}},
  {"title":"Jazz6","signature":"4/4","length":12,"tracks":{"cc":"x--x-xx--x-x","sd":"-----x--x---","bd":"x-x---------"}},
  {"title":"JazzBreak1","signature":"4/4","length":12,"tracks":{"cc":"x-xx-x------","mt":"---------xxx","sd":"---x--xxx---","bd":"x----x------"}},
  {"title":"JazzBreak2","signature":"4/4","length":12,"tracks":{"cc":"x-----------","mt":"--------xxxx","sd":"--xxxxx-----","bd":"x-----------"}},
  {"title":"JazzBreak3","signature":"4/4","length":12,"tracks":{"cc":"x-xx-xx-----","sd":"---x----xxxx","bd":"x-x--xx-----"}},
  {"title":"March1","signature":"4/4","length":16,"tracks":{"ch":"--x---x---x---x-","sd":"x-x-xx-xx-x-xxxx","bd":"x---x---x---x---"}},
  {"title":"March2","signature":"4/4","length":16,"tracks":{"ch":"--x---x---x---x-","sd":"x-xxx-xxx-xxxxxx","bd":"x---x---x---x---"}},
  {"title":"MarchBreak1","signature":"4/4","length":16,"tracks":{"cc":"----------x---x-","ht":"--------[xx]-------","mt":"----[xx]-----------","sd":"[xx]---------------","lt":"------------[xx]---","bd":"--x---x---x---x-"}},
  {"title":"MarchBreak2","signature":"4/4","length":16,"tracks":{"ch":"--x---x---x-----","sd":"x-xx--x-xxxx--x-","bd":"x---x---x---x---"}},
  {"title":"Tango1","signature":"4/4","length":16,"tracks":{"ch":"----x-------x---","sd":"x---x---x---x-x-","bd":"x---x---x---x---"}},
  {"title":"TangoBreak1","signature":"4/4","length":16,"tracks":{"ch":"x---------------","sd":"--x---x-x-x-x-x-","bd":"x-------x-x-x-x-"}},
  {"title":"Paso1","signature":"4/4","length":16,"tracks":{"cc":"x-x-x-x-x-xxx-x-","ch":"--x---x---x---x-","sd":"--x---x---xx--x-","bd":"x---x---x---x---"}},
  {"title":"Paso2","signature":"4/4","length":16,"tracks":{"cc":"x-x-x-x-x-x-x-x-","ch":"--x---x---x---x-","sd":"--x---x-x-x-x-x-","bd":"x---x---x---x---"}},
  {"title":"PasoBreak1","signature":"4/4","length":16,"tracks":{"sd":"xx-x-xx-xx-xx-x-","bd":"x---x---x---x---"}},
  {"title":"PasoBreak2","signature":"4/4","length":16,"tracks":{"ch":"x---x---x---x---","mt":"-----xx---------","sd":"-x-x--------x-[xx]-","lt":"---------x-x----","bd":"x---x---x---x---"}},
  {"title":"Charleston1","signature":"4/4","length":16,"tracks":{"cc":"x---x--xx---x--x","ch":"----x-------x---","sd":"----x-------x---","bd":"x-------x-------"}},
  {"title":"CharlestonBreak1","signature":"4/4","length":16,"tracks":{"ch":"----x-------x---","sd":"--x---x-x---x---","bd":"x-------x-------"}},
  {"title":"Pop1","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"xx-x-x-xxx-x-x-x"}},
  {"title":"Pop2","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"x-x--xxxx-x--xxx"}},
  {"title":"Pop3","signature":"4/4","length":16,"tracks":{"ch":"x-x-x--xx-x-x--x","oh":"------x-------x-","sd":"----x-------x---","bd":"xx-x-x--xx-x----"}},
  {"title":"Pop4","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","oh":"-------x-------x","sd":"----x-------x---","bd":"x-xx-x-x-x-x-x-x"}},
  {"title":"Pop5","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"xx-x----xx-x--xx"}},
  {"title":"Pop6","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"xx-x----xx-x----"}},
  {"title":"Pop7","signature":"4/4","length":16,"tracks":{"ch":"x-x---x-x-x---x-","oh":"----x-------x---","bd":"x-xx--x---xx--x-"}},
  {"title":"Pop8","signature":"4/4","length":16,"tracks":{"ch":"x---x---x---x---","oh":"--x---x---x---x-","sd":"----x-------x---","bd":"x-x---x---x---x-"}},
  {"title":"Pop9","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x---x---","oh":"----------x---x-","sd":"------x-----x-x-","bd":"x-x-------x-----"}},
  {"title":"Pop10","signature":"4/4","length":16,"tracks":{"ch":"xxxxxxxxxxxx----","oh":"-------------x-x","sd":"----x--x----x---","bd":"x-x-----xx-x-x-x"}},
  {"title":"Pop11","signature":"4/4","length":16,"tracks":{"ch":"-xxx-xxx-xxx-xxx","sd":"x---x---x---x---","bd":"--x--x-x--x--x-x"}},
  {"title":"Pop12","signature":"4/4","length":16,"tracks":{"ch":"xxxx-x-xxxxx-x-x","oh":"------x-------x-","sd":"----x-------x---","bd":"x-x----xx-x----x"}},
  {"title":"PopBreak1","signature":"4/4","length":16,"tracks":{"ht":"--------xx-x----","mt":"----x--x--------","sd":"xxxx------------","lt":"------------xxx-","bd":"xx------x-------"}},
  {"title":"PopBreak2","signature":"4/4","length":16,"tracks":{"ht":"------[xx]---------","mt":"---[xx]------------","sd":"[xx]-----------[xx]---","lt":"---------[xx]------","bd":"-xx-xx-xx-xx-xxx"}},
  {"title":"PopBreak3","signature":"4/4","length":16,"tracks":{"cc":"x---------------","ht":"-------------xxx","mt":"--------xx-x----","sd":"--[xx]---[xx]---------","bd":"x-------x-------"}},
  {"title":"PopBreak4","signature":"4/4","length":16,"tracks":{"sd":"----[xx]----xx-[xx]---","bd":"x-x--x-x---x----"}},
  {"title":"PopBreak5","signature":"4/4","length":16,"tracks":{"cc":"------------xx--","mt":"---[xx]------------","sd":"[xx]--------[xx]------","lt":"------[xx]---------","bd":"------------xx--"}},
  {"title":"PopBreak6","signature":"4/4","length":16,"tracks":{"cc":"x---------------","ch":"-------x--------","oh":"--------------x-","mt":"----xxx---------","sd":"x------x--------","lt":"-----------xxxx-"}},
  {"title":"Reggae1","signature":"4/4","length":16,"tracks":{"ch":"xx-x----x-x-x-x-","oh":"----x-----------","sd":"--------x-------","bd":"x---x---x---x---"}},
  {"title":"Reggae2","signature":"4/4","length":16,"tracks":{"ch":"--x---x---x---x-","rs":"----x-------x-x-","bd":"x-x---x-x-x-----"}},
  {"title":"Reggae3","signature":"4/4","length":16,"tracks":{"ch":"--x---xx--x---xx","rs":"----x----x--x---","bd":"x--x----x--x----"}},
  {"title":"Reggae4","signature":"4/4","length":16,"tracks":{"ch":"--x---x---x---x-","rs":"----x-------x---","bd":"----x-----x-x---"}},
  {"title":"Reggae5","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","rs":"---x--x---x-x---","bd":"x---x---x---x---"}},
  {"title":"Reggae6","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","rs":"----x-x-----x-x-","bd":"--------x-------"}},
  {"title":"Reggae7","signature":"4/4","length":12,"tracks":{"ch":"x-xx-xx-xx--","rs":"x----x---x--","bd":"------x-----"}},
  {"title":"Reggae8","signature":"4/4","length":12,"tracks":{"ch":"x-x---x-x---","oh":"---x-----x--","rs":"x-----x-----","bd":"--x---x-----"}},
  {"title":"Reggae9","signature":"4/4","length":12,"tracks":{"ch":"x--x-xx--x-x","rs":"---x-----x-x","bd":"x-----x-----"}},
  {"title":"Reggae10","signature":"4/4","length":16,"tracks":{"ch":"x-xxx-xxx-x-x-x-","sd":"-----------x--x-","rs":"--xx--xx--------","bd":"x---x---x---x---"}},
  {"title":"Reggae11","signature":"4/4","length":16,"tracks":{"ch":"x--x--x-x-xxx---","oh":"-x--x---------x-","rs":"--------x-------","bd":"--------x-------"}},
  {"title":"Reggae12","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","rs":"--------x-------","bd":"x-----x--x-xx---"}},
  {"title":"ReggaeBreak1","signature":"4/4","length":16,"tracks":{"ch":"------------x---","oh":"x---------------","ht":"----xx----------","mt":"------xx--------","sd":"x---------------","lt":"--------x-x-----","bd":"x-----------x---"}},
  {"title":"ReggaeBreak2","signature":"4/4","length":16,"tracks":{"oh":"------x---x---x-","ht":"--------x-------","mt":"------------xx--","sd":"----x-----------","bd":"------x---x---x-"}},
  {"title":"ReggaeBreak3","signature":"4/4","length":16,"tracks":{"oh":"--------------x-","ht":"--------xx------","mt":"--xx------------","sd":"xx----xx----xx--","lt":"----x-----x-----","bd":"--------------x-"}},
  {"title":"ReggaeBreak4","signature":"4/4","length":16,"tracks":{"ch":"----x-----------","oh":"------------x---","sd":"[xx]-x---x-x-x-x---","bd":"------------x---"}},
  {"title":"ReggaeBreak5","signature":"4/4","length":16,"tracks":{"ch":"--x-----x-------","oh":"----x-----x-----","sd":"[xx]-----[xx]-----[xx]---","bd":"--x-x---x-x-----"}},
  {"title":"ReggaeBreak6","signature":"4/4","length":16,"tracks":{"oh":"------------x---","ht":"--------xx------","mt":"------xx--------","sd":"x---------------","lt":"----------x-x---","bd":"x---------------"}},
  {"title":"ReggaeBreak7","signature":"4/4","length":12,"tracks":{"oh":"---------x--","mt":"------xxx---","sd":"[xx]xxx--------","lt":"---------x--","bd":"x--x--x--x--"}},
  {"title":"ReggaeBreak8","signature":"4/4","length":12,"tracks":{"ch":"-----------x","oh":"----------x-","ht":"---xxx------","mt":"------x-x---","sd":"x-x---------","lt":"---------xxx","bd":"x-----------"}},
  {"title":"ReggaeBreak9","signature":"4/4","length":12,"tracks":{"oh":"x-----------","ht":"----------xx","mt":"--xx--xx----","sd":"----xx--xx--","bd":"x-----------"}},
  {"title":"Rock1","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"x-x---x-x-------"}},
  {"title":"Rock2","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"x-x---x-x-x---x-"}},
  {"title":"Rock3","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x-x-","bd":"x-----x-x-------"}},
  {"title":"Rock4","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"x-----x---x---x-"}},
  {"title":"Rock5","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"x-x---x---x---x-"}},
  {"title":"Rock6","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"x-x---x---x-----"}},
  {"title":"Rock7","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x--x-x--x---","bd":"x-----x-x-x---x-"}},
  {"title":"Rock8","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x--x-x--x--x","bd":"x-x-----x-x-----"}},
  {"title":"Rock9","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x--x--x----x","bd":"x-------x-----x-"}},
  {"title":"Rock10","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"x-xx-x--x-xx-x--"}},
  {"title":"Rock11","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"--x---------x---","bd":"x-----x-x-------"}},
  {"title":"Rock12","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x----x--x---","bd":"x-x---x---x-----"}},
  {"title":"Rock13","signature":"4/4","length":16,"tracks":{"ch":"xxxxxxxxxxxxxxxx","sd":"----x-------x---","bd":"x------xx-------"}},
  {"title":"Rock14","signature":"4/4","length":16,"tracks":{"ch":"xxxxxxxxxxxxxxxx","sd":"----x-------x---","bd":"x--x--x-x------x"}},
  {"title":"Rock14","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x---","oh":"--------------x-","sd":"----x-------x---","bd":"x--x-xx-x-------"}},
  {"title":"RockBreak1","signature":"4/4","length":16,"tracks":{"ch":"x---------------","ht":"------------xxx-","mt":"----------x-----","sd":"--x-x-----------","bd":"x-----x-x-------"}},
  {"title":"RockBreak2","signature":"4/4","length":16,"tracks":{"cc":"---------------x","ht":"-----------x----","mt":"--------xx------","sd":"x-x-xxx---------","lt":"------------xxxx","bd":"x-------x-------"}},
  {"title":"RockBreak3","signature":"4/4","length":16,"tracks":{"sd":"x-x-x-x-x-x-[xx]---","lt":"x-x-x-x-x-x-----"}},
  {"title":"RockBreak4","signature":"4/4","length":16,"tracks":{"cc":"--------------x-","sd":"----[xx]---[xx]-------","bd":"x---------x---x-"}},
  {"title":"RockBreak5","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-----------","oh":"------------x---","ht":"------------xxx-","mt":"--------x-x-----","sd":"----x-xx--------","bd":"x-x-----x-------"}},
  {"title":"RockBreak6","signature":"4/4","length":16,"tracks":{"cc":"---------------x","ht":"-------------x--","mt":"------------x---","sd":"x-x-xxx--xxx----","lt":"--------------x-","bd":"x-------x------x"}},
  {"title":"RockBreak7","signature":"4/4","length":16,"tracks":{"cc":"x---------------","mt":"------x---------","sd":"--[xx]---------[xx]---","lt":"----------x-----","bd":"x---------------"}},
  {"title":"RockBreak8","signature":"4/4","length":16,"tracks":{"sd":"----x-x---x-x---","lt":"x-x-x-x-x-x-x-x-","bd":"x---x---x---x---"}},
  {"title":"RockBreak9","signature":"4/4","length":16,"tracks":{"ch":"x---------------","oh":"--x-------------","ht":"------------xxx-","mt":"--------xx-x----","sd":"----x-x---------","bd":"x-------x-------"}},
  {"title":"RockBreak10","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x---------","oh":"--------------x-","mt":"------------xx--","sd":"----x---x-x---xx","bd":"x-x-----x-------"}},
  {"title":"RockBreak11","signature":"4/4","length":16,"tracks":{"cc":"------x---------","ch":"x-x-x-----------","sd":"----x-----------","bd":"x-----x---------"}},
  {"title":"RockBreak12","signature":"4/4","length":16,"tracks":{"ht":"--------xx-x----","mt":"----xx-x--------","sd":"xx-x------------","lt":"-------------xx-","bd":"x-------x-------"}},
  {"title":"Rnb1","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x--xxx--x--x","bd":"x-x-------x--xx-"}},
  {"title":"Rnb2","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x----x----x-","bd":"x-xx-x-x---x-x-x"}},
  {"title":"Rnb3","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"x-x----x-x-x-x-x"}},
  {"title":"Rnb4","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x--x----x---","bd":"x-x-----xx-x-xx-"}},
  {"title":"Rnb5","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"x--x-xx--xx-----"}},
  {"title":"Rnb6","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"--x------x-x-xx-"}},
  {"title":"Rnb7","signature":"4/4","length":16,"tracks":{"ch":"x-x-x---x-x-x---","oh":"------x-------x-","sd":"----x--x----x---","bd":"x-xx----x-xx----"}},
  {"title":"Rnb8","signature":"4/4","length":16,"tracks":{"cc":"--x---x---x---x-","sd":"----x-------x---","bd":"x-x----x--x--x--"}},
  {"title":"Rnb9","signature":"4/4","length":16,"tracks":{"ch":"x---x---x---x---","oh":"--x---x---x---x-","sd":"----x-------x---","bd":"xx-x---xx-x-----"}},
  {"title":"Rnb10","signature":"4/4","length":16,"tracks":{"oh":"--x---x---x---x-","sd":"----x--x-x--x---","bd":"x-x-----x-xx----"}},
  {"title":"Rnb11","signature":"4/4","length":16,"tracks":{"ch":"xxxxxxx-xxxxxxx-","oh":"-------x-------x","sd":"---x---------x--","bd":"xx-----xx-x-----"}},
  {"title":"Rnb12","signature":"4/4","length":16,"tracks":{"ch":"xx-xxx-xxx-xxx-x","oh":"--x---x---x---x-","sd":"----x-------x---","bd":"x-x----xx-x--xx-"}},
  {"title":"RnbBreak1","signature":"4/4","length":16,"tracks":{"cc":"x-x-------------","mt":"----------x-----","sd":"----xx-x-x--xx--","lt":"--------------x-","bd":"x-x-------------"}},
  {"title":"RnbBreak2","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-----------","sd":"----x-xx-xxx--xx","bd":"x-------x---xx--"}},
  {"title":"RnbBreak3","signature":"4/4","length":16,"tracks":{"cc":"x---------------","ht":"------------x---","mt":"----------x---xx","sd":"--xxxx-x-x------","bd":"x------------x--"}},
  {"title":"RnbBreak4","signature":"4/4","length":16,"tracks":{"cc":"------------x---","sd":"--[xx]--[xx]--[xx]--[xx]--[xx]-","bd":"xx-xx-xx-xx-x---"}},
  {"title":"RnbBreak5","signature":"4/4","length":16,"tracks":{"cc":"x-----------x-x-","mt":"-------xx-------","sd":"----xx----xx----","bd":"x-----------x-x-"}},
  {"title":"RnbBreak6","signature":"4/4","length":16,"tracks":{"cc":"--------------x-","mt":"------[xx]---------","sd":"[xx]-----------[xx]---","bd":"-x--x--x--x---x-"}},
  {"title":"Samba1","signature":"4/4","length":16,"tracks":{"cc":"x-xxx-xxx-xxx-xx","mt":"x-x----x-x------","lt":"-----x-----x-xx-","bd":"x--xx--xx--xx--x"}},
  {"title":"Samba2","signature":"4/4","length":16,"tracks":{"cc":"x-xxx-xxx-xxx-xx","mt":"x-x-----x-------","lt":"-----x-----x-x--","bd":"x--xx--xx--xx--x"}},
  {"title":"Samba3","signature":"4/4","length":16,"tracks":{"cc":"x-xxx-xxx-xxx-xx","mt":"x-x-----x-------","lt":"-----x-----x-x--","bd":"x--xx--xx--xx--x"}},
  {"title":"Samba4","signature":"4/4","length":16,"tracks":{"ch":"-x-x--x-x--x--x-","ht":"x-x-------------","mt":"----xx-x--------","sd":"---------xx-----","lt":"------------xx-x","bd":"x--xx--xx--xx--x"}},
  {"title":"Samba5","signature":"4/4","length":16,"tracks":{"cc":"x--xx-xx-xx-xx--","ch":"--x---x---x---x-","mt":"-----x--------xx","rs":"--x-----x--x----","bd":"x--xx--xx--xx--x"}},
  {"title":"Samba6","signature":"4/4","length":16,"tracks":{"cc":"x-x-xxxx-x-xx-x-","ch":"--x---x---x---x-","mt":"--------------xx","rs":"x-x----x-x-x----","bd":"x--xx--xx--xx--x"}},
  {"title":"SambaBreak1","signature":"4/4","length":16,"tracks":{"ht":"--------x-x-----","mt":"----x-xx--------","sd":"xxx-------------","lt":"------------xxx-","bd":"x--xx--xx--xx--x"}},
  {"title":"SambaBreak2","signature":"4/4","length":16,"tracks":{"mt":"--------x-x-----","sd":"xxx---------x-x-","lt":"----x-x---------"}},
  {"title":"SambaBreak3","signature":"4/4","length":16,"tracks":{"ch":"------------x---","mt":"x-x-------------","sd":"x-x---x-x---x---","lt":"------x-x-------","bd":"------------x---"}},
  {"title":"Shuffle1","signature":"4/4","length":12,"tracks":{"cc":"x-xx-xx-xx-x","sd":"---x-----x--","bd":"x-x--xx-----"}},
  {"title":"Shuffle2","signature":"4/4","length":12,"tracks":{"cc":"x-xx-xx-xx-x","sd":"---x-x---x--","bd":"x-----x-x---"}},
  {"title":"Shuffle3","signature":"4/4","length":12,"tracks":{"cc":"x-xx-xx-xx-x","sd":"---x-x-xxx--","bd":"x-x---x----x"}},
  {"title":"Shuffle4","signature":"4/4","length":12,"tracks":{"cc":"x-xx-xx-xx-x","sd":"---x-----x--","bd":"x-x--x--x---"}},
  {"title":"Shuffle5","signature":"4/4","length":12,"tracks":{"cc":"x-xx-xx-xx-x","sd":"---x---xxx--","bd":"x----xx----x"}},
  {"title":"Shuffle6","signature":"4/4","length":12,"tracks":{"cc":"x-xx-xx-xx-x","sd":"x-xx-xx-xx-x","bd":"x-xx-xx-xx-x"}},
  {"title":"ShuffleBreak1","signature":"4/4","length":12,"tracks":{"ht":"---------x--","mt":"------xxx---","sd":"xxxxxx------","lt":"----------xx","bd":"x----xx-----"}},
  {"title":"ShuffleBreak2","signature":"4/4","length":12,"tracks":{"ht":"-------x-x-x","mt":"------x-x-x-","sd":"-xxxxx------","bd":"x-----x-----"}},
  {"title":"ShuffleBreak3","signature":"4/4","length":12,"tracks":{"mt":"---------xxx","sd":"-x-xxx-x----","bd":"x-x---x-x---"}},
  {"title":"Ska1","signature":"4/4","length":16,"tracks":{"ch":"--x---x---x-----","oh":"--------------x-","sd":"----x-------x---","bd":"x-------x-------"}},
  {"title":"Ska2","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"x-------x-------"}},
  {"title":"Ska3","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x---","oh":"--------------x-","sd":"----x-------x---","bd":"x---x---x---x---"}},
  {"title":"SkaBreak1","signature":"4/4","length":16,"tracks":{"sd":"x-xxx-x-x-xxxxxx"}},
  {"title":"SkaBreak2","signature":"4/4","length":16,"tracks":{"oh":"x-------x-------","sd":"--xxx-x---xxxxxx","bd":"x-------x-------"}},
  {"title":"SkaBreak3","signature":"4/4","length":16,"tracks":{"ch":"x---x---x---x---","oh":"--x---x---x---x-","ht":"----------x-----","mt":"------x---------","sd":"--x-------------","lt":"--------------x-","bd":"x---x---x---x---"}},
  {"title":"Slow1","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"x-x----xx-x--x--"}},
  {"title":"Slow2","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"xx----xx--x--x--"}},
  {"title":"Slow3","signature":"4/4","length":16,"tracks":{"ch":"x-xxx-x-x-x-xxx-","sd":"----x-------x---","bd":"x-----x-x-x-----"}},
  {"title":"Slow4","signature":"4/4","length":16,"tracks":{"ch":"x-x-xxx---x-x---","oh":"-------x------x-","sd":"----x-------x---","bd":"x------x--------"}},
  {"title":"Slow5","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"----x-------x---","bd":"x-----xx--------"}},
  {"title":"Slow6","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-xx--xx--","oh":"----------x---x-","sd":"--------x-------","bd":"x-----x---x---x-"}},
  {"title":"Slow7","signature":"4/4","length":16,"tracks":{"ch":"xx--xx--xx--xx--","oh":"--x---x---x---x-","sd":"--------x-------","bd":"x-----x-------x-"}},
  {"title":"Slow8","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x-x-","sd":"--------x-------","bd":"x---x-x-------x-"}},
  {"title":"Slow9","signature":"4/4","length":16,"tracks":{"ch":"x-xx--x-x-x-x-x-","oh":"----x-----------","sd":"--------x-------","bd":"x-----x---x---x-"}},
  {"title":"Slow10","signature":"4/4","length":16,"tracks":{"ch":"x---x---x---x---","oh":"--x-------x-----","sd":"----x-------x---","bd":"x------xx----x-x"}},
  {"title":"Slow11","signature":"4/4","length":16,"tracks":{"ch":"xxxxxxx-xxxxxxx-","oh":"-------x-------x","sd":"----x-------x---","bd":"x-xx---xx-x-----"}},
  {"title":"Slow12","signature":"4/4","length":16,"tracks":{"ch":"xxxxxx-xxxxxxx-x","oh":"------x-------x-","sd":"----x-------x---","bd":"x------xx-x--x--"}},
  {"title":"SlowBreak1","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x-x-x-x---","sd":"----x-------xxxx","bd":"x------xx-------"}},
  {"title":"SlowBreak2","signature":"4/4","length":16,"tracks":{"ch":"x-x-x-x---------","mt":"--------x-xx----","sd":"----x-----------","lt":"------------x-xx","bd":"x------xx-------"}},
  {"title":"SlowBreak3","signature":"4/4","length":16,"tracks":{"oh":"--------------x-","mt":"---[xx]------------","sd":"[xx]--------[xx]--xx--","lt":"-----[xx]----------","bd":"-x--x--x--x---x-"}},
  {"title":"SlowBreak4","signature":"4/4","length":16,"tracks":{"ch":"x-x-------------","oh":"--------------x-","ht":"----------xx----","mt":"--------x-------","sd":"---xx-x---------","lt":"------------x-x-","bd":"x------------x-x"}},
  {"title":"SlowBreak5","signature":"4/4","length":16,"tracks":{"ch":"--x-------------","oh":"------x---------","mt":"----[xx]--------xx-","sd":"[xx]--------x-xx---","bd":"--x---x---------"}},
  {"title":"SlowBreak6","signature":"4/4","length":16,"tracks":{"cc":"xx--------------","oh":"--------x-------","ht":"--------------[xx]-","mt":"------xx--------","sd":"----[xx]-------[xx]---","bd":"xx------x-------"}},
  {"title":"Swing1","signature":"4/4","length":12,"tracks":{"cc":"x--x-xx--x-x","sd":"---x-----x--","bd":"x----xx----x"}},
  {"title":"Swing2","signature":"4/4","length":12,"tracks":{"cc":"x--x-xx--x-x","sd":"---x-----x-x","bd":"x----xx-----"}},
  {"title":"Swing3","signature":"4/4","length":12,"tracks":{"cc":"x--x-xx--x-x","sd":"---x-----x-x","bd":"x--x--x--x--"}},
  {"title":"Swing3","signature":"4/4","length":12,"tracks":{"cc":"x--x-xx--x-x","sd":"---x-x---x--","bd":"x-----x----x"}},
  {"title":"Swing5","signature":"4/4","length":12,"tracks":{"cc":"x--x-xx--x-x","sd":"---x-----x--","bd":"x-----x-x--x"}},
  {"title":"Swing6","signature":"4/4","length":12,"tracks":{"cc":"x--x-xx--x-x","sd":"---x-x---x--","bd":"x-x---x-x---"}},
  {"title":"SwingBreak1","signature":"4/4","length":12,"tracks":{"sd":"[xx]-[xx]-[xx]-[xx]-[xx]-[xx]-","bd":"-x-x-x-x-x-x"}},
  {"title":"SwingBreak2","signature":"4/4","length":12,"tracks":{"ht":"------xx----","mt":"---xx-------","sd":"xx----------","lt":"---------xx-","bd":"--x--x--x--x"}},
  {"title":"SwingBreak3","signature":"4/4","length":12,"tracks":{"cc":"x-xx--------","mt":"----------xx","sd":"---x---xx---","bd":"x-x---x--x--"}},
  {"title":"Twist1","signature":"4/4","length":16,"tracks":{"cc":"x-xxx-x-x-x-x-x-","ch":"x---x---x---x---","sd":"----x-x-----x---","bd":"x-------x-x-----"}},
  {"title":"Twist2","signature":"4/4","length":16,"tracks":{"cc":"x-x-x-x-x-x-x-x-","sd":"--x-x-x-----x---","bd":"x-------x-------"}},
  {"title":"Twist3","signature":"4/4","length":16,"tracks":{"cc":"x---x-x-x---x---","ch":"x-x-x-x-x-x-x-x-","sd":"----x-x-----x---","bd":"x-------x-------"}},
  {"title":"TwistBreak1","signature":"4/4","length":16,"tracks":{"mt":"x-x-x-x-x-x-----","sd":"x-x-x-x-----[xx]-[xx]-","lt":"--------x-x-----"}},
  {"title":"TwistBreak2","signature":"4/4","length":16,"tracks":{"mt":"--x-x-x---------","sd":"[xx]-x-x-x-x-x-xxxx","lt":"--------x-x-----"}},
  {"title":"TwistBreak3","signature":"4/4","length":16,"tracks":{"cc":"--------------x-","ch":"x---x---x---x---","mt":"--------xx-x-x--","sd":"xx-x-xxx------x-"}},
  {"title":"Waltz1","signature":"3/4","length":12,"tracks":{"cc":"x---x--xx---","ch":"----x---x---","sd":"----x---x---","bd":"x-----------"}},
  {"title":"Waltz2","signature":"3/4","length":12,"tracks":{"cc":"x-----------","ch":"----x---x---","sd":"----x---x---","bd":"x-----------"}},
  {"title":"Waltz3","signature":"3/4","length":12,"tracks":{"cc":"x---x---x--x","ch":"----x---x---","sd":"----x---x--x","bd":"x-----------"}},
  {"title":"WaltzBreak1","signature":"3/4","length":12,"tracks":{"cc":"x-----------","ch":"----x---x---","sd":"----x-x-x-x-","bd":"x-----------"}},
  {"title":"WaltzBreak2","signature":"3/4","length":12,"tracks":{"ch":"----x---x---","mt":"----[xx]-------","sd":"[xx]-----------","lt":"--------[xx]---","bd":"x-----------"}},
  {"title":"WaltzBreak3","signature":"3/4","length":12,"tracks":{"ch":"----x---x---","mt":"----x-x-----","sd":"[xx]-----------","lt":"--------x-x-"}},
  {"title":"Ending1","signature":"3/4","length":16,"tracks":{"ch":"x---------------","bd":"x---------------"}},
  {"title":"Ending2","signature":"3/4","length":16,"tracks":{"cc":"--------x-------","mt":"----[xx]-----------","sd":"[xx]---------------","bd":"--------x-------"}},
  {"title":"Ending3","signature":"3/4","length":16,"tracks":{"cc":"--------x-------","mt":"---xx-----------","sd":"xx--------------","lt":"------x---------","bd":"--------x-------"}}
]

// ============================================================================
// CONSTANTS
// ============================================================================

// MIDI note = 24 + (baseOctave * 12) + semitones
// At baseOctave=1 this matches General MIDI drum map exactly.
const DRUM_KIT_OFFSETS = {
  bd: { semitones: 0,  velocity: 100 }, // Bass drum   → GM 36 (C2)
  sd: { semitones: 2,  velocity: 90  }, // Snare       → GM 38 (D2)
  ch: { semitones: 6,  velocity: 70  }, // Closed hat  → GM 42 (F#2)
  oh: { semitones: 10, velocity: 75  }, // Open hat    → GM 46 (A#2)
  hc: { semitones: 6,  velocity: 70  }, // Hat close (alias of ch)
  ht: { semitones: 9,  velocity: 85  }, // High tom    → GM 45 (A2)
  mt: { semitones: 7,  velocity: 85  }, // Mid tom     → GM 43 (G2)
  lt: { semitones: 5,  velocity: 85  }, // Low tom     → GM 41 (F2)
  tb: { semitones: 5,  velocity: 85  }, // Tom bass (alias of lt)
  rs: { semitones: 1,  velocity: 80  }, // Rim shot    → GM 37 (C#2)
  cl: { semitones: 3,  velocity: 85  }, // Clap        → GM 39 (D#2)
  cb: { semitones: 8,  velocity: 80  }, // Cowbell     → GM 44 (G#2)
  cy: { semitones: 13, velocity: 85  }, // Cymbal      → GM 49 (C#3)
  cc: { semitones: 13, velocity: 90  }  // Crash       → GM 49 (C#3)
}

// Step duration in beats (step positions converted to sixteenths via × 4)
const NOTE_DURATIONS = {
  '16n': 0.25,
  '8n':  0.5,
  '4n':  1.0
}

const GENRES = [
  'Random', 'AfroCub', 'Blues', 'Boogie', 'Bossa', 'ChaCha', 'Charleston',
  'Disco', 'Ending', 'Funk', 'Jazz', 'March', 'Paso', 'Pop', 'Reggae',
  'Rnb', 'Rock', 'Samba', 'Shuffle', 'Ska', 'Slow', 'Swing', 'Tango', 'Twist', 'Waltz'
]

// ============================================================================
// UTILITY
// ============================================================================

function getGenreFromTitle(title) {
  return title.replace(/[0-9].*$/, '').replace(/Break.*$/, '')
}

function selectPattern(genre, patternIndex) {
  if (genre === 'Random') {
    return DRUM_PATTERNS[Math.floor(Math.random() * DRUM_PATTERNS.length)]
  }
  let pool = DRUM_PATTERNS.filter(function(p) {
    return getGenreFromTitle(p.title) === genre
  })
  if (pool.length === 0) pool = DRUM_PATTERNS
  return pool[(patternIndex - 1) % pool.length]
}

function buildDrumKit(baseOctave) {
  const kit = {}
  const abbrs = Object.keys(DRUM_KIT_OFFSETS)
  for (let i = 0; i < abbrs.length; i++) {
    const abbr = abbrs[i]
    const def = DRUM_KIT_OFFSETS[abbr]
    kit[abbr] = {
      note: 24 + baseOctave * 12 + def.semitones,
      velocity: def.velocity
    }
  }
  return kit
}

// ============================================================================
// PATTERN PARSING
// ============================================================================

// Parses one track's pattern string into note objects.
// Pattern chars: x = hit, X = accented hit, - = rest, [...] = flam (one step)
// posInSixteenths = step * stepDuration * 4
// Ghost notes always placed one sixteenth before the main hit (posInSixteenths - 1).
function parseDrumTrack(trackStr, midiNote, baseVelocity, stepDuration, complexity, variation, ghostNotes) {
  const notes = []
  let i = 0
  let stepIndex = 0

  while (i < trackStr.length) {
    const ch = trackStr[i]

    if (ch === '[') {
      // Flam bracket: find matching ]
      let j = i + 1
      let depth = 1
      while (j < trackStr.length && depth > 0) {
        if (trackStr[j] === '[') depth++
        if (trackStr[j] === ']') depth--
        j++
      }

      const posInSixteenths = Math.round(stepIndex * stepDuration * 4)

      if (ghostNotes && posInSixteenths > 0) {
        notes.push({
          channel: 0,
          posInSixteenths: posInSixteenths - 1,
          pitch: midiNote,
          velocity: Math.max(1, Math.round(baseVelocity / 3)),
          length: stepDuration * 0.9
        })
      }

      let vel = baseVelocity
      if (complexity > 0) {
        const roll = Math.random()
        if (roll < complexity * 0.3) vel = Math.min(127, vel + 20)
        else if (roll < complexity * 0.6) vel = Math.max(20, vel - 30)
      }

      notes.push({
        channel: 0,
        posInSixteenths: posInSixteenths,
        pitch: midiNote,
        velocity: Math.min(127, Math.max(1, vel)),
        length: stepDuration * 0.9
      })

      stepIndex++
      i = j

    } else if (ch === 'x' || ch === 'X') {
      const posInSixteenths = Math.round(stepIndex * stepDuration * 4)
      const isAccent = ch === 'X'
      let vel = isAccent ? Math.min(127, baseVelocity + 20) : baseVelocity

      // Variation: accent strong beats
      if (!isAccent && variation > 0.4 && stepIndex % 4 === 0 && Math.random() < 0.25) {
        vel = Math.min(127, vel + 20)
      }

      // Complexity: velocity variation
      if (complexity > 0) {
        const roll = Math.random()
        if (roll < complexity * 0.3) vel = Math.min(127, vel + 20)
        else if (roll < complexity * 0.6) vel = Math.max(20, vel - 30)
      }

      vel = Math.min(127, Math.max(1, vel))

      // Ghost note: always from ghostNotes flag (25% chance), or from variation (10% chance)
      const ghostChance = ghostNotes ? 0.25 : (variation > 0.6 ? 0.1 : 0)
      if (ghostChance > 0 && posInSixteenths > 0 && Math.random() < ghostChance) {
        notes.push({
          channel: 0,
          posInSixteenths: posInSixteenths - 1,
          pitch: midiNote,
          velocity: Math.max(1, Math.round(baseVelocity / 3)),
          length: stepDuration * 0.9
        })
      }

      notes.push({
        channel: 0,
        posInSixteenths: posInSixteenths,
        pitch: midiNote,
        velocity: vel,
        length: stepDuration * 0.9
      })

      stepIndex++
      i++

    } else if (ch === '-') {
      const posInSixteenths = Math.round(stepIndex * stepDuration * 4)

      // Complexity: spontaneous fill on rests
      if (complexity > 0 && Math.random() < complexity * 0.5) {
        notes.push({
          channel: 0,
          posInSixteenths: posInSixteenths,
          pitch: midiNote,
          velocity: Math.max(1, baseVelocity - 40),
          length: stepDuration * 0.9
        })
      }

      stepIndex++
      i++

    } else {
      i++
    }
  }

  return notes
}

function buildDrumNotes(pattern, drumKit, noteLength, complexity, variation, ghostNotes, removeKick) {
  const stepDuration = NOTE_DURATIONS[noteLength] || 0.25
  const allNotes = []
  const abbrs = Object.keys(pattern.tracks)

  for (let i = 0; i < abbrs.length; i++) {
    const abbr = abbrs[i]
    if (abbr === 'bd' && removeKick) continue
    const kitEntry = drumKit[abbr]
    if (!kitEntry) continue

    const trackNotes = parseDrumTrack(
      pattern.tracks[abbr],
      kitEntry.note,
      kitEntry.velocity,
      stepDuration,
      complexity,
      variation,
      ghostNotes
    )
    for (let j = 0; j < trackNotes.length; j++) {
      allNotes.push(trackNotes[j])
    }
  }

  return allNotes
}

// ============================================================================
// CLIP WRITING
// ============================================================================

// Deduplicates same step+pitch pairs (keep highest velocity) before writing.
function writeNotesToClip(notes, clip) {
  const stepPitchMap = {}
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i]
    const key = note.posInSixteenths + ':' + note.pitch
    if (!stepPitchMap[key] || note.velocity > stepPitchMap[key].velocity) {
      stepPitchMap[key] = note
    }
  }

  const keys = Object.keys(stepPitchMap)
  for (let i = 0; i < keys.length; i++) {
    const note = stepPitchMap[keys[i]]
    if (note.posInSixteenths < 0 || note.posInSixteenths > 127) continue
    const pitch = Math.min(127, Math.max(0, Math.floor(note.pitch)))
    const velocity = Math.min(127, Math.max(1, Math.round(note.velocity)))
    clip.setStep(note.channel, note.posInSixteenths, pitch, velocity, Math.max(0.0625, note.length))
  }
}

// ============================================================================
// GENERATION
// ============================================================================

function generateDrums(genre, patternIndex, noteLength, baseOctave, complexity, variation, ghostNotes, removeKick, cursorClip) {
  const pattern = selectPattern(genre, patternIndex)
  const drumKit = buildDrumKit(baseOctave)
  const notes = buildDrumNotes(pattern, drumKit, noteLength, complexity, variation, ghostNotes, removeKick)

  const stepDuration = NOTE_DURATIONS[noteLength] || 0.25
  const clipBeats = Math.min(32, Math.max(1, pattern.length * stepDuration))

  cursorClip.getLoopLength().setRaw(clipBeats)
  cursorClip.clearSteps()
  writeNotesToClip(notes, cursorClip)
  host.showPopupNotification('Drummer: ' + pattern.title)
  host.println('Drummer: generated ' + pattern.title + ' (' + notes.length + ' notes)')
}

// ============================================================================
// BITWIG INITIALIZATION
// ============================================================================

function init() {
  host.println('-- Drummer for Bitwig Initialized! --')

  const documentState = host.getDocumentState()
  const cursorClip = host.createArrangerCursorClip(128, 128)
  cursorClip.scrollToKey(0)

  const genreParam       = documentState.getEnumSetting('Genre',        'Pattern', GENRES,                      'Random')
  const patternIndexParam= documentState.getNumberSetting('Pattern',    'Pattern', 1, 30, 1, '',                1)
  const noteLengthParam  = documentState.getEnumSetting('Note Length',  'Pattern', Object.keys(NOTE_DURATIONS), '16n')

  const baseOctaveParam  = documentState.getNumberSetting('Base Octave','Feel',    0, 3,   1,    '',            1)
  const complexityParam  = documentState.getNumberSetting('Complexity', 'Feel',    0.0, 1.0, 0.05, '',         0.0)
  const variationParam   = documentState.getNumberSetting('Variation',  'Feel',    0.0, 1.0, 0.05, '',         0.0)
  const ghostNotesParam  = documentState.getEnumSetting('Ghost Notes',  'Feel',    ['Off', 'On'],               'Off')
  const removeKickParam  = documentState.getEnumSetting('Remove Kick',  'Feel',    ['Off', 'On'],               'Off')

  documentState.getSignalSetting('Generate!', 'Actions', 'Generate').addSignalObserver(function() {
    generateDrums(
      genreParam.get(),
      Math.round(patternIndexParam.getRaw()),
      noteLengthParam.get(),
      Math.round(baseOctaveParam.getRaw()),
      complexityParam.getRaw(),
      variationParam.getRaw(),
      ghostNotesParam.get() === 'On',
      removeKickParam.get() === 'On',
      cursorClip
    )
  })

  documentState.getSignalSetting('Random Pattern', 'Actions', 'Random').addSignalObserver(function() {
    const genre = genreParam.get()
    let pool
    if (genre === 'Random') {
      pool = DRUM_PATTERNS
    } else {
      pool = DRUM_PATTERNS.filter(function(p) {
        return getGenreFromTitle(p.title) === genre
      })
      if (pool.length === 0) pool = DRUM_PATTERNS
    }
    const randomPattern = pool[Math.floor(Math.random() * pool.length)]
    const drumKit = buildDrumKit(Math.round(baseOctaveParam.getRaw()))
    const noteLength = noteLengthParam.get()
    const notes = buildDrumNotes(
      randomPattern,
      drumKit,
      noteLength,
      complexityParam.getRaw(),
      variationParam.getRaw(),
      ghostNotesParam.get() === 'On',
      removeKickParam.get() === 'On'
    )

    const stepDuration = NOTE_DURATIONS[noteLength] || 0.25
    const clipBeats = Math.min(32, Math.max(1, randomPattern.length * stepDuration))

    cursorClip.getLoopLength().setRaw(clipBeats)
    cursorClip.clearSteps()
    writeNotesToClip(notes, cursorClip)
    host.showPopupNotification('Drummer: ' + randomPattern.title)
    host.println('Drummer: random → ' + randomPattern.title)
  })

  documentState.getSignalSetting('Clear Clip', 'Actions', 'Clear').addSignalObserver(function() {
    cursorClip.clearSteps()
    host.showPopupNotification('Clip cleared')
  })

  host.println('-- Drummer for Bitwig Ready! --')
}

function flush() {}

function exit() {
  host.println('-- Drummer for Bitwig Goodbye! --')
}
